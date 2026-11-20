package com.examprep.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TestPerformanceRequest {

    @NotBlank(message = "Student ID is required")
    private String studentId;

    private String testTitle;

    private String testType;

    @NotEmpty(message = "Question results are required")
    @Valid
    private List<QuestionResult> questionResults;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class QuestionResult {
        private String questionText;

        @NotBlank(message = "Subject name is required")
        private String subjectName;

        private String topicName;

        private String userAnswer;

        @NotBlank(message = "Correct answer is required")
        private String correctAnswer;

        private boolean isCorrect;

        private Integer timeTakenSeconds;
    }
}
