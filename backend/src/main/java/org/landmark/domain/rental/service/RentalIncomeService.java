package org.landmark.domain.rental.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.landmark.global.blockchain.service.BlockchainWalletService;
import org.landmark.global.toss.client.TossPaymentsClient;
import org.landmark.global.toss.dto.TossVirtualAccountRequest;
import org.landmark.global.toss.dto.TossVirtualAccountResponse;
import org.landmark.domain.properties.domain.Property;
import org.landmark.domain.properties.repository.PropertyRepository;
import org.landmark.domain.rental.domain.PropertyVirtualAccount;
import org.landmark.domain.rental.domain.RentalIncome;
import org.landmark.domain.rental.domain.RentalIncomeStatus;
import org.landmark.domain.rental.dto.PropertyVirtualAccountResponse;
import org.landmark.domain.rental.dto.RentalIncomeResponse;
import org.landmark.domain.rental.repository.PropertyVirtualAccountRepository;
import org.landmark.domain.rental.repository.RentalIncomeRepository;
import org.landmark.global.constants.PaymentConstants;
import org.landmark.global.exception.BusinessException;
import org.landmark.global.exception.ErrorCode;
import org.landmark.global.util.BankCode;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigInteger;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class RentalIncomeService {

    private final RentalIncomeRepository rentalIncomeRepository;
    private final PropertyVirtualAccountRepository propertyVirtualAccountRepository;
    private final PropertyRepository propertyRepository;
    private final TossPaymentsClient tossPaymentsClient;
    private final BlockchainWalletService blockchainWalletService;
    private final RentalIncomeTransactionService transactionService;

    /* Property별 임대 수익 전용 가상계좌 발급 */
    @Transactional
    public PropertyVirtualAccountResponse issueVirtualAccountForProperty(String propertyId, Long amount) {
        log.info("Property별 임대 수익 가상계좌 발급 시작 - propertyId: {}, amount: {}", propertyId, amount);

        var property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new BusinessException(ErrorCode.PROPERTY_NOT_FOUND));

        propertyVirtualAccountRepository.findByPropertyId(propertyId)
                .ifPresent(existing -> {
                    log.warn("이미 발급된 가상계좌가 있습니다 - propertyId: {}, accountNumber: {}",
                            propertyId, existing.getVirtualAccountNumber());
                    throw new BusinessException(ErrorCode.VIRTUAL_ACCOUNT_ALREADY_EXISTS);
                });

        String orderId = generateRentalOrderId(propertyId);
        TossVirtualAccountRequest tossRequest = new TossVirtualAccountRequest(
                amount,
                orderId,
                property.getName() + " 임대 수익",
                PaymentConstants.DEFAULT_TENANT_NAME,
                PaymentConstants.RENTAL_VIRTUAL_ACCOUNT_VALID_HOURS,
                PaymentConstants.DEFAULT_VIRTUAL_ACCOUNT_BANK_CODE
        );

        TossVirtualAccountResponse tossResponse = tossPaymentsClient.issueVirtualAccount(tossRequest);

        PropertyVirtualAccount virtualAccount = PropertyVirtualAccount.builder()
                .propertyId(propertyId)
                .virtualAccountNumber(tossResponse.virtualAccount().accountNumber())
                .bankCode(tossResponse.virtualAccount().bankCode())
                .bankName(BankCode.getNameByCode(tossResponse.virtualAccount().bankCode()))
                .tossOrderId(orderId)
                .build();

        propertyVirtualAccountRepository.save(virtualAccount);

        log.info("가상계좌 발급 완료 - propertyId: {}, accountNumber: {}",
                propertyId, virtualAccount.getVirtualAccountNumber());

        return new PropertyVirtualAccountResponse(
                virtualAccount.getId(),
                virtualAccount.getPropertyId(),
                virtualAccount.getVirtualAccountNumber(),
                virtualAccount.getBankName(),
                virtualAccount.getCreatedAt()
        );
    }

    /**
     * 임대 수익 입금 완료 처리 (Webhook에서 호출)
     *
     * 2-Phase 처리:
     * Phase 1: DB에 RentalIncome PENDING 저장 (트랜잭션) — RentalIncomeTransactionService
     * Phase 2: 블록체인 호출 → 성공/실패 업데이트 (각각 별도 트랜잭션)
     *
     * 멱등성: paymentKey로 중복 체크하여 동일 webhook 재시도 시 안전하게 무시
     */
    public void completeRentalIncome(String accountNumberOrOrderId, String paymentKey, Long amount) {
        log.info("임대 수익 입금 완료 처리 시작 - accountNumberOrOrderId: {}, paymentKey: {}, amount: {}",
                accountNumberOrOrderId, paymentKey, amount);

        // 멱등성 체크: 동일 paymentKey로 이미 처리된 건이 있는지 확인
        Optional<RentalIncome> existing = rentalIncomeRepository.findByTossPaymentKey(paymentKey);
        if (existing.isPresent()) {
            RentalIncome existingIncome = existing.get();
            if (existingIncome.getStatus() == RentalIncomeStatus.DISTRIBUTED) {
                log.info("이미 분배 완료된 건입니다 - paymentKey: {}, id: {}", paymentKey, existingIncome.getId());
                return;
            }
            if (existingIncome.getStatus() == RentalIncomeStatus.PENDING) {
                log.info("현재 처리 중인 건입니다 - paymentKey: {}, id: {}", paymentKey, existingIncome.getId());
                return;
            }
            // FAILED인 경우 → 재시도 허용
            if (!existingIncome.isRetryable()) {
                log.warn("최대 재시도 횟수 초과 - paymentKey: {}, retryCount: {}",
                        paymentKey, existingIncome.getRetryCount());
                throw new BusinessException(ErrorCode.RENTAL_INCOME_DISTRIBUTION_FAILED);
            }
            log.info("FAILED 건 재시도 - paymentKey: {}, retryCount: {}", paymentKey, existingIncome.getRetryCount());
            retryBlockchainDistribution(existingIncome);
            return;
        }

        // Phase 1: DB에 RentalIncome 저장 (PENDING) — 별도 빈의 @Transactional
        RentalIncome rentalIncome = transactionService.saveRentalIncome(accountNumberOrOrderId, paymentKey, amount);

        // Phase 2: 블록체인 호출 (DB 트랜잭션 밖에서 실행)
        executeBlockchainDistribution(rentalIncome);
    }

    /**
     * Phase 2: 블록체인 배당 분배 실행 (트랜잭션 밖)
     */
    private void executeBlockchainDistribution(RentalIncome rentalIncome) {
        String propertyTokenAddress = rentalIncome.getPropertyId();
        log.info("블록체인 배당 분배 시작 - rentalIncomeId: {}, propertyId: {}", rentalIncome.getId(), propertyTokenAddress);

        Property property = propertyRepository.findById(propertyTokenAddress)
                .orElseThrow(() -> new BusinessException(ErrorCode.PROPERTY_NOT_FOUND));

        try {
            BigInteger snapshotId = blockchainWalletService.createSnapshot(propertyTokenAddress);
            log.info("Snapshot 생성 완료 - snapshotId: {}", snapshotId);

            BigInteger krwtAmount = rentalIncome.getKrwtAmountAsBigInteger();
            String txHash = blockchainWalletService.createDividend(
                    property.getDividendDistributorAddress(), snapshotId, krwtAmount);

            // 성공: DB 업데이트 — 별도 빈의 @Transactional
            transactionService.updateDistributionSuccess(rentalIncome.getId(), txHash);
            log.info("임대 수익 분배 완료 - rentalIncomeId: {}, txHash: {}, snapshotId: {}, krwtAmount: {}",
                    rentalIncome.getId(), txHash, snapshotId, krwtAmount);

        } catch (Exception e) {
            log.error("임대 수익 분배 실패 - rentalIncomeId: {}, propertyId: {}",
                    rentalIncome.getId(), propertyTokenAddress, e);
            transactionService.updateDistributionFailed(rentalIncome.getId());
            throw new BusinessException(ErrorCode.RENTAL_INCOME_DISTRIBUTION_FAILED);
        }
    }

    /**
     * FAILED 건 블록체인 재시도
     */
    private void retryBlockchainDistribution(RentalIncome rentalIncome) {
        transactionService.incrementRetryAndResetToPending(rentalIncome.getId());
        executeBlockchainDistribution(rentalIncome);
    }

    /* Property별 임대 수익 내역 조회 */
    @Transactional(readOnly = true)
    public List<RentalIncomeResponse> getRentalIncomesByProperty(String propertyId) {
        return rentalIncomeRepository.findByPropertyIdOrderByDepositDateDesc(propertyId).stream()
                .map(this::toResponse)
                .toList();
    }

    /* Property별 가상계좌 조회 */
    @Transactional(readOnly = true)
    public PropertyVirtualAccountResponse getVirtualAccountByProperty(String propertyId) {
        PropertyVirtualAccount virtualAccount = propertyVirtualAccountRepository.findByPropertyId(propertyId)
                .orElseThrow(() -> new BusinessException(ErrorCode.VIRTUAL_ACCOUNT_NOT_FOUND));

        return new PropertyVirtualAccountResponse(
                virtualAccount.getId(),
                virtualAccount.getPropertyId(),
                virtualAccount.getVirtualAccountNumber(),
                virtualAccount.getBankName(),
                virtualAccount.getCreatedAt()
        );
    }

    private RentalIncomeResponse toResponse(RentalIncome rentalIncome) {
        return new RentalIncomeResponse(
                rentalIncome.getId(),
                rentalIncome.getPropertyId(),
                rentalIncome.getAmount(),
                rentalIncome.getKrwtAmount(),
                rentalIncome.getTenantName(),
                rentalIncome.getStatus(),
                rentalIncome.getDistributionTxHash(),
                rentalIncome.getDepositDate(),
                rentalIncome.getDistributedAt()
        );
    }

    private String generateRentalOrderId(String propertyId) {
        return "RENTAL_" + propertyId + "_" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}
