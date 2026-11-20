package com.examprep.dto;

import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AITutorResponse {

    private String sectionName;
    private String topicName;
    private String conceptExplanation;
    private List<String> examples;
    private List<String> shortcuts;
    private List<String> formulas;
    private List<Object> practiceQuestions;
    private List<String> studyOrder;
}
