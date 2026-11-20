package com.examprep.controller;

import com.examprep.dto.*;
import com.examprep.entity.AITestAttempt;
import com.examprep.entity.PerformanceAnalysis;
import com.examprep.entity.WeakSection;
import com.examprep.repository.AITestAttemptRepository;
import com.examprep.repository.PerformanceAnalysisRepository;
import com.examprep.repository.WeakSectionRepository;
import com.examprep.service.AIAnalysisService;
import com.examprep.service.AIQuestionGenerationService;
import com.examprep.service.AITutorService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"}, allowCredentials = "true")
public class AIController {

    private final AIAnalysisService analysisService;
    private final AIQuestionGenerationService questionGenerationService;
    private final AITutorService tutorService;
    private final WeakSectionRepository weakSectionRepository;
    private final PerformanceAnalysisRepository analysisRepository;
    private final AITestAttemptRepository testAttemptRepository;
    private final ObjectMapper objectMapper;

    public AIController(AIAnalysisService analysisService,
                        AIQuestionGenerationService questionGenerationService,
                        AITutorService tutorService,
                        WeakSectionRepository weakSectionRepository,
                        PerformanceAnalysisRepository analysisRepository,
                        AITestAttemptRepository testAttemptRepository,
                        ObjectMapper objectMapper) {
        this.analysisService = analysisService;
        this.questionGenerationService = questionGenerationService;
        this.tutorService = tutorService;
        this.weakSectionRepository = weakSectionRepository;
        this.analysisRepository = analysisRepository;
        this.testAttemptRepository = testAttemptRepository;
        this.objectMapper = objectMapper;
    }

    /**
     * 1. Analyze student mock test performance via OpenAI
     */
    @PostMapping("/analyze-test")
    public ResponseEntity<PerformanceAnalysisResponse> analyzeTest(@Valid @RequestBody TestPerformanceRequest request) {
        PerformanceAnalysisResponse response = analysisService.analyzeTestPerformance(request);
        return ResponseEntity.ok(response);
    }

    /**
     * 2. Retrieve student's detected weak sections
     */
    @GetMapping("/weak-sections/{studentId}")
    public ResponseEntity<WeakSectionResponse> getWeakSections(@PathVariable String studentId) {
        List<WeakSection> sections = weakSectionRepository.findByStudentIdOrderByUpdatedAtDesc(studentId);

        // If no sections recorded yet, provide seed defaults reflecting typical exam sections
        if (sections.isEmpty()) {
            sections = List.of(
                    WeakSection.builder()
                            .studentId(studentId)
                            .sectionName("Quantitative Aptitude")
                            .topicName("Percentage & Profit-Loss")
                            .accuracy(35.0)
                            .weaknessLevel("Weak")
                            .totalQuestions(20)
                            .correctAnswers(7)
                            .wrongAnswers(13)
                            .recommendations("Mathematics accuracy is 35%. Review arithmetic calculation shortcuts.")
                            .build(),
                    WeakSection.builder()
                            .studentId(studentId)
                            .sectionName("English Language")
                            .topicName("Reading Comprehension & Grammar")
                            .accuracy(55.0)
                            .weaknessLevel("Needs Improvement")
                            .totalQuestions(20)
                            .correctAnswers(11)
                            .wrongAnswers(9)
                            .recommendations("English accuracy is 55%. Focus on subject-verb agreement and vocabulary.")
                            .build(),
                    WeakSection.builder()
                            .studentId(studentId)
                            .sectionName("Reasoning Ability")
                            .topicName("Syllogisms & Puzzles")
                            .accuracy(80.0)
                            .weaknessLevel("Good")
                            .totalQuestions(20)
                            .correctAnswers(16)
                            .wrongAnswers(4)
                            .recommendations("Reasoning is 80%. Good foundation! Advance to expert multi-tier puzzles.")
                            .build(),
                    WeakSection.builder()
                            .studentId(studentId)
                            .sectionName("General Knowledge")
                            .topicName("Current Affairs & Banking")
                            .accuracy(90.0)
                            .weaknessLevel("Excellent")
                            .totalQuestions(20)
                            .correctAnswers(18)
                            .wrongAnswers(2)
                            .recommendations("General Knowledge is 90%. Excellent mastery! Keep daily revision current.")
                            .build()
            );
        }

        List<WeakSectionResponse.WeakSectionDTO> dtos = sections.stream()
                .map(s -> WeakSectionResponse.WeakSectionDTO.builder()
                        .sectionName(s.getSectionName())
                        .topicName(s.getTopicName())
                        .accuracy(s.getAccuracy())
                        .weaknessLevel(s.getWeaknessLevel())
                        .totalQuestions(s.getTotalQuestions())
                        .correctAnswers(s.getCorrectAnswers())
                        .wrongAnswers(s.getWrongAnswers())
                        .recommendations(s.getRecommendations())
                        .build())
                .toList();

        return ResponseEntity.ok(WeakSectionResponse.builder().weakSections(dtos).build());
    }

    /**
     * 3. Retrieve latest AI recommendations for a student
     */
    @GetMapping("/recommendations/{studentId}")
    public ResponseEntity<Map<String, Object>> getRecommendations(@PathVariable String studentId) {
        List<PerformanceAnalysis> list = analysisRepository.findByStudentIdOrderByCreatedAtDesc(studentId);
        if (list.isEmpty()) {
            return ResponseEntity.ok(Map.of(
                    "status", "No tests taken yet",
                    "recommendations", List.of("Take a Full Mock Test or PYQ Paper to generate your first AI Diagnostic Profile.")
            ));
        }

        PerformanceAnalysis latest = list.get(0);
        return ResponseEntity.ok(Map.of(
                "studentId", studentId,
                "latestAccuracy", latest.getOverallAccuracy(),
                "repeatedMistakes", Optional.ofNullable(latest.getRepeatedMistakeTopics()).orElse("None detected"),
                "weakConcepts", Optional.ofNullable(latest.getWeakConcepts()).orElse(""),
                "strongConcepts", Optional.ofNullable(latest.getStrongConcepts()).orElse(""),
                "completedAt", latest.getCreatedAt().toString()
        ));
    }

    /**
     * 4. Generate section-specific AI mock test (10, 20, or 30 questions)
     */
    @PostMapping("/generate-mock-test")
    public ResponseEntity<MockTestGenerationResponse> generateMockTest(@Valid @RequestBody MockTestGenerationRequest request) {
        MockTestGenerationResponse response = questionGenerationService.generateMockTest(request);
        return ResponseEntity.ok(response);
    }

    /**
     * 5. Retrieve details of a generated test attempt
     */
    @GetMapping("/mock-tests/{testId}")
    public ResponseEntity<AITestAttempt> getGeneratedMockTest(@PathVariable Long testId) {
        return testAttemptRepository.findById(testId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * 6. Submit answers for an AI-generated mock test
     */
    @PostMapping("/submit-test")
    public ResponseEntity<Map<String, Object>> submitTest(@Valid @RequestBody TestSubmissionRequest request) {
        int total = request.getAnswers().size();
        int correct = (int) request.getAnswers().stream().filter(TestSubmissionRequest.AnswerSubmission::isCorrect).count();
        int wrong = total - correct;
        double accuracy = total > 0 ? Math.round((correct * 100.0 / total) * 10.0) / 10.0 : 0.0;

        String answersJson = "";
        try {
            answersJson = objectMapper.writeValueAsString(request.getAnswers());
        } catch (Exception ignored) {}

        AITestAttempt attempt = AITestAttempt.builder()
                .studentId(request.getStudentId())
                .testTitle(request.getTestTitle() != null ? request.getTestTitle() : "AI Mock Test")
                .sectionName(request.getSectionName())
                .totalQuestions(total)
                .correctCount(correct)
                .wrongCount(wrong)
                .skippedCount(0)
                .score((double) correct)
                .maxScore((double) total)
                .accuracyPercentage(accuracy)
                .timeTakenSeconds(request.getTimeTakenSeconds() != null ? request.getTimeTakenSeconds() : 0)
                .answersJson(answersJson)
                .createdAt(LocalDateTime.now())
                .build();

        AITestAttempt saved = testAttemptRepository.save(attempt);

        // Also trigger AI performance analysis update for continuous improvement
        List<TestPerformanceRequest.QuestionResult> qResults = request.getAnswers().stream()
                .map(a -> TestPerformanceRequest.QuestionResult.builder()
                        .questionText(a.getQuestionText())
                        .subjectName(a.getSubjectName() != null ? a.getSubjectName() : request.getSectionName())
                        .topicName(a.getTopicName() != null ? a.getTopicName() : "General Practice")
                        .userAnswer(a.getUserAnswer())
                        .correctAnswer(a.getCorrectAnswer())
                        .isCorrect(a.isCorrect())
                        .timeTakenSeconds(a.getTimeTakenSeconds())
                        .build())
                .toList();

        analysisService.analyzeTestPerformance(TestPerformanceRequest.builder()
                .studentId(request.getStudentId())
                .testTitle(request.getTestTitle())
                .testType("AI Mock Test")
                .questionResults(qResults)
                .build());

        return ResponseEntity.ok(Map.of(
                "attemptId", saved.getId(),
                "accuracy", accuracy,
                "score", correct,
                "maxScore", total,
                "message", "Test submitted and continuous improvement records updated!"
        ));
    }

    /**
     * 7. AI Personal Tutor for a weak section
     */
    @PostMapping("/tutor/improve-section")
    public ResponseEntity<AITutorResponse> getTutorGuidance(@Valid @RequestBody AITutorRequest request) {
        AITutorResponse response = tutorService.getImprovementGuidance(request);
        return ResponseEntity.ok(response);
    }

    /**
     * 8. Continuous Improvement History
     */
    @GetMapping("/history/{studentId}")
    public ResponseEntity<List<PerformanceAnalysis>> getHistory(@PathVariable String studentId) {
        List<PerformanceAnalysis> list = analysisRepository.findByStudentIdOrderByCreatedAtDesc(studentId);
        return ResponseEntity.ok(list);
    }
}

