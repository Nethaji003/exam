package com.examprep.dto;

import lombok.*;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MockTestGenerationResponse {

    private Long testId;
    private List<GeneratedQuestionDTO> questions;
    private String errorMessage;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class GeneratedQuestionDTO {
        private Long id;
        private String questionText;
        private String questionTextEn;
        private String questionTextTa;
        private List<String> options;
        private List<Map<String, Object>> structuredOptions;
        private String optionAEn;
        private String optionATa;
        private String optionBEn;
        private String optionBTa;
        private String optionCEn;
        private String optionCTa;
        private String optionDEn;
        private String optionDTa;
        private String correctAnswer;
        private String explanation;
        private String explanationEn;
        private String explanationTa;
        private String language;
        private String difficultyLevel;
        private String difficulty;
        private String mainLevel;
        private String subLevel;
        private Integer estimatedTime;
        private String subject;
        private String topic;
        private String shortcut;
        private String concept;
        private String questionSource;
    }
}
