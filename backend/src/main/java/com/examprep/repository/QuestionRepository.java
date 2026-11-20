package com.examprep.repository;

import com.examprep.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, String> {

    List<Question> findByExamGroup(String examGroup);

    List<Question> findByPdfId(String pdfId);

    List<Question> findByExamGroupAndSubject(String examGroup, String subject);

    List<Question> findByExamGroupAndSubjectAndTopic(String examGroup, String subject, String topic);

    List<Question> findByVerificationStatus(String verificationStatus);

    List<Question> findByExamGroupAndVerificationStatus(String examGroup, String verificationStatus);

    List<Question> findByQuestionSource(String questionSource);

    @Query("SELECT q FROM Question q WHERE " +
           "(:examGroup IS NULL OR LOWER(q.examGroup) = LOWER(:examGroup)) AND " +
           "(:subject IS NULL OR LOWER(q.subject) = LOWER(:subject)) AND " +
           "(:topic IS NULL OR LOWER(q.topic) = LOWER(:topic)) AND " +
           "(:source IS NULL OR LOWER(q.questionSource) = LOWER(:source)) AND " +
           "(:status IS NULL OR LOWER(q.verificationStatus) = LOWER(:status))")
    List<Question> findFiltered(
            @Param("examGroup") String examGroup,
            @Param("subject") String subject,
            @Param("topic") String topic,
            @Param("source") String source,
            @Param("status") String status
    );
}

