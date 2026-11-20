package com.examprep.controller;

import com.examprep.entity.Question;
import com.examprep.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/questions")
@CrossOrigin(origins = "*")
public class QuestionController {

    @Autowired
    private QuestionRepository questionRepository;

    // -------------------------------------------------------
    // GET /api/questions — list questions with optional filters
    // -------------------------------------------------------
    @GetMapping
    public ResponseEntity<List<Question>> getQuestions(
            @RequestParam(required = false) String examGroup,
            @RequestParam(required = false) String subject,
            @RequestParam(required = false) String topic,
            @RequestParam(required = false) String source,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Integer count) {

        List<Question> questions = questionRepository.findFiltered(examGroup, subject, topic, source, status);

        // Enforce exact count if requested
        if (count != null && count > 0 && questions.size() > count) {
            questions = questions.subList(0, count);
        }
        return ResponseEntity.ok(questions);
    }

    // -------------------------------------------------------
    // GET /api/questions/{id}
    // -------------------------------------------------------
    @GetMapping("/{id}")
    public ResponseEntity<Question> getQuestionById(@PathVariable String id) {
        return questionRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // -------------------------------------------------------
    // POST /api/questions — save a new question
    // -------------------------------------------------------
    @PostMapping
    public ResponseEntity<Question> saveQuestion(@RequestBody Question question) {
        if (question.getId() == null || question.getId().isEmpty()) {
            question.setId("q-" + UUID.randomUUID().toString().substring(0, 8));
        }
        if (question.getCreatedAt() == null) {
            question.setCreatedAt(LocalDateTime.now());
        }
        // Safety: never auto-mark unverified OCR answers as correct
        if (question.getVerificationStatus() == null) {
            question.setVerificationStatus("PENDING_VERIFICATION");
        }
        Question saved = questionRepository.save(question);
        return ResponseEntity.ok(saved);
    }

    // -------------------------------------------------------
    // PUT /api/questions/{id} — update a question
    // -------------------------------------------------------
    @PutMapping("/{id}")
    public ResponseEntity<Question> updateQuestion(
            @PathVariable String id,
            @RequestBody Question updated) {

        return questionRepository.findById(id).map(existing -> {
            if (updated.getQuestionText() != null) existing.setQuestionText(updated.getQuestionText());
            if (updated.getQuestionTextTa() != null) existing.setQuestionTextTa(updated.getQuestionTextTa());
            if (updated.getOptionA() != null) existing.setOptionA(updated.getOptionA());
            if (updated.getOptionB() != null) existing.setOptionB(updated.getOptionB());
            if (updated.getOptionC() != null) existing.setOptionC(updated.getOptionC());
            if (updated.getOptionD() != null) existing.setOptionD(updated.getOptionD());
            if (updated.getCorrectAnswer() != null) existing.setCorrectAnswer(updated.getCorrectAnswer());
            if (updated.getExplanation() != null) existing.setExplanation(updated.getExplanation());
            if (updated.getExplanationTa() != null) existing.setExplanationTa(updated.getExplanationTa());
            if (updated.getSubject() != null) existing.setSubject(updated.getSubject());
            if (updated.getTopic() != null) existing.setTopic(updated.getTopic());
            if (updated.getVerificationStatus() != null) existing.setVerificationStatus(updated.getVerificationStatus());
            return ResponseEntity.ok(questionRepository.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    // -------------------------------------------------------
    // DELETE /api/questions/{id}
    // -------------------------------------------------------
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteQuestion(@PathVariable String id) {
        if (questionRepository.existsById(id)) {
            questionRepository.deleteById(id);
            Map<String, Object> resp = new HashMap<>();
            resp.put("success", true);
            resp.put("deletedId", id);
            return ResponseEntity.ok(resp);
        }
        return ResponseEntity.notFound().build();
    }

    // -------------------------------------------------------
    // POST /api/questions/bulk — save multiple questions at once
    // -------------------------------------------------------
    @PostMapping("/bulk")
    public ResponseEntity<Map<String, Object>> saveQuestionsBulk(@RequestBody List<Question> questions) {
        int savedCount = 0;
        List<String> errors = new ArrayList<>();
        for (Question q : questions) {
            try {
                if (q.getId() == null || q.getId().isEmpty()) {
                    q.setId("q-" + UUID.randomUUID().toString().substring(0, 8));
                }
                if (q.getCreatedAt() == null) {
                    q.setCreatedAt(LocalDateTime.now());
                }
                if (q.getVerificationStatus() == null) {
                    q.setVerificationStatus("PENDING_VERIFICATION");
                }
                questionRepository.save(q);
                savedCount++;
            } catch (Exception e) {
                errors.add("Failed to save question " + q.getId() + ": " + e.getMessage());
            }
        }
        Map<String, Object> resp = new HashMap<>();
        resp.put("saved", savedCount);
        resp.put("total", questions.size());
        resp.put("errors", errors);
        return ResponseEntity.ok(resp);
    }
}

