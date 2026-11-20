package com.examprep.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ai_generated_questions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AIGeneratedQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String studentId;

    private String sectionName;

    private String topicName;

    private String difficultyLevel;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String questionText;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String questionTextEn;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String questionTextTa;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String optionsJson;

    private String correctAnswer;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String explanation;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String explanationEn;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String explanationTa;

    private String language;

    private String shortcut;

    private String concept;

    private Integer estimatedTimeSeconds;

    @Column(nullable = false)
    private String status;

    private String reviewedBy;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (status == null) {
            status = "PENDING";
        }
    }
}
