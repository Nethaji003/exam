package com.examprep.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecordActivityRequest {
    @NotBlank(message = "User ID is required")
    private String userId;

    @NotBlank(message = "Activity type is required")
    private String activityType; // 'DAILY_CHALLENGE', 'MOCK_TEST', 'PRACTICE', 'PYQ_PAPER'

    private String activityDetails;
}
