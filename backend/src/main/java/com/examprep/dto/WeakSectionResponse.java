package com.examprep.dto;

import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WeakSectionResponse {

    private List<WeakSectionDTO> weakSections;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class WeakSectionDTO {
        private String sectionName;
        private String topicName;
        private Double accuracy;
        private String weaknessLevel;
        private Integer totalQuestions;
        private Integer correctAnswers;
        private Integer wrongAnswers;
        private String recommendations;
    }
}
