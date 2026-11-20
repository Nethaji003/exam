package com.examprep.service;

import com.examprep.dto.AITutorRequest;
import com.examprep.dto.AITutorResponse;
import com.examprep.entity.AITutorSession;
import com.examprep.entity.WeakSection;
import com.examprep.repository.AITutorSessionRepository;
import com.examprep.repository.WeakSectionRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class AITutorService {

    private static final Logger log = LoggerFactory.getLogger(AITutorService.class);

    private final OpenAIService openAIService;
    private final WeakSectionRepository weakSectionRepository;
    private final AITutorSessionRepository tutorSessionRepository;
    private final ObjectMapper objectMapper;

    public AITutorService(OpenAIService openAIService,
                          WeakSectionRepository weakSectionRepository,
                          AITutorSessionRepository tutorSessionRepository,
                          ObjectMapper objectMapper) {
        this.openAIService = openAIService;
        this.weakSectionRepository = weakSectionRepository;
        this.tutorSessionRepository = tutorSessionRepository;
        this.objectMapper = objectMapper;
    }

    public AITutorResponse getImprovementGuidance(AITutorRequest request) {
        String studentId = request.getStudentId();
        String sectionName = request.getSectionName();
        String topicName = request.getTopicName() != null ? request.getTopicName() : "Core Principles";

        // Check if there is specific weak section data
        Optional<WeakSection> wsOpt = weakSectionRepository.findByStudentIdAndSectionNameAndTopicName(studentId, sectionName, topicName);
        String recommendationsContext = wsOpt.map(WeakSection::getRecommendations).orElse("General concept clarification needed.");

        boolean aiSuccess = false;
        AITutorResponse response = null;
        String rawTutorJson = "";

        if (openAIService.isConfigured()) {
            try {
                String systemPrompt = String.format("""
                        You are a friendly, encouraging expert AI Personal Tutor for competitive exam aspirants.
                        The student is struggling with Section: "%s", Topic: "%s".
                        Previous weakness note: "%s".
                        
                        Provide a comprehensive, easy-to-understand tutorial that directly targets their mistakes.
                        Return ONLY valid JSON matching this schema:
                        {
                          "sectionName": "%s",
                          "topicName": "%s",
                          "conceptExplanation": "Clear, accessible explanation of the core concept breaking down common traps...",
                          "examples": [
                            "Example 1: Step-by-step walkthrough...",
                            "Example 2: Common variation..."
                          ],
                          "shortcuts": [
                            "Shortcut Trick 1: When seeing X, use formula Y directly...",
                            "Shortcut Trick 2: Elimination strategy..."
                          ],
                          "formulas": [
                            "Formula 1: Standard definition",
                            "Formula 2: Quick ratio form"
                          ],
                          "practiceQuestions": [
                            {
                              "questionText": "A quick test question on this concept...",
                              "options": [
                                {"key": "A", "text": "Option A"},
                                {"key": "B", "text": "Option B"},
                                {"key": "C", "text": "Option C"},
                                {"key": "D", "text": "Option D"}
                              ],
                              "correctAnswer": "A",
                              "explanation": "Why A is correct..."
                            }
                          ],
                          "studyOrder": [
                            "Step 1: Master basic ratio representation",
                            "Step 2: Memorize successive percentage table",
                            "Step 3: Solve 15 timed sectional questions"
                          ]
                        }
                        """, sectionName, topicName, recommendationsContext, sectionName, topicName);

                String userPrompt = String.format("Teach me the fundamentals of '%s' in '%s', explain why students make mistakes, provide shortcuts, and give 2 practice questions.", topicName, sectionName);

                rawTutorJson = openAIService.callOpenAI(systemPrompt, userPrompt);
                JsonNode root = objectMapper.readTree(rawTutorJson);

                List<String> examples = new ArrayList<>();
                root.path("examples").forEach(e -> examples.add(e.asText()));

                List<String> shortcuts = new ArrayList<>();
                root.path("shortcuts").forEach(s -> shortcuts.add(s.asText()));

                List<String> formulas = new ArrayList<>();
                root.path("formulas").forEach(f -> formulas.add(f.asText()));

                List<String> studyOrder = new ArrayList<>();
                root.path("studyOrder").forEach(so -> studyOrder.add(so.asText()));

                List<Object> practiceQuestions = new ArrayList<>();
                root.path("practiceQuestions").forEach(pq -> practiceQuestions.add(objectMapper.convertValue(pq, Map.class)));

                response = AITutorResponse.builder()
                        .sectionName(sectionName)
                        .topicName(topicName)
                        .conceptExplanation(root.path("conceptExplanation").asText())
                        .examples(examples)
                        .shortcuts(shortcuts)
                        .formulas(formulas)
                        .practiceQuestions(practiceQuestions)
                        .studyOrder(studyOrder)
                        .build();

                aiSuccess = true;
            } catch (Exception e) {
                log.warn("OpenAI Tutor service call failed: {}. Employing structured educational fallback.", e.getMessage());
            }
        }

        if (!aiSuccess || response == null) {
            response = buildFallbackTutorResponse(sectionName, topicName);
            try {
                rawTutorJson = objectMapper.writeValueAsString(response);
            } catch (Exception ignored) {}
        }

        // Save session in MySQL
        AITutorSession session = AITutorSession.builder()
                .studentId(studentId)
                .sectionName(sectionName)
                .topicName(topicName)
                .tutorResponseJson(rawTutorJson)
                .createdAt(LocalDateTime.now())
                .build();
        tutorSessionRepository.save(session);

        return response;
    }

    private AITutorResponse buildFallbackTutorResponse(String section, String topic) {
        String explanation;
        List<String> examples = new ArrayList<>();
        List<String> shortcuts = new ArrayList<>();
        List<String> formulas = new ArrayList<>();
        List<String> studyOrder = new ArrayList<>();
        List<Object> practice = new ArrayList<>();

        if (section.toLowerCase().contains("quant") || section.toLowerCase().contains("math")) {
            explanation = String.format("In %s, mistakes almost always occur during fractional conversion or calculating change on the wrong base (e.g. dividing by SP instead of CP). Always anchor your baseline: initial value is 100%%.", topic);
            examples.add("Example: If price increases by 25% (1/4), consumption must decrease by 1/(4+1) = 1/5 = 20% to keep expenditure unchanged.");
            examples.add("Example: Successive discounts of 20% and 10% do not equal 30%! Net = 20 + 10 - (20*10)/100 = 28%.");
            shortcuts.add("Shortcut: When A increases by x/y, the reverse decrease is x / (y + x).");
            shortcuts.add("Shortcut: Effective rate for successive changes A% and B% = [A + B + (A * B)/100]%.");
            formulas.add("Percentage Change = [(Final - Initial) / Initial] * 100");
            formulas.add("SP = CP * (100 + Profit%) / 100");
            studyOrder.add("1. Review standard fraction-to-percentage table (1/2 through 1/20).");
            studyOrder.add("2. Practice 10 problems on percentage increase/decrease balance.");
            studyOrder.add("3. Attempt the AI-Generated Mock Test for " + section + ".");
            practice.add(Map.of(
                    "questionText", "If the price of sugar increases by 20%, by what percent must a household reduce consumption to keep expenses constant?",
                    "options", List.of(
                            Map.of("key", "A", "text", "16.67%"),
                            Map.of("key", "B", "text", "20%"),
                            Map.of("key", "C", "text", "25%"),
                            Map.of("key", "D", "text", "15%")
                    ),
                    "correctAnswer", "A",
                    "explanation", "Increase is 20% = 1/5. Reduction required = 1 / (5 + 1) = 1/6 = 16.67%."
            ));
        } else if (section.toLowerCase().contains("reason")) {
            explanation = String.format("For %s, avoid assumptions not explicitly stated in the premises. In syllogisms, 'Some A are B' does NOT imply 'Some A are not B'. Rely on Venn diagrams or 100-50 rules.", topic);
            examples.add("Example: Statements: All cats are animals. Some animals are wild. Conclusion: Some cats are wild -> False (Indeterminate).");
            shortcuts.add("Shortcut: An affirmative premise can NEVER yield a negative definite conclusion.");
            shortcuts.add("Shortcut: If neither conclusion follows individually, check for Either-Or complementary pairs (Same subject/predicate, one positive and one negative).");
            formulas.add("All + All = All");
            formulas.add("All + No = No");
            studyOrder.add("1. Master Venn diagram overlapping and disjoint sets.");
            studyOrder.add("2. Memorize the 3 conditions for 'Either-Or' conclusions.");
            studyOrder.add("3. Practice 15 timed sectional reasoning questions.");
            practice.add(Map.of(
                    "questionText", "Statements: All P are Q. Some Q are R. Which conclusion definitely follows?",
                    "options", List.of(
                            Map.of("key", "A", "text", "Some P are R"),
                            Map.of("key", "B", "text", "Some Q are P"),
                            Map.of("key", "C", "text", "All R are P"),
                            Map.of("key", "D", "text", "No P is R")
                    ),
                    "correctAnswer", "B",
                    "explanation", "Since All P are Q, the converse 'Some Q are P' is always definitely true."
            ));
        } else {
            explanation = String.format("For %s, the key is contextual consistency and eliminating choices that alter meaning or tense.", topic);
            examples.add("Example: 'Neither the teacher nor the students were present' -> Verb agrees with closest subject (students = were).");
            shortcuts.add("Shortcut: Proximity rule for 'Neither... nor' and 'Either... or'—verb agrees with the nearest subject.");
            formulas.add("Singular Subject + Singular Verb");
            formulas.add("Plural Subject + Plural Verb");
            studyOrder.add("1. Review subject-verb agreement rules with correlative conjunctions.");
            studyOrder.add("2. Practice identifying main subjects separated by prepositional phrases.");
            studyOrder.add("3. Take a 10-question AI practice drill.");
            practice.add(Map.of(
                    "questionText", "Choose the correct verb: 'The quality of these mangoes ___ not good.'",
                    "options", List.of(
                            Map.of("key", "A", "text", "is"),
                            Map.of("key", "B", "text", "are"),
                            Map.of("key", "C", "text", "were"),
                            Map.of("key", "D", "text", "have")
                    ),
                    "correctAnswer", "A",
                    "explanation", "The subject is 'quality' (singular), not 'mangoes'. Therefore, singular verb 'is' is required."
            ));
        }

        return AITutorResponse.builder()
                .sectionName(section)
                .topicName(topic)
                .conceptExplanation(explanation)
                .examples(examples)
                .shortcuts(shortcuts)
                .formulas(formulas)
                .practiceQuestions(practice)
                .studyOrder(studyOrder)
                .build();
    }
}

