package com.examprep.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "weak_sections")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WeakSection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String studentId;

    @Column(nullable = false)
    private String sectionName;

    private String topicName;

    private Double accuracy;

    @Column(nullable = false)
    private String weaknessLevel;

    private Integer totalQuestions;

    private Integer correctAnswers;

    private Integer wrongAnswers;

    @Column(columnDefinition = "TEXT")
    private String recommendations;

    private LocalDateTime detectedAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        detectedAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
