package org.landmark.domain.rental.repository;

import org.landmark.domain.rental.domain.RentalIncome;
import org.landmark.domain.rental.domain.RentalIncomeStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface RentalIncomeRepository extends JpaRepository<RentalIncome, String> {
    Optional<RentalIncome> findByTossOrderId(String tossOrderId);
    Optional<RentalIncome> findByTossPaymentKey(String tossPaymentKey);
    List<RentalIncome> findByPropertyIdOrderByDepositDateDesc(String propertyId);
    List<RentalIncome> findByPropertyIdAndStatusOrderByDepositDateDesc(String propertyId, RentalIncomeStatus status);
    List<RentalIncome> findByStatus(RentalIncomeStatus status);

    @Query("SELECT r FROM RentalIncome r WHERE r.status = :status AND r.distributedAt >= :after")
    List<RentalIncome> findByStatusAndDistributedAtAfter(
            @Param("status") RentalIncomeStatus status,
            @Param("after") LocalDateTime after);
}
