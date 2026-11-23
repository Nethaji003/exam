package com.examprep.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StreakResponse {
    private String userId;
    private int currentStreak;
    private int longestStreak;
    private String lastActivityDate; // YYYY-MM-DD
    private boolean todayCompleted;
    private int totalActiveDays;
    private Long daysSinceLastActivity;
    private String statusMessage;
    private List<DailyProgressDTO> weekProgress;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class DailyProgressDTO {
        private String dayOfWeek; // Mon, Tue, etc.
        private String date; // YYYY-MM-DD
        private boolean completed;
        private boolean isToday;
    }
}
