package com.travelplanner.repository;

import com.travelplanner.model.Destination;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface DestinationRepository extends JpaRepository<Destination, Long> {

    Page<Destination> findByApprovedTrue(Pageable pageable);

    @Query("SELECT d FROM Destination d WHERE d.approved = true AND " +
            "(LOWER(d.countryName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(d.capital) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(d.region) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<Destination> searchApprovedDestinations(@Param("query") String query, Pageable pageable);

    boolean existsByCountryNameIgnoreCase(String countryName);
}
