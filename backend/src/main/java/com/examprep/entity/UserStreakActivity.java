package com.examprep.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_streak_activities", indexes = {
        @Index(name = "idx_user_activity_date", columnList = "user_id, activity_date")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserStreakActivity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false, length = 100)
    private String userId;

    @Column(name = "activity_date", nullable = false)
    private LocalDate activityDate;

    @Column(name = "activity_type", nullable = false, length = 50)
    private String activityType;

    @Column(name = "activity_details", length = 255)
    private String activityDetails;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) createdAt = LocalDateTime.now();
    }
}
