package org.landmark.domain.payment.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.landmark.domain.payment.domain.UserPayment;
import org.landmark.domain.payment.domain.UserPaymentStatus;
import org.landmark.domain.payment.dto.ChargeRequest;
import org.landmark.domain.payment.dto.ChargeResponse;
import org.landmark.domain.payment.repository.UserPaymentRepository;
import org.landmark.domain.user.domain.User;
import org.landmark.domain.user.repository.UserRepository;
import org.landmark.global.blockchain.config.BlockchainConfig;
import org.landmark.global.blockchain.outbox.service.BlockchainOutboxService;
import org.landmark.global.constants.PaymentConstants;
import org.landmark.global.exception.BusinessException;
import org.landmark.global.exception.ErrorCode;
import org.landmark.global.toss.client.TossPaymentsClient;
import org.landmark.global.toss.dto.TossVirtualAccountRequest;
import org.landmark.global.toss.dto.TossVirtualAccountResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserPaymentService {

    private static final String AGGREGATE_TYPE = "USER_PAYMENT";

    private final UserPaymentRepository paymentRepository;
    private final UserRepository userRepository;
    private final TossPaymentsClient tossPaymentsClient;
    private final BlockchainOutboxService outboxService;
    private final BlockchainConfig blockchainConfig;

    /** 사용자 충전 요청 — 가상계좌 발급 후 PENDING 상태로 저장 */
    @Transactional
    public ChargeResponse charge(String userId, ChargeRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        if (user.getWalletAddress() == null || user.getWalletAddress().isBlank()) {
            throw new BusinessException(ErrorCode.WALLET_NOT_LINKED);
        }

        String orderId = generateOrderId(userId);
        TossVirtualAccountRequest tossRequest = new TossVirtualAccountRequest(
                request.amount(),
                orderId,
                "KRWT 충전 " + request.amount() + "원",
                user.getName(),
                PaymentConstants.RENTAL_VIRTUAL_ACCOUNT_VALID_HOURS,
                PaymentConstants.DEFAULT_VIRTUAL_ACCOUNT_BANK_CODE
        );
        TossVirtualAccountResponse tossResponse = tossPaymentsClient.issueVirtualAccount(tossRequest);

        UserPayment payment = UserPayment.builder()
                .userId(userId)
                .walletAddress(user.getWalletAddress())
                .amount(request.amount())
                .tossOrderId(orderId)
                .build();
        paymentRepository.save(payment);

        log.info("충전 요청 생성 - userId: {}, orderId: {}, amount: {}", userId, orderId, request.amount());

        return new ChargeResponse(
                payment.getId(),
                orderId,
                request.amount(),
                tossResponse.virtualAccount().bankCode(),
                tossResponse.virtualAccount().accountNumber(),
                tossResponse.virtualAccount().dueDate()
        );
    }

    /**
     * 토스 DEPOSIT_CALLBACK 웹훅 처리 — 입금 완료 시 outbox에 KRWT_MINT 등록.
     * paymentKey 멱등성 보장.
     */
    @Transactional
    public void completeCharge(String orderId, String paymentKey, Long amount) {
        Optional<UserPayment> byKey = paymentRepository.findByTossPaymentKey(paymentKey);
        if (byKey.isPresent() && byKey.get().getStatus() == UserPaymentStatus.DONE) {
            log.info("이미 처리된 충전 — 스킵 (paymentKey: {})", paymentKey);
            return;
        }

        UserPayment payment = paymentRepository.findByTossOrderId(orderId)
                .orElseThrow(() -> new BusinessException(ErrorCode.PAYMENT_NOT_FOUND));

        if (payment.getStatus() == UserPaymentStatus.DONE) {
            log.info("이미 완료된 충전 — 스킵 (orderId: {})", orderId);
            return;
        }
        if (!payment.getAmount().equals(amount)) {
            log.error("결제 금액 불일치 - orderId: {}, expected: {}, actual: {}",
                    orderId, payment.getAmount(), amount);
            throw new BusinessException(ErrorCode.INVALID_INPUT_VALUE);
        }

        payment.markDone(paymentKey);
        outboxService.enqueueKrwtMint(
                AGGREGATE_TYPE,
                payment.getId(),
                blockchainConfig.getKrwtTokenAddress(),
                payment.getWalletAddress(),
                String.valueOf(payment.getAmount())
        );
        log.info("충전 완료 — outbox 등록 - paymentId: {}, orderId: {}", payment.getId(), orderId);
    }

    private String generateOrderId(String userId) {
        return "CHARGE_" + userId.substring(0, 8) + "_"
                + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}
