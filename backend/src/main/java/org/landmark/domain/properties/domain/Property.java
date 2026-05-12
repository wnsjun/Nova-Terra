package org.landmark.domain.properties.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "Properties")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Property {
    @Id
    @Column(name = "sto_token_address", length = 42) // STO 토큰 주소를 PK로 사용
    private String id;

    @Column(name = "dao_token_address", length = 42, unique = true) //의결권(DAO) 토큰 주소
    private String daoTokenAddress;

    @Column(name = "dao_contract_address", length = 42, unique = true)  // 의사결정 DAO 컨트랙트 주소
    private String daoContractAddress;

    @Column(name = "dividend_distributor_address", length = 42, unique = true) // 배당 분배 컨트랙트 주소
    private String dividendDistributorAddress;

    @Column(name = "max_balance_module_address", length = 42, unique = true) // 최대 보유량 제한 모듈 주소
    private String maxBalanceModuleAddress;

    @Column(nullable = false)
    private String name;

    @Lob
    private String description;

    @Column
    private String address;

    @Column(name = "cover_image_url")
    private String coverImageUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "building_type")
    private BuildingType buildingType;

    @Column(name = "exclusive_area_sqm")
    private BigDecimal exclusiveAreaSqm;

    @Column(name = "total_floors")
    private Integer totalFloors;

    @Column
    private String floor;

    @Column(name = "use_approval_date")
    private Long useApprovalDate; // Unix time (Long)

    @Column(name = "parking_spaces")
    private Integer parkingSpaces;

    @Column
    private String direction;

    @Column(name = "room_count")
    private Integer roomCount;

    @Column(name = "bathroom_count")
    private Integer bathroomCount;

    @Column(name = "management_fee")
    private Long managementFee;

    @Column(name = "occupancy_rate")
    private BigDecimal occupancyRate;

    @Lob
    @Column(name = "major_tenants")
    private String majorTenants;

    @Column(name = "total_monthly_rent")
    private Long totalMonthlyRent; // 월 총 임대료

    @Column(name = "total_valuation", nullable = false)
    private BigDecimal totalValuation; // 부동산 총 가치 평가액

    @Column(name = "total_tokens", nullable = false)
    private Long totalTokens; // 발행된 총 토큰 수량

    @Column(name = "price_per_token", nullable = false)
    private BigDecimal pricePerToken; // STO 토큰 1개당 가격 (KRWT)

    @Column(name = "expense_rate")
    private BigDecimal expenseRate; // 운영 비용 비율

    @Column(name = "fee_rate")
    private BigDecimal feeRate; // 플랫폼 수수료 비율

    @Column(precision = 10, scale = 7)
    private BigDecimal latitude;

    @Column(precision = 10, scale = 7)
    private BigDecimal longitude;

    @Column(name = "mint_tx_hash", length = 66)
    private String mintTxHash;  // 토큰 발행 트랜잭션 해시 (블록체인 민팅 후 저장)

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PropertyStatus status; // 부동산 상품의 현재 상태

    @Builder
    public Property(String stoTokenAddress, String daoTokenAddress, String daoContractAddress,
                    String dividendDistributorAddress, String maxBalanceModuleAddress,
                    String name, String description, String address, String coverImageUrl,
                    BuildingType buildingType, BigDecimal exclusiveAreaSqm, Integer totalFloors,
                    String floor, Long useApprovalDate, Integer parkingSpaces,
                    String direction, Integer roomCount, Integer bathroomCount,
                    Long managementFee, BigDecimal occupancyRate, String majorTenants,
                    Long totalMonthlyRent, BigDecimal totalValuation, Long totalTokens,
                    BigDecimal pricePerToken, BigDecimal expenseRate, BigDecimal feeRate,
                    BigDecimal latitude, BigDecimal longitude) {

        // 필수 값
        this.id = stoTokenAddress;
        this.daoTokenAddress = daoTokenAddress;
        this.daoContractAddress = daoContractAddress;
        this.dividendDistributorAddress = dividendDistributorAddress;
        this.maxBalanceModuleAddress = maxBalanceModuleAddress;
        this.name = name;
        this.totalValuation = totalValuation;
        this.totalTokens = totalTokens;
        this.pricePerToken = pricePerToken;
        this.description = description;
        this.address = address;
        this.coverImageUrl = coverImageUrl;
        this.buildingType = buildingType;
        this.exclusiveAreaSqm = exclusiveAreaSqm;
        this.totalFloors = totalFloors;
        this.floor = floor;
        this.useApprovalDate = useApprovalDate;
        this.parkingSpaces = parkingSpaces;
        this.direction = direction;
        this.roomCount = roomCount;
        this.bathroomCount = bathroomCount;
        this.managementFee = managementFee;
        this.occupancyRate = occupancyRate;
        this.majorTenants = majorTenants;
        this.totalMonthlyRent = totalMonthlyRent;
        this.expenseRate = expenseRate;
        this.feeRate = feeRate;
        this.latitude = latitude;
        this.longitude = longitude;

        // 초기 상태값 설정
        this.status = PropertyStatus.FUNDING; // 관리자가 등록 시 '청약 중' 상태로 시작
    }

    /* 상품 상태 '비활성'으로 변경. */
    public void deactivate() {
        this.status = PropertyStatus.INACTIVE;
    }

    /* 청약 완료되면 상품 상태 '운영 중'으로 변경. */
    public void activate() {
        if (this.status == PropertyStatus.FUNDING) {
            this.status = PropertyStatus.ACTIVE;
        }
    }

    /* 토큰 발행 완료 후 트랜잭션 해시 저장 */
    public void updateMintTxHash(String txHash) {
        this.mintTxHash = txHash;
    }

    /* 가치 평가 및 토큰 수량 업데이트 */
    public void updateValuationAndTokens(BigDecimal valuationPrice, Long totalSupply) {
        this.totalValuation = valuationPrice;
        this.totalTokens = totalSupply;
    }

    /* 사용자 보유량 변동 시 총 보유 토큰 수 업데이트 */
    public void updateTotalTokens(Long total) {
        this.totalTokens = total;
    }
}
