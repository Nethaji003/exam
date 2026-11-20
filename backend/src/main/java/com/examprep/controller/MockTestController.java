package com.examprep.controller;

import com.examprep.entity.MockTest;
import com.examprep.entity.MockTestQuestion;
import com.examprep.entity.Question;
import com.examprep.repository.MockTestQuestionRepository;
import com.examprep.repository.MockTestRepository;
import com.examprep.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/mock-tests")
@CrossOrigin(origins = "*")
public class MockTestController {

    @Autowired
    private MockTestRepository mockTestRepository;

    @Autowired
    private MockTestQuestionRepository mockTestQuestionRepository;

    @Autowired
    private QuestionRepository questionRepository;

    // -------------------------------------------------------
    // GET /api/mock-tests  — list all mock tests
    // -------------------------------------------------------
    @GetMapping
    public ResponseEntity<List<MockTest>> getMockTests(
            @RequestParam(required = false) String examGroup,
            @RequestParam(required = false) String testType) {

        List<MockTest> tests = mockTestRepository.findAllByOrderByCreatedAtDesc();
        if (examGroup != null && !examGroup.isEmpty()) {
            tests = tests.stream()
                    .filter(t -> t.getExamGroup().equalsIgnoreCase(examGroup))
                    .collect(Collectors.toList());
        }
        if (testType != null && !testType.isEmpty()) {
            tests = tests.stream()
                    .filter(t -> t.getTestType().equalsIgnoreCase(testType))
                    .collect(Collectors.toList());
        }
        return ResponseEntity.ok(tests);
    }

    // -------------------------------------------------------
    // GET /api/mock-tests/{id}  — get a test with its questions
    // -------------------------------------------------------
    @GetMapping("/{id}")
    public ResponseEntity<MockTest> getMockTest(@PathVariable String id) {
        return mockTestRepository.findById(id).map(test -> {
            List<MockTestQuestion> mappings = mockTestQuestionRepository
                    .findByMockTestIdOrderByQuestionOrderAsc(id);
            List<String> qIds = mappings.stream()
                    .map(MockTestQuestion::getQuestionId)
                    .collect(Collectors.toList());
            List<Question> questions = questionRepository.findAllById(qIds);
            // Preserve order from mapping
            Map<String, Question> qMap = questions.stream()
                    .collect(Collectors.toMap(Question::getId, q -> q));
            List<Question> ordered = qIds.stream()
                    .map(qMap::get)
                    .filter(Objects::nonNull)
                    .collect(Collectors.toList());
            test.setQuestions(ordered);
            return ResponseEntity.ok(test);
        }).orElse(ResponseEntity.notFound().build());
    }

    // -------------------------------------------------------
    // POST /api/mock-tests  — create a mock test with questions
    // -------------------------------------------------------
    @PostMapping
    public ResponseEntity<MockTest> createMockTest(@RequestBody MockTestCreateRequest request) {
        if (request.getId() == null || request.getId().isEmpty()) {
            request.setId("mock-" + System.currentTimeMillis());
        }
        MockTest test = new MockTest();
        test.setId(request.getId());
        test.setTitle(request.getTitle());
        test.setExamGroup(request.getExamGroup());
        test.setSubject(request.getSubject());
        test.setTopic(request.getTopic());
        test.setTotalQuestions(request.getTotalQuestions());
        test.setTestType(request.getTestType());
        test.setPyqPercentage(request.getPyqPercentage() != null ? request.getPyqPercentage() : 100);
        test.setDurationMinutes(request.getDurationMinutes() != null ? request.getDurationMinutes() : 60);
        test.setTotalMarks(request.getTotalMarks() != null ? request.getTotalMarks() : 100.0);
        test.setNegativeMarking(request.getNegativeMarking() != null ? request.getNegativeMarking() : 0.0);
        test.setCreatedAt(LocalDateTime.now());

        MockTest saved = mockTestRepository.save(test);

        // Save question mappings
        if (request.getQuestionIds() != null && !request.getQuestionIds().isEmpty()) {
            List<MockTestQuestion> mappings = new ArrayList<>();
            int order = 1;
            for (String qId : request.getQuestionIds()) {
                mappings.add(new MockTestQuestion(saved.getId(), qId, order++));
            }
            mockTestQuestionRepository.saveAll(mappings);
        }

        return ResponseEntity.ok(saved);
    }

    // -------------------------------------------------------
    // POST /api/mock-tests/generate — generate a test from pool
    // Questions are drawn from DB and returned in-memory
    // -------------------------------------------------------
    @PostMapping("/generate")
    public ResponseEntity<GenerateMockTestResponse> generateMockTest(
            @RequestBody GenerateMockTestRequest request) {

        int requestedCount = request.getQuestionCount() != null ? request.getQuestionCount() : 20;
        String examGroup = request.getExamGroup();
        String subject = request.getSubject();
        String topic = request.getTopic();
        String mode = request.getMode() != null ? request.getMode().toUpperCase() : "PYQ";

        int pyqCount = requestedCount;
        int aiCount = 0;
        if ("AI_GENERATED".equals(mode)) {
            pyqCount = 0;
            aiCount = requestedCount;
        } else if ("MIXED".equals(mode)) {
            int pct = request.getPyqPercentage() != null ? request.getPyqPercentage() : 70;
            pyqCount = (int) Math.round(requestedCount * pct / 100.0);
            aiCount = requestedCount - pyqCount;
        }

        List<Question> pool = new ArrayList<>();

        // Pull PYQ questions from DB
        if (pyqCount > 0) {
            List<Question> pyqPool = questionRepository.findFiltered(
                    examGroup,
                    (subject != null && !subject.isBlank()) ? subject : null,
                    (topic != null && !topic.isBlank()) ? topic : null,
                    "PREVIOUS_YEAR",
                    "VERIFIED"
            );
            Collections.shuffle(pyqPool);
            pool.addAll(pyqPool.subList(0, Math.min(pyqCount, pyqPool.size())));
        }

        // Pull AI_GENERATED questions from DB
        if (aiCount > 0) {
            List<Question> aiPool = questionRepository.findFiltered(
                    examGroup,
                    (subject != null && !subject.isBlank()) ? subject : null,
                    (topic != null && !topic.isBlank()) ? topic : null,
                    "AI_GENERATED",
                    "VERIFIED"
            );
            Collections.shuffle(aiPool);
            pool.addAll(aiPool.subList(0, Math.min(aiCount, aiPool.size())));
        }

        int available = pool.size();
        boolean hasEnough = available >= requestedCount;

        GenerateMockTestResponse response = new GenerateMockTestResponse();
        response.setQuestions(pool.subList(0, Math.min(requestedCount, pool.size())));
        response.setRequestedCount(requestedCount);
        response.setReturnedCount(response.getQuestions().size());
        response.setHasEnoughQuestions(hasEnough);
        if (!hasEnough) {
            response.setWarning("Only " + available + " verified questions available for the selected filters. " +
                    "Please add more verified questions or broaden the subject/topic selection.");
        }
        return ResponseEntity.ok(response);
    }

    // -------------------------------------------------------
    // DELETE /api/mock-tests/{id}
    // -------------------------------------------------------
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteMockTest(@PathVariable String id) {
        if (mockTestRepository.existsById(id)) {
            mockTestQuestionRepository.deleteByMockTestId(id);
            mockTestRepository.deleteById(id);
            Map<String, Object> resp = new HashMap<>();
            resp.put("success", true);
            resp.put("deletedId", id);
            return ResponseEntity.ok(resp);
        }
        return ResponseEntity.notFound().build();
    }

    // -------------------------------------------------------
    // Inner request/response DTOs
    // -------------------------------------------------------
    public static class MockTestCreateRequest {
        private String id;
        private String title;
        private String examGroup;
        private String subject;
        private String topic;
        private Integer totalQuestions;
        private String testType;
        private Integer pyqPercentage;
        private Integer durationMinutes;
        private Double totalMarks;
        private Double negativeMarking;
        private List<String> questionIds;

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getExamGroup() { return examGroup; }
        public void setExamGroup(String examGroup) { this.examGroup = examGroup; }
        public String getSubject() { return subject; }
        public void setSubject(String subject) { this.subject = subject; }
        public String getTopic() { return topic; }
        public void setTopic(String topic) { this.topic = topic; }
        public Integer getTotalQuestions() { return totalQuestions; }
        public void setTotalQuestions(Integer totalQuestions) { this.totalQuestions = totalQuestions; }
        public String getTestType() { return testType; }
        public void setTestType(String testType) { this.testType = testType; }
        public Integer getPyqPercentage() { return pyqPercentage; }
        public void setPyqPercentage(Integer pyqPercentage) { this.pyqPercentage = pyqPercentage; }
        public Integer getDurationMinutes() { return durationMinutes; }
        public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }
        public Double getTotalMarks() { return totalMarks; }
        public void setTotalMarks(Double totalMarks) { this.totalMarks = totalMarks; }
        public Double getNegativeMarking() { return negativeMarking; }
        public void setNegativeMarking(Double negativeMarking) { this.negativeMarking = negativeMarking; }
        public List<String> getQuestionIds() { return questionIds; }
        public void setQuestionIds(List<String> questionIds) { this.questionIds = questionIds; }
    }

    public static class GenerateMockTestRequest {
        private String examGroup;
        private String subject;
        private String topic;
        private Integer questionCount;
        private String mode; // PYQ, AI_GENERATED, MIXED
        private Integer pyqPercentage;
        private String language;

        public String getExamGroup() { return examGroup; }
        public void setExamGroup(String examGroup) { this.examGroup = examGroup; }
        public String getSubject() { return subject; }
        public void setSubject(String subject) { this.subject = subject; }
        public String getTopic() { return topic; }
        public void setTopic(String topic) { this.topic = topic; }
        public Integer getQuestionCount() { return questionCount; }
        public void setQuestionCount(Integer questionCount) { this.questionCount = questionCount; }
        public String getMode() { return mode; }
        public void setMode(String mode) { this.mode = mode; }
        public Integer getPyqPercentage() { return pyqPercentage; }
        public void setPyqPercentage(Integer pyqPercentage) { this.pyqPercentage = pyqPercentage; }
        public String getLanguage() { return language; }
        public void setLanguage(String language) { this.language = language; }
    }

    public static class GenerateMockTestResponse {
        private List<Question> questions;
        private int requestedCount;
        private int returnedCount;
        private boolean hasEnoughQuestions;
        private String warning;

        public List<Question> getQuestions() { return questions; }
        public void setQuestions(List<Question> questions) { this.questions = questions; }
        public int getRequestedCount() { return requestedCount; }
        public void setRequestedCount(int requestedCount) { this.requestedCount = requestedCount; }
        public int getReturnedCount() { return returnedCount; }
        public void setReturnedCount(int returnedCount) { this.returnedCount = returnedCount; }
        public boolean isHasEnoughQuestions() { return hasEnoughQuestions; }
        public void setHasEnoughQuestions(boolean hasEnoughQuestions) { this.hasEnoughQuestions = hasEnoughQuestions; }
        public String getWarning() { return warning; }
        public void setWarning(String warning) { this.warning = warning; }
    }
}

