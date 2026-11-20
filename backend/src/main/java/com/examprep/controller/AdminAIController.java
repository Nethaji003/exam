package com.examprep.controller;

import com.examprep.dto.AdminQuestionReviewRequest;
import com.examprep.entity.AIGeneratedQuestion;
import com.examprep.entity.PerformanceAnalysis;
import com.examprep.repository.AIQuestionRepository;
import com.examprep.repository.PerformanceAnalysisRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/admin/ai")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"}, allowCredentials = "true")
public class AdminAIController {

    private final AIQuestionRepository questionRepository;
    private final PerformanceAnalysisRepository analysisRepository;

    public AdminAIController(AIQuestionRepository questionRepository, PerformanceAnalysisRepository analysisRepository) {
        this.questionRepository = questionRepository;
        this.analysisRepository = analysisRepository;
    }

    /**
     * 1. View AI-generated questions with optional status filter
     */
    @GetMapping("/questions")
    public ResponseEntity<List<AIGeneratedQuestion>> getAIQuestions(@RequestParam(required = false) String status) {
        if (status != null && !status.isBlank()) {
            return ResponseEntity.ok(questionRepository.findByStatus(status.toUpperCase()));
        }
        return ResponseEntity.ok(questionRepository.findAll());
    }

    /**
     * 2. Approve AI-generated question
     */
    @PutMapping("/questions/{id}/approve")
    public ResponseEntity<AIGeneratedQuestion> approveQuestion(@PathVariable Long id, @RequestBody(required = false) AdminQuestionReviewRequest reviewReq) {
        return questionRepository.findById(id).map(q -> {
            q.setStatus("APPROVED");
            if (reviewReq != null && reviewReq.getReviewedBy() != null) {
                q.setReviewedBy(reviewReq.getReviewedBy());
            }
            return ResponseEntity.ok(questionRepository.save(q));
        }).orElse(ResponseEntity.notFound().build());
    }

    /**
     * 3. Reject AI-generated question
     */
    @PutMapping("/questions/{id}/reject")
    public ResponseEntity<AIGeneratedQuestion> rejectQuestion(@PathVariable Long id, @RequestBody(required = false) AdminQuestionReviewRequest reviewReq) {
        return questionRepository.findById(id).map(q -> {
            q.setStatus("REJECTED");
            if (reviewReq != null && reviewReq.getReviewedBy() != null) {
                q.setReviewedBy(reviewReq.getReviewedBy());
            }
            return ResponseEntity.ok(questionRepository.save(q));
        }).orElse(ResponseEntity.notFound().build());
    }

    /**
     * 4. Edit question text, options, answer key, and explanation
     */
    @PutMapping("/questions/{id}")
    public ResponseEntity<AIGeneratedQuestion> editQuestion(@PathVariable Long id, @RequestBody AIGeneratedQuestion updated) {
        return questionRepository.findById(id).map(q -> {
            if (updated.getQuestionText() != null) q.setQuestionText(updated.getQuestionText());
            if (updated.getCorrectAnswer() != null) q.setCorrectAnswer(updated.getCorrectAnswer());
            if (updated.getExplanation() != null) q.setExplanation(updated.getExplanation());
            if (updated.getOptionsJson() != null) q.setOptionsJson(updated.getOptionsJson());
            if (updated.getDifficultyLevel() != null) q.setDifficultyLevel(updated.getDifficultyLevel());
            if (updated.getShortcut() != null) q.setShortcut(updated.getShortcut());
            if (updated.getConcept() != null) q.setConcept(updated.getConcept());
            return ResponseEntity.ok(questionRepository.save(q));
        }).orElse(ResponseEntity.notFound().build());
    }

    /**
     * 5. View student performance reports
     */
    @GetMapping("/student-reports")
    public ResponseEntity<List<PerformanceAnalysis>> getStudentPerformanceReports() {
        return ResponseEntity.ok(analysisRepository.findAll());
    }
}

