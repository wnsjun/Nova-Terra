package org.landmark.domain.rental.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "RentalIncomes")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class RentalIncome {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "property_id", nullable = false)
    private String propertyId;

    @Column(name = "amount", nullable = false)
    private Long amount;  // 원화 입금 금액

    @Column(name = "krwt_amount", nullable = false)
    private Long krwtAmount;  // 전송할 KRWT 수량 (1:1 변환)

    @Column(name = "tenant_name")
    private String tenantName;  // 임대인 이름

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RentalIncomeStatus status;

    @Column(name = "distribution_tx_hash")
    private String distributionTxHash;  // 블록체인 트랜잭션 해시

    @Column(name = "toss_order_id")
    private String tossOrderId;

    @Column(name = "toss_payment_key", unique = true)
    private String tossPaymentKey;

    @Column(name = "retry_count", nullable = false)
    private int retryCount = 0;

    @CreationTimestamp
    @Column(name = "deposit_date", nullable = false, updatable = false)
    private LocalDateTime depositDate;

    @Column(name = "distributed_at")
    private LocalDateTime distributedAt;

    @Builder
    public RentalIncome(String propertyId, Long amount, String tenantName, String tossOrderId) {
        this.propertyId = propertyId;
        this.amount = amount;
        this.krwtAmount = amount;
        this.tenantName = tenantName;
        this.tossOrderId = tossOrderId;
        this.status = RentalIncomeStatus.PENDING;
    }

    /* 입금 완료 처리 */
    public void completeDeposit(String paymentKey) {
        this.tossPaymentKey = paymentKey;
    }

    /* KRWT 분배 완료 처리 */
    public void completeDistribution(String txHash) {
        this.status = RentalIncomeStatus.DISTRIBUTED;
        this.distributionTxHash = txHash;
        this.distributedAt = LocalDateTime.now();
    }

    /* 분배 실패 처리 */
    public void failDistribution() {
        this.status = RentalIncomeStatus.FAILED;
    }

    /* 재시도 횟수 증가 */
    public void incrementRetryCount() {
        this.retryCount++;
    }

    /* 재시도 가능 여부 (최대 3회) */
    public boolean isRetryable() {
        return this.retryCount < 3;
    }

    /* PENDING 상태로 재설정 (재시도 시) */
    public void resetToPending() {
        this.status = RentalIncomeStatus.PENDING;
    }

    /* 블록체인 전송을 위한 KRWT 수량 */
    public java.math.BigInteger getKrwtAmountAsBigInteger() {
        return java.math.BigInteger.valueOf(this.krwtAmount);
    }
}
