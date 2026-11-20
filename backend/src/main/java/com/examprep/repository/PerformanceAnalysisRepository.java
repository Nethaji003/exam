package com.examprep.repository;

import com.examprep.entity.PerformanceAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PerformanceAnalysisRepository extends JpaRepository<PerformanceAnalysis, Long> {
    List<PerformanceAnalysis> findByStudentIdOrderByCreatedAtDesc(String studentId);
    List<PerformanceAnalysis> findByStudentId(String studentId);
}
