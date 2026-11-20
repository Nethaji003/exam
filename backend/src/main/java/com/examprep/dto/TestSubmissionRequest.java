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
public class TestSubmissionRequest {

    @NotBlank(message = "Student ID is required")
    private String studentId;

    private String testTitle;

    private String sectionName;

    private Long testId;

    private Integer timeTakenSeconds;

    @NotEmpty(message = "Answers are required")
    @Valid
    private List<AnswerSubmission> answers;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AnswerSubmission {
        private Long questionId;
        private String questionText;
        private String subjectName;
        private String topicName;
        private String userAnswer;
        private String correctAnswer;
        private boolean isCorrect;
        private Integer timeTakenSeconds;
    }
}
