package com.examprep.dto;

import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PerformanceAnalysisResponse {

    private Long id;
    private String studentId;
    private Double overallAccuracy;
    private Integer totalQuestions;
    private Integer correctCount;
    private Integer wrongCount;
    private Integer skippedCount;
    private String createdAt;
    private List<SectionAnalysis> sections;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SectionAnalysis {
        private String sectionName;
        private String topicName;
        private Integer totalQuestions;
        private Integer correct;
        private Integer wrong;
        private Double accuracyPercentage;
        private String weaknessLevel;
        private String recommendations;
    }
}
