package com.examprep.repository;

import com.examprep.entity.AITestAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AITestAttemptRepository extends JpaRepository<AITestAttempt, Long> {
    List<AITestAttempt> findByStudentIdOrderByCreatedAtDesc(String studentId);
    List<AITestAttempt> findByStudentIdAndSectionName(String studentId, String sectionName);
}
