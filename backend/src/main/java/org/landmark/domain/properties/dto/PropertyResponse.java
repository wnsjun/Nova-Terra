package org.landmark.domain.properties.dto;

import org.landmark.domain.properties.domain.BuildingType;
import org.landmark.domain.properties.domain.Property;
import org.landmark.domain.properties.domain.PropertyStatus;

import java.math.BigDecimal;

public record PropertyResponse(
        String id,
        String daoContractAddress,
        String name,
        String description,
        String address,
        String coverImageUrl,
        BuildingType buildingType,
        BigDecimal exclusiveAreaSqm,
        Integer totalFloors,
        String floor,
        Long useApprovalDate,
        Integer parkingSpaces,
        String direction,
        Integer roomCount,
        Integer bathroomCount,
        Long managementFee,
        BigDecimal occupancyRate,
        String majorTenants,
        Long totalMonthlyRent,
        BigDecimal totalValuation,
        Long totalTokens,
        BigDecimal pricePerToken,
        BigDecimal expenseRate,
        BigDecimal feeRate,
        BigDecimal latitude,
        BigDecimal longitude,
        PropertyStatus status
) {
    public static PropertyResponse from(Property property) {
        return new PropertyResponse(
                property.getId(),
                property.getDaoContractAddress(),
                property.getName(),
                property.getDescription(),
                property.getAddress(),
                property.getCoverImageUrl(),
                property.getBuildingType(),
                property.getExclusiveAreaSqm(),
                property.getTotalFloors(),
                property.getFloor(),
                property.getUseApprovalDate(),
                property.getParkingSpaces(),
                property.getDirection(),
                property.getRoomCount(),
                property.getBathroomCount(),
                property.getManagementFee(),
                property.getOccupancyRate(),
                property.getMajorTenants(),
                property.getTotalMonthlyRent(),
                property.getTotalValuation(),
                property.getTotalTokens(),
                property.getPricePerToken(),
                property.getExpenseRate(),
                property.getFeeRate(),
                property.getLatitude(),
                property.getLongitude(),
                property.getStatus()
        );
    }
}
