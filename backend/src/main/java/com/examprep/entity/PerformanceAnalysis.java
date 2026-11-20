package com.examprep.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "performance_analyses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PerformanceAnalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String studentId;

    private String testAttemptId;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String analysisJson;

    private Double overallAccuracy;

    private Integer totalQuestions;

    private Integer correctCount;

    private Integer wrongCount;

    private Integer skippedCount;

    @Column(columnDefinition = "TEXT")
    private String repeatedMistakeTopics;

    @Column(columnDefinition = "TEXT")
    private String strongConcepts;

    @Column(columnDefinition = "TEXT")
    private String weakConcepts;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
