package com.examprep.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AITutorRequest {

    @NotBlank(message = "Student ID is required")
    private String studentId;

    @NotBlank(message = "Section name is required")
    private String sectionName;

    private String topicName;
}
