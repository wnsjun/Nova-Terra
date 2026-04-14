package org.landmark.domain.reconciliation.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.landmark.global.blockchain.service.BlockchainWalletService;
import org.landmark.domain.portfolio.repository.UserHoldingRepository;
import org.landmark.domain.properties.domain.Property;
import org.landmark.domain.properties.domain.PropertyStatus;
import org.landmark.domain.properties.repository.PropertyRepository;
import org.landmark.domain.reconciliation.domain.ReconciliationType;
import org.landmark.domain.rental.domain.RentalIncome;
import org.landmark.domain.rental.domain.RentalIncomeStatus;
import org.landmark.domain.rental.repository.RentalIncomeRepository;
import org.landmark.global.scheduler.runlog.SchedulerRunLogger;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.web3j.protocol.core.methods.response.TransactionReceipt;

import java.math.BigInteger;
import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReconciliationService {

    private final PropertyRepository propertyRepository;
    private final UserHoldingRepository userHoldingRepository;
    private final RentalIncomeRepository rentalIncomeRepository;
    private final BlockchainWalletService blockchainWalletService;
    private final ReconciliationTransactionService transactionService;
    private final SchedulerRunLogger runLogger;

    /**
     * 온·오프체인 보유량 대사 (매일 새벽 2시)
     *
     * DB의 UserHolding 합계와 블록체인의 totalSupply를 비교하여
     * 불일치 시 ReconciliationLog에 기록
     */
    @Scheduled(cron = "0 0 2 * * *")
    public void reconcileHoldings() {
        runLogger.run("ReconcileHoldings", this::doReconcileHoldings);
    }

    private SchedulerRunLogger.Result doReconcileHoldings() {
        log.info("===== 온·오프체인 보유량 대사 시작 =====");

        List<Property> activeProperties = propertyRepository.findByStatus(PropertyStatus.ACTIVE);
        int mismatchCount = 0;

        for (Property property : activeProperties) {
            try {
                Long dbTotal = userHoldingRepository.sumAmountByPropertyId(property.getId());
                BigInteger onChainTotal = blockchainWalletService.getTotalSupply(property.getId());

                if (!BigInteger.valueOf(dbTotal).equals(onChainTotal)) {
                    mismatchCount++;
                    log.error("잔액 불일치 감지 - propertyId: {}, DB합계: {}, 온체인totalSupply: {}",
                            property.getId(), dbTotal, onChainTotal);

                    transactionService.saveReconciliationLog(
                            ReconciliationType.HOLDING_MISMATCH,
                            property.getId(),
                            dbTotal,
                            onChainTotal,
                            null
                    );
                } else {
                    log.debug("대사 일치 - propertyId: {}, amount: {}", property.getId(), dbTotal);
                }
            } catch (Exception e) {
                log.error("대사 중 오류 발생 - propertyId: {}", property.getId(), e);
            }
        }

        log.info("===== 온·오프체인 보유량 대사 완료 - 검사: {}건, 불일치: {}건 =====",
                activeProperties.size(), mismatchCount);
        return new SchedulerRunLogger.Result(activeProperties.size(), mismatchCount);
    }

    /**
     * 배당 분배 TX 검증 (매일 새벽 2시 30분)
     *
     * DISTRIBUTED 상태의 RentalIncome 중 최근 24시간 내 처리된 건의
     * 블록체인 TX 상태를 확인하여 실제 실패한 건을 감지
     */
    @Scheduled(cron = "0 30 2 * * *")
    public void verifyDistributionTransactions() {
        runLogger.run("VerifyDistributionTransactions", this::doVerifyDistributionTransactions);
    }

    private SchedulerRunLogger.Result doVerifyDistributionTransactions() {
        log.info("===== 배당 TX 검증 시작 =====");

        List<RentalIncome> recentDistributed = rentalIncomeRepository
                .findByStatusAndDistributedAtAfter(RentalIncomeStatus.DISTRIBUTED, LocalDateTime.now().minusDays(1));

        int failCount = 0;

        for (RentalIncome income : recentDistributed) {
            try {
                TransactionReceipt receipt = blockchainWalletService
                        .getTransactionReceipt(income.getDistributionTxHash());

                if (!"0x1".equals(receipt.getStatus())) {
                    failCount++;
                    log.error("TX 실패 감지 - rentalIncomeId: {}, txHash: {}, status: {}",
                            income.getId(), income.getDistributionTxHash(), receipt.getStatus());

                    transactionService.markDistributionAsFailed(income.getId());

                    transactionService.saveReconciliationLog(
                            ReconciliationType.DISTRIBUTION_TX_FAILED,
                            income.getPropertyId(),
                            income.getAmount(),
                            BigInteger.ZERO,
                            income.getDistributionTxHash()
                    );
                }
            } catch (Exception e) {
                log.error("TX 검증 중 오류 - rentalIncomeId: {}, txHash: {}",
                        income.getId(), income.getDistributionTxHash(), e);
            }
        }

        log.info("===== 배당 TX 검증 완료 - 검사: {}건, 실패: {}건 =====",
                recentDistributed.size(), failCount);
        return new SchedulerRunLogger.Result(recentDistributed.size(), failCount);
    }

    /**
     * FAILED 배당 자동 재시도 (5분마다)
     *
     * 2-Phase: DB 상태 변경(트랜잭션) → 블록체인 호출(트랜잭션 밖) → 결과 반영(트랜잭션)
     */
    @Scheduled(fixedDelay = 300000)
    public void retryFailedDistributions() {
        runLogger.run("RetryFailedDistributions", this::doRetryFailedDistributions);
    }

    private SchedulerRunLogger.Result doRetryFailedDistributions() {
        List<RentalIncome> failedIncomes = rentalIncomeRepository.findByStatus(RentalIncomeStatus.FAILED);

        if (failedIncomes.isEmpty()) return new SchedulerRunLogger.Result(0, 0);

        log.info("FAILED 배당 재시도 시작 - 대상: {}건", failedIncomes.size());

        int processed = 0;
        int failed = 0;
        for (RentalIncome income : failedIncomes) {
            if (!income.isRetryable()) {
                log.warn("최대 재시도 횟수 초과 - rentalIncomeId: {}, retryCount: {}",
                        income.getId(), income.getRetryCount());
                continue;
            }

            try {
                log.info("배당 재시도 - rentalIncomeId: {}, retryCount: {}",
                        income.getId(), income.getRetryCount());

                // Phase 1: DB 상태 변경 (트랜잭션)
                transactionService.prepareRetry(income);

                // Phase 2: 블록체인 호출 (트랜잭션 밖)
                String propertyTokenAddress = income.getPropertyId();
                BigInteger snapshotId = blockchainWalletService.createSnapshot(propertyTokenAddress);
                BigInteger krwtAmount = income.getKrwtAmountAsBigInteger();
                String txHash = blockchainWalletService.createDividend(snapshotId, krwtAmount);

                // Phase 3: 성공 반영 (트랜잭션)
                transactionService.completeRetry(income, txHash);
                log.info("배당 재시도 성공 - rentalIncomeId: {}, txHash: {}", income.getId(), txHash);
                processed++;

            } catch (Exception e) {
                log.error("배당 재시도 실패 - rentalIncomeId: {}", income.getId(), e);
                transactionService.failRetry(income);
                failed++;
            }
        }
        return new SchedulerRunLogger.Result(processed, failed);
    }
}
