package com.examprep.service;

import com.examprep.dto.PerformanceAnalysisResponse;
import com.examprep.dto.TestPerformanceRequest;
import com.examprep.entity.PerformanceAnalysis;
import com.examprep.entity.WeakSection;
import com.examprep.repository.PerformanceAnalysisRepository;
import com.examprep.repository.WeakSectionRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AIAnalysisService {

    private static final Logger log = LoggerFactory.getLogger(AIAnalysisService.class);

    private final OpenAIService openAIService;
    private final PerformanceAnalysisRepository analysisRepository;
    private final WeakSectionRepository weakSectionRepository;
    private final ObjectMapper objectMapper;

    public AIAnalysisService(OpenAIService openAIService,
                             PerformanceAnalysisRepository analysisRepository,
                             WeakSectionRepository weakSectionRepository,
                             ObjectMapper objectMapper) {
        this.openAIService = openAIService;
        this.analysisRepository = analysisRepository;
        this.weakSectionRepository = weakSectionRepository;
        this.objectMapper = objectMapper;
    }

    @Transactional
    public PerformanceAnalysisResponse analyzeTestPerformance(TestPerformanceRequest request) {
        String studentId = request.getStudentId();
        List<TestPerformanceRequest.QuestionResult> questions = request.getQuestionResults();

        int totalQuestions = questions.size();
        int correctCount = (int) questions.stream().filter(TestPerformanceRequest.QuestionResult::isCorrect).count();
        int wrongCount = (int) questions.stream()
                .filter(q -> !q.isCorrect() && q.getUserAnswer() != null && !q.getUserAnswer().isBlank() && !"Skipped".equalsIgnoreCase(q.getUserAnswer()))
                .count();
        int skippedCount = totalQuestions - correctCount - wrongCount;
        double overallAccuracy = totalQuestions > 0 ? Math.round(((double) correctCount / totalQuestions) * 1000.0) / 10.0 : 0.0;

        // Group by subject and topic
        Map<String, List<TestPerformanceRequest.QuestionResult>> subjectMap = questions.stream()
                .collect(Collectors.groupingBy(q -> Optional.ofNullable(q.getSubjectName()).orElse("General")));

        // Check past mistakes to detect repeated mistakes
        List<PerformanceAnalysis> pastAnalyses = analysisRepository.findByStudentIdOrderByCreatedAtDesc(studentId);
        Set<String> previousWeakTopics = new HashSet<>();
        for (PerformanceAnalysis past : pastAnalyses) {
            if (past.getWeakConcepts() != null) {
                previousWeakTopics.addAll(Arrays.asList(past.getWeakConcepts().split(",\\s*")));
            }
        }

        List<PerformanceAnalysisResponse.SectionAnalysis> sectionAnalyses = new ArrayList<>();
        List<String> detectedRepeatedMistakes = new ArrayList<>();
        List<String> strongConcepts = new ArrayList<>();
        List<String> weakConcepts = new ArrayList<>();

        // Try calling OpenAI for intelligent evaluation
        boolean aiSucceeded = false;
        String rawAiJson = "";

        if (openAIService.isConfigured()) {
            try {
                String systemPrompt = """
                        You are an expert AI Tutor and Exam Psychometrician for Indian Government Exams (Banking, SSC, Railways).
                        Analyze the student's mock test results and return ONLY a valid JSON object matching this exact schema:
                        {
                          "sections": [
                            {
                              "sectionName": "Mathematics",
                              "topicName": "Profit & Loss",
                              "totalQuestions": 10,
                              "correct": 4,
                              "wrong": 6,
                              "accuracyPercentage": 40.0,
                              "weaknessLevel": "Weak", // Options: "Weak", "Needs Improvement", "Good", "Excellent"
                              "weakConcepts": ["Discount calculations", "Marked price formula"],
                              "strongConcepts": ["Basic profit formula"],
                              "recommendations": "Practice successive discounts and reverse calculation from selling price."
                            }
                          ],
                          "repeatedMistakes": ["Formulas inverted in Speed Time Distance"],
                          "overallRecommendations": "Focus immediately on Quantitative Aptitude arithmetic."
                        }
                        Weakness criteria:
                        - Accuracy < 50%: "Weak"
                        - Accuracy 50% - 69%: "Needs Improvement"
                        - Accuracy 70% - 84%: "Good"
                        - Accuracy >= 85%: "Excellent"
                        """;

                String userPrompt = buildAnalysisPrompt(request, pastAnalyses);
                rawAiJson = openAIService.callOpenAI(systemPrompt, userPrompt);

                JsonNode root = objectMapper.readTree(rawAiJson);
                JsonNode sectionsNode = root.path("sections");
                if (sectionsNode.isArray() && !sectionsNode.isEmpty()) {
                    for (JsonNode sec : sectionsNode) {
                        String sName = sec.path("sectionName").asText("General");
                        String tName = sec.path("topicName").asText("Mixed Topics");
                        int tot = sec.path("totalQuestions").asInt(1);
                        int cor = sec.path("correct").asInt(0);
                        int wrg = sec.path("wrong").asInt(0);
                        double acc = sec.path("accuracyPercentage").asDouble(tot > 0 ? (cor * 100.0 / tot) : 0);
                        String wLevel = sec.path("weaknessLevel").asText(deriveWeaknessLevel(acc));
                        String reco = sec.path("recommendations").asText("Revise fundamentals and practice targeted exercises.");

                        sectionAnalyses.add(PerformanceAnalysisResponse.SectionAnalysis.builder()
                                .sectionName(sName)
                                .topicName(tName)
                                .totalQuestions(tot)
                                .correct(cor)
                                .wrong(wrg)
                                .accuracyPercentage(acc)
                                .weaknessLevel(wLevel)
                                .recommendations(reco)
                                .build());

                        if ("Weak".equalsIgnoreCase(wLevel) || "Needs Improvement".equalsIgnoreCase(wLevel)) {
                            weakConcepts.add(tName);
                        } else {
                            strongConcepts.add(tName);
                        }
                    }

                    JsonNode repNode = root.path("repeatedMistakes");
                    if (repNode.isArray()) {
                        for (JsonNode r : repNode) {
                            detectedRepeatedMistakes.add(r.asText());
                        }
                    }

                    aiSucceeded = true;
                }
            } catch (Exception e) {
                log.warn("OpenAI analysis failed or returned invalid JSON. Using rule-based fallback. Error: {}", e.getMessage());
            }
        }

        // Rule-Based Fallback if OpenAI not configured or failed
        if (!aiSucceeded) {
            sectionAnalyses = computeRuleBasedSectionAnalyses(subjectMap, previousWeakTopics, detectedRepeatedMistakes, strongConcepts, weakConcepts);
            try {
                Map<String, Object> fallbackMap = new HashMap<>();
                fallbackMap.put("sections", sectionAnalyses);
                fallbackMap.put("repeatedMistakes", detectedRepeatedMistakes);
                fallbackMap.put("overallRecommendations", "Complete targeted revision on topics with accuracy under 60%.");
                rawAiJson = objectMapper.writeValueAsString(fallbackMap);
            } catch (Exception ignored) {}
        }

        // Persist WeakSection entities in MySQL
        for (PerformanceAnalysisResponse.SectionAnalysis sec : sectionAnalyses) {
            updateWeakSectionInDb(studentId, sec);
        }

        // Persist PerformanceAnalysis entity in MySQL
        PerformanceAnalysis analysis = PerformanceAnalysis.builder()
                .studentId(studentId)
                .testAttemptId(request.getTestTitle() != null ? request.getTestTitle() : "Test-" + System.currentTimeMillis())
                .analysisJson(rawAiJson)
                .overallAccuracy(overallAccuracy)
                .totalQuestions(totalQuestions)
                .correctCount(correctCount)
                .wrongCount(wrongCount)
                .skippedCount(skippedCount)
                .repeatedMistakeTopics(String.join(", ", detectedRepeatedMistakes))
                .strongConcepts(String.join(", ", strongConcepts))
                .weakConcepts(String.join(", ", weakConcepts))
                .createdAt(LocalDateTime.now())
                .build();

        PerformanceAnalysis savedAnalysis = analysisRepository.save(analysis);

        return PerformanceAnalysisResponse.builder()
                .id(savedAnalysis.getId())
                .studentId(studentId)
                .overallAccuracy(overallAccuracy)
                .totalQuestions(totalQuestions)
                .correctCount(correctCount)
                .wrongCount(wrongCount)
                .skippedCount(skippedCount)
                .createdAt(savedAnalysis.getCreatedAt().toString())
                .sections(sectionAnalyses)
                .build();
    }

    private void updateWeakSectionInDb(String studentId, PerformanceAnalysisResponse.SectionAnalysis sec) {
        Optional<WeakSection> existing = weakSectionRepository.findByStudentIdAndSectionNameAndTopicName(
                studentId, sec.getSectionName(), sec.getTopicName()
        );

        WeakSection ws = existing.orElseGet(() -> WeakSection.builder()
                .studentId(studentId)
                .sectionName(sec.getSectionName())
                .topicName(sec.getTopicName())
                .build());

        ws.setAccuracy(sec.getAccuracyPercentage());
        ws.setWeaknessLevel(sec.getWeaknessLevel());
        ws.setTotalQuestions(sec.getTotalQuestions());
        ws.setCorrectAnswers(sec.getCorrect());
        ws.setWrongAnswers(sec.getWrong());
        ws.setRecommendations(sec.getRecommendations());
        ws.setUpdatedAt(LocalDateTime.now());

        weakSectionRepository.save(ws);
    }

    private String deriveWeaknessLevel(double accuracy) {
        if (accuracy < 50.0) return "Weak";
        if (accuracy < 70.0) return "Needs Improvement";
        if (accuracy < 85.0) return "Good";
        return "Excellent";
    }

    private List<PerformanceAnalysisResponse.SectionAnalysis> computeRuleBasedSectionAnalyses(
            Map<String, List<TestPerformanceRequest.QuestionResult>> subjectMap,
            Set<String> previousWeakTopics,
            List<String> detectedRepeatedMistakes,
            List<String> strongConcepts,
            List<String> weakConcepts) {

        List<PerformanceAnalysisResponse.SectionAnalysis> list = new ArrayList<>();

        for (Map.Entry<String, List<TestPerformanceRequest.QuestionResult>> entry : subjectMap.entrySet()) {
            String subject = entry.getKey();
            List<TestPerformanceRequest.QuestionResult> qList = entry.getValue();

            // Group by topic within subject
            Map<String, List<TestPerformanceRequest.QuestionResult>> topicMap = qList.stream()
                    .collect(Collectors.groupingBy(q -> Optional.ofNullable(q.getTopicName()).orElse("General")));

            for (Map.Entry<String, List<TestPerformanceRequest.QuestionResult>> topicEntry : topicMap.entrySet()) {
                String topic = topicEntry.getKey();
                List<TestPerformanceRequest.QuestionResult> tQs = topicEntry.getValue();

                int total = tQs.size();
                int correct = (int) tQs.stream().filter(TestPerformanceRequest.QuestionResult::isCorrect).count();
                int wrong = total - correct;
                double acc = total > 0 ? Math.round((correct * 100.0 / total) * 10.0) / 10.0 : 0.0;
                String level = deriveWeaknessLevel(acc);

                String recommendation;
                if ("Weak".equals(level)) {
                    recommendation = "High priority: Review core rules and formulas for " + topic + ". Attempt 20 targeted practice questions.";
                    weakConcepts.add(topic);
                    if (previousWeakTopics.contains(topic)) {
                        detectedRepeatedMistakes.add(topic + " (persistent low accuracy across attempts)");
                    }
                } else if ("Needs Improvement".equals(level)) {
                    recommendation = "Focus on speed and calculation shortcuts for " + topic + " to raise accuracy above 75%.";
                    weakConcepts.add(topic);
                } else if ("Good".equals(level)) {
                    recommendation = "Solid foundation. Practice higher difficulty questions to reach mastery.";
                    strongConcepts.add(topic);
                } else {
                    recommendation = "Exemplary performance! Maintain your speed and streak in " + topic + ".";
                    strongConcepts.add(topic);
                }

                list.add(PerformanceAnalysisResponse.SectionAnalysis.builder()
                        .sectionName(subject)
                        .topicName(topic)
                        .totalQuestions(total)
                        .correct(correct)
                        .wrong(wrong)
                        .accuracyPercentage(acc)
                        .weaknessLevel(level)
                        .recommendations(recommendation)
                        .build());
            }
        }

        return list;
    }

    private String buildAnalysisPrompt(TestPerformanceRequest request, List<PerformanceAnalysis> pastAnalyses) {
        StringBuilder sb = new StringBuilder();
        sb.append("Test Title: ").append(request.getTestTitle()).append("\n");
        sb.append("Student Questions Summary:\n");
        for (TestPerformanceRequest.QuestionResult q : request.getQuestionResults()) {
            sb.append("- [").append(q.getSubjectName()).append(" / ").append(q.getTopicName()).append("] ")
                    .append("User Answer: ").append(q.getUserAnswer())
                    .append(" | Correct: ").append(q.getCorrectAnswer())
                    .append(" | Result: ").append(q.isCorrect() ? "CORRECT" : "WRONG")
                    .append(" | Time: ").append(q.getTimeTakenSeconds()).append("s\n");
        }
        if (!pastAnalyses.isEmpty()) {
            sb.append("\nPrevious Mistake History:\n");
            for (PerformanceAnalysis pa : pastAnalyses.stream().limit(3).toList()) {
                sb.append("Attempt on ").append(pa.getCreatedAt()).append(" Weak: ").append(pa.getWeakConcepts()).append("\n");
            }
        }
        return sb.toString();
    }
}

