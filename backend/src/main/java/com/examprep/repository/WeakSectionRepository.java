package com.examprep.repository;

import com.examprep.entity.WeakSection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface WeakSectionRepository extends JpaRepository<WeakSection, Long> {
    List<WeakSection> findByStudentIdOrderByUpdatedAtDesc(String studentId);
    List<WeakSection> findByStudentIdAndSectionName(String studentId, String sectionName);
    Optional<WeakSection> findByStudentIdAndSectionNameAndTopicName(String studentId, String sectionName, String topicName);
}
