package com.examprep.repository;

import com.examprep.entity.AITutorSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AITutorSessionRepository extends JpaRepository<AITutorSession, Long> {
    List<AITutorSession> findByStudentIdOrderByCreatedAtDesc(String studentId);
    List<AITutorSession> findByStudentIdAndSectionNameAndTopicName(String studentId, String sectionName, String topicName);
}
