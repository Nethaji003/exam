package com.examprep.repository;

import com.examprep.entity.AIGeneratedQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AIQuestionRepository extends JpaRepository<AIGeneratedQuestion, Long> {
    List<AIGeneratedQuestion> findByStudentId(String studentId);
    List<AIGeneratedQuestion> findByStatus(String status);
    List<AIGeneratedQuestion> findByStudentIdAndSectionName(String studentId, String sectionName);
}
