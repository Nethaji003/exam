package com.examprep.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MockTestGenerationRequest {

    @NotBlank(message = "Student ID is required")
    private String studentId;

    private String examName;

    @NotBlank(message = "Section name is required")
    private String sectionName;

    private String topicName;

    @Min(value = 1, message = "Question count must be at least 1")
    private int questionCount;

    private String difficulty;

    private String difficultyTier;

    private String subLevel;

    private String language; // "Tamil", "English", "Both"

    private List<String> previousQuestionIds;
}
