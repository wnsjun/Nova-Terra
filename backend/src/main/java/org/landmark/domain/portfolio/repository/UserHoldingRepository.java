package org.landmark.domain.portfolio.repository;

import org.landmark.domain.portfolio.domain.UserHolding;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserHoldingRepository extends JpaRepository<UserHolding, Long> {

    /* 사용자의 모든 보유 자산 조회 (Property 정보 함께 fetch) */
    @EntityGraph(attributePaths = {"property"})
    List<UserHolding> findAllByUserIdOrderByCreatedAtDesc(String userId);

    /* 사용자가 특정 부동산을 보유하고 있는지 확인 */
    boolean existsByUserIdAndPropertyId(String userId, String propertyId);

    /* upsert 시 기존 row 조회 */
    Optional<UserHolding> findByUserIdAndPropertyId(String userId, String propertyId);

    /* Property별 전체 보유 토큰 합산 (대사용) */
    @Query("SELECT COALESCE(SUM(h.amount), 0) FROM UserHolding h WHERE h.property.id = :propertyId")
    Long sumAmountByPropertyId(@Param("propertyId") String propertyId);

    /* 특정 Property의 보유자 목록 조회 (대사용) */
    List<UserHolding> findByPropertyId(String propertyId);
}
