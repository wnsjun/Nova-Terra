package org.landmark.domain.properties.repository;

import org.landmark.domain.properties.domain.Property;
import org.landmark.domain.properties.domain.PropertyStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PropertyRepository extends JpaRepository<Property, String> {
    List<Property> findByStatus(PropertyStatus status);

    List<Property> findByStatusIn(List<PropertyStatus> statuses);

    Optional<Property> findByDaoTokenAddress(String daoTokenAddress);

    @Query("SELECT p FROM Property p WHERE LOWER(p.id) = LOWER(:id)")
    Optional<Property> findByIdIgnoreCase(@Param("id") String id);

    @Query("SELECT p FROM Property p WHERE LOWER(p.daoContractAddress) = LOWER(:address)")
    Optional<Property> findByDaoContractAddressIgnoreCase(@Param("address") String address);
}
