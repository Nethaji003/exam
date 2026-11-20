package com.examprep.repository;

import com.examprep.entity.QuestionPaper;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface QuestionPaperRepository extends JpaRepository<QuestionPaper, String> {
    List<QuestionPaper> findByExamGroup(String examGroup);
    List<QuestionPaper> findByExamGroupAndExamYear(String examGroup, Integer examYear);
    List<QuestionPaper> findByExamGroupAndLanguage(String examGroup, String language);
}

