package com.hackathon.carbon.repository;

import com.hackathon.carbon.entity.CarbonHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CarbonHistoryRepository extends JpaRepository<CarbonHistory, Long> {
    List<CarbonHistory> findBySiteIdOrderByCalculatedAtDesc(Long siteId);
}
