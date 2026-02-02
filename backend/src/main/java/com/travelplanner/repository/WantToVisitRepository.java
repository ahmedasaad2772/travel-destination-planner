package com.travelplanner.repository;

import com.travelplanner.model.WantToVisit;
import com.travelplanner.model.WantToVisitId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WantToVisitRepository extends JpaRepository<WantToVisit, WantToVisitId> {

    Page<WantToVisit> findByIdUserId(Long userId, Pageable pageable);

    boolean existsById(WantToVisitId id);

    void deleteById(WantToVisitId id);
}
