package com.examprep.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminQuestionReviewRequest {

    @NotBlank(message = "Status is required")
    private String status;

    private String reviewedBy;
}
