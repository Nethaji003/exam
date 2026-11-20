package com.examprep.controller;

import com.examprep.entity.Question;
import com.examprep.entity.QuestionPaper;
import com.examprep.repository.QuestionPaperRepository;
import com.examprep.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/papers")
@CrossOrigin(origins = "*")
public class QuestionPaperController {

    @Autowired
    private QuestionPaperRepository paperRepository;

    @Autowired
    private QuestionRepository questionRepository;

    // -------------------------------------------------------
    // GET /api/papers  — list all papers, optional filters
    // -------------------------------------------------------
    @GetMapping
    public ResponseEntity<List<QuestionPaper>> getPapers(
            @RequestParam(required = false) String group,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) String language,
            @RequestParam(required = false) String type) {

        List<QuestionPaper> list = paperRepository.findAll();
        if (group != null && !group.isEmpty())
            list = list.stream().filter(p -> p.getExamGroup().equalsIgnoreCase(group)).toList();
        if (year != null)
            list = list.stream().filter(p -> p.getExamYear().equals(year)).toList();
        if (language != null && !language.isEmpty())
            list = list.stream().filter(p -> p.getLanguage().equalsIgnoreCase(language)).toList();
        if (type != null && !type.isEmpty())
            list = list.stream().filter(p -> p.getExamType().equalsIgnoreCase(type)).toList();
        return ResponseEntity.ok(list);
    }

    // -------------------------------------------------------
    // GET /api/papers/{id}
    // -------------------------------------------------------
    @GetMapping("/{id}")
    public ResponseEntity<QuestionPaper> getPaperById(@PathVariable String id) {
        return paperRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // -------------------------------------------------------
    // POST /api/papers/upload  — register a new PDF paper
    // -------------------------------------------------------
    @PostMapping("/upload")
    public ResponseEntity<QuestionPaper> uploadPaper(@RequestBody QuestionPaper paper) {
        if (paper.getId() == null || paper.getId().isEmpty()) {
            String safeGroup = paper.getExamGroup() != null
                    ? paper.getExamGroup().toLowerCase().replace(" ", "-") : "unknown";
            paper.setId("paper-" + safeGroup + "-" + paper.getExamYear() + "-" + System.currentTimeMillis());
        }
        if (paper.getCreatedAt() == null) {
            paper.setCreatedAt(LocalDateTime.now());
        }
        // Validate required fields
        if (paper.getTitle() == null || paper.getTitle().isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        if (paper.getPdfFilePath() == null || paper.getPdfFilePath().isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        QuestionPaper saved = paperRepository.save(paper);
        return ResponseEntity.ok(saved);
    }

    // -------------------------------------------------------
    // PUT /api/papers/{id}  — update paper metadata
    // -------------------------------------------------------
    @PutMapping("/{id}")
    public ResponseEntity<QuestionPaper> updatePaper(
            @PathVariable String id,
            @RequestBody QuestionPaper updated) {

        return paperRepository.findById(id).map(existing -> {
            if (updated.getTitle() != null) existing.setTitle(updated.getTitle());
            if (updated.getExamGroup() != null) existing.setExamGroup(updated.getExamGroup());
            if (updated.getExamYear() != null) existing.setExamYear(updated.getExamYear());
            if (updated.getExamType() != null) existing.setExamType(updated.getExamType());
            if (updated.getLanguage() != null) existing.setLanguage(updated.getLanguage());
            if (updated.getTotalQuestions() != null) existing.setTotalQuestions(updated.getTotalQuestions());
            if (updated.getDurationMinutes() != null) existing.setDurationMinutes(updated.getDurationMinutes());
            if (updated.getTotalMarks() != null) existing.setTotalMarks(updated.getTotalMarks());
            if (updated.getPdfFilePath() != null) existing.setPdfFilePath(updated.getPdfFilePath());
            if (updated.getPublicationStatus() != null) existing.setPublicationStatus(updated.getPublicationStatus());
            return ResponseEntity.ok(paperRepository.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    // -------------------------------------------------------
    // DELETE /api/papers/{id}  — admin-only delete
    // -------------------------------------------------------
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deletePaper(@PathVariable String id) {
        if (paperRepository.existsById(id)) {
            paperRepository.deleteById(id);
            Map<String, Object> resp = new HashMap<>();
            resp.put("success", true);
            resp.put("deletedId", id);
            return ResponseEntity.ok(resp);
        }
        return ResponseEntity.notFound().build();
    }

    // -------------------------------------------------------
    // GET /api/papers/{id}/questions  — all questions in paper
    // -------------------------------------------------------
    @GetMapping("/{id}/questions")
    public ResponseEntity<List<Question>> getPaperQuestions(@PathVariable String id) {
        List<Question> questions = questionRepository.findByPdfId(id);
        return ResponseEntity.ok(questions);
    }

    // -------------------------------------------------------
    // POST /api/papers/questions/verify  — mark answer as verified
    // -------------------------------------------------------
    @PostMapping("/questions/verify")
    public ResponseEntity<Question> verifyQuestion(@RequestBody Question question) {
        question.setVerificationStatus("VERIFIED");
        Question saved = questionRepository.save(question);
        return ResponseEntity.ok(saved);
    }
}
