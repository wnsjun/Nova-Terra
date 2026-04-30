package org.landmark.global.blockchain.outbox.worker;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.landmark.global.blockchain.outbox.domain.BlockchainOutbox;
import org.landmark.global.blockchain.outbox.domain.OutboxTxType;
import org.landmark.global.blockchain.outbox.service.OutboxTransactionService;
import org.landmark.global.blockchain.service.BlockchainWalletService;
import org.landmark.global.blockchain.service.NonceManager;
import org.landmark.global.scheduler.runlog.SchedulerRunLogger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.math.BigInteger;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class OutboxWorker {

    public static final String JOB_NAME = "BlockchainOutboxWorker";

    private final OutboxTransactionService outboxTxService;
    private final BlockchainWalletService blockchainWalletService;
    private final NonceManager nonceManager;
    private final SchedulerRunLogger runLogger;

    @Value("${blockchain.outbox.batch-size:10}")
    private int batchSize;

    @Value("${blockchain.outbox.max-retry:5}")
    private int maxRetry;

    /**
     * 단일 스레드 순차 실행 보장을 위해 fixedDelay 사용.
     * @Scheduled 기본 TaskScheduler는 단일 스레드이므로 nonce 직렬화가 보장된다.
     */
    @Scheduled(fixedDelayString = "${blockchain.outbox.polling-interval-ms:2000}")
    public void process() {
        List<BlockchainOutbox> batch;
        try {
            batch = outboxTxService.lockReadyBatch(batchSize);
        } catch (Exception e) {
            log.error("Outbox batch 조회 실패", e);
            return;
        }
        if (batch.isEmpty()) return;

        runLogger.run(JOB_NAME, () -> {
            int processed = 0;
            int failed = 0;
            for (BlockchainOutbox outbox : batch) {
                try {
                    dispatch(outbox);
                    processed++;
                } catch (Exception e) {
                    log.error("Outbox 처리 실패 - id: {}", outbox.getId(), e);
                    outboxTxService.markFailed(outbox.getId(), e.getMessage(), maxRetry);
                    failed++;
                }
            }
            return new SchedulerRunLogger.Result(processed, failed);
        });
    }

    private void dispatch(BlockchainOutbox outbox) {
        long nonce = nonceManager.nextNonce();
        try {
            String txHash = switch (outbox.getTxType()) {
                case KRWT_MINT -> blockchainWalletService.mintKrwt(
                        outbox.getToAddress(),
                        toWei(outbox.getAmount()),
                        nonce
                );
                case KRWT_TRANSFER, SNAPSHOT, CREATE_DIVIDEND ->
                        throw new UnsupportedOperationException(
                                "아웃박스 타입 미구현: " + outbox.getTxType());
            };
            outboxTxService.markSubmitted(outbox.getId(), nonce, txHash);
        } catch (Exception e) {
            nonceManager.rollback(nonce);
            throw e;
        }
    }

    /* outbox.amount(사람 단위, 예: "2000000")를 KRWT 18 decimals 적용한 wei 단위로 변환. */
    private static BigInteger toWei(String humanAmount) {
        return new BigInteger(humanAmount).multiply(BigInteger.TEN.pow(18));
    }
}
