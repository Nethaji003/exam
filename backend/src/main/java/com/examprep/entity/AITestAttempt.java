package com.examprep.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ai_test_attempts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AITestAttempt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String studentId;

    private String testTitle;

    private String sectionName;

    private Integer totalQuestions;

    private Integer correctCount;

    private Integer wrongCount;

    private Integer skippedCount;

    private Double score;

    private Double maxScore;

    private Double accuracyPercentage;

    private Integer timeTakenSeconds;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String questionsJson;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String answersJson;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
