package org.landmark.domain.portfolio.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.landmark.domain.properties.domain.Property;
import org.landmark.domain.user.domain.User;

@Entity
@Table(name = "user_holdings",
       uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "property_id"}))
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class UserHolding {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "property_id", nullable = false)
    private Property property;

    @Column(name = "amount", nullable = false)
    private Long amount;  // 보유 토큰 수량 (사람 단위)

    @Column(name = "krwt_cost", nullable = false)
    private Long krwtCost;  // 누적 매수 비용 (KRWT, 사람 단위)

    @Column(name = "created_at", nullable = false, updatable = false)
    private Long createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = System.currentTimeMillis() / 1000L;
        if (this.krwtCost == null) {
            this.krwtCost = 0L;
        }
    }

    @Builder
    public UserHolding(User user, Property property, Long amount, Long krwtCost) {
        this.user = user;
        this.property = property;
        this.amount = amount;
        this.krwtCost = krwtCost == null ? 0L : krwtCost;
    }

    /* 추가 매수 시 누적 합산 */
    public void addPurchase(Long additionalAmount, Long additionalCost) {
        this.amount += additionalAmount;
        this.krwtCost += additionalCost;
    }
}
