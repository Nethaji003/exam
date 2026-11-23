package com.examprep.service;

import com.examprep.dto.RecordActivityRequest;
import com.examprep.dto.StreakResponse;
import com.examprep.entity.UserStreak;
import com.examprep.entity.UserStreakActivity;
import com.examprep.repository.UserStreakActivityRepository;
import com.examprep.repository.UserStreakRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.*;
import java.time.format.DateTimeFormatter;
import java.time.format.TextStyle;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
public class StreakService {

    private static final Logger log = LoggerFactory.getLogger(StreakService.class);

    // Asia/Kolkata timezone standard for Indian examination calculations
    public static final ZoneId IST_ZONE = ZoneId.of("Asia/Kolkata");
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    private final UserStreakRepository streakRepository;
    private final UserStreakActivityRepository activityRepository;

    public StreakService(UserStreakRepository streakRepository,
                         UserStreakActivityRepository activityRepository) {
        this.streakRepository = streakRepository;
        this.activityRepository = activityRepository;
    }

    /**
     * Get the current streak status for a user in Asia/Kolkata timezone.
     * Accurately checks if a calendar day was missed and resets current streak to 0 if broken.
     */
    @Transactional
    public StreakResponse getStreak(String userId) {
        String cleanUserId = (userId != null && !userId.isBlank()) ? userId.trim() : "student-1";
        LocalDate todayIST = LocalDate.now(IST_ZONE);

        UserStreak streak = streakRepository.findByUserId(cleanUserId)
                .orElseGet(() -> UserStreak.builder()
                        .userId(cleanUserId)
                        .currentStreak(0)
                        .longestStreak(0)
                        .totalActiveDays(0)
                        .build());

        LocalDate lastDate = streak.getLastActivityDate();
        boolean todayCompleted = false;
        Long daysSinceLast = null;

        if (lastDate != null) {
            daysSinceLast = ChronoUnit.DAYS.between(lastDate, todayIST);

            if (daysSinceLast == 0) {
                // Completed today!
                todayCompleted = true;
            } else if (daysSinceLast == 1) {
                // Completed yesterday - streak is intact and waiting for today's activity
                todayCompleted = false;
            } else if (daysSinceLast > 1) {
                // Missed at least one full calendar day - reset current streak to 0
                todayCompleted = false;
                if (streak.getCurrentStreak() > 0) {
                    streak.setCurrentStreak(0);
                    streakRepository.save(streak);
                    log.info("Streak reset to 0 for user {} due to missed days (last: {}, today: {})", cleanUserId, lastDate, todayIST);
                }
            }
        }

        return buildResponse(streak, todayCompleted, daysSinceLast, todayIST);
    }

    /**
     * Record a completed qualifying activity (Daily Challenge, Mock Test, etc.)
     * Idempotent per calendar day: does not increment multiple times on the same date.
     */
    @Transactional
    public StreakResponse recordActivity(RecordActivityRequest request) {
        String cleanUserId = (request.getUserId() != null && !request.getUserId().isBlank())
                ? request.getUserId().trim()
                : "student-1";
        LocalDate todayIST = LocalDate.now(IST_ZONE);
        LocalDateTime nowIST = LocalDateTime.now(IST_ZONE);

        UserStreak streak = streakRepository.findByUserId(cleanUserId)
                .orElseGet(() -> UserStreak.builder()
                        .userId(cleanUserId)
                        .currentStreak(0)
                        .longestStreak(0)
                        .totalActiveDays(0)
                        .build());

        LocalDate lastDate = streak.getLastActivityDate();
        boolean streakIncremented = false;

        if (lastDate == null) {
            // First ever activity!
            streak.setCurrentStreak(1);
            streak.setLongestStreak(Math.max(streak.getLongestStreak(), 1));
            streak.setLastActivityDate(todayIST);
            streak.setLastActivityTimestamp(nowIST);
            streak.setTotalActiveDays(1);
            streakIncremented = true;
        } else if (lastDate.equals(todayIST)) {
            // Already recorded an activity today: DO NOT INCREMENT STREAK AGAIN
            streak.setLastActivityTimestamp(nowIST);
            log.info("Multiple activities on same day ({}) for user {}. Streak unchanged: {}", todayIST, cleanUserId, streak.getCurrentStreak());
        } else if (lastDate.equals(todayIST.minusDays(1))) {
            // Consecutive calendar day! Extend streak by 1
            int newStreak = streak.getCurrentStreak() + 1;
            streak.setCurrentStreak(newStreak);
            streak.setLongestStreak(Math.max(streak.getLongestStreak(), newStreak));
            streak.setLastActivityDate(todayIST);
            streak.setLastActivityTimestamp(nowIST);
            streak.setTotalActiveDays(streak.getTotalActiveDays() + 1);
            streakIncremented = true;
            log.info("Consecutive day streak extended to {} for user {}", newStreak, cleanUserId);
        } else {
            // Missed one or more days: Restart streak at 1
            streak.setCurrentStreak(1);
            streak.setLongestStreak(Math.max(streak.getLongestStreak(), 1));
            streak.setLastActivityDate(todayIST);
            streak.setLastActivityTimestamp(nowIST);
            streak.setTotalActiveDays(streak.getTotalActiveDays() + 1);
            streakIncremented = true;
            log.info("Streak restarted at 1 for user {} after gap (previous: {}, now: {})", cleanUserId, lastDate, todayIST);
        }

        streakRepository.save(streak);

        // Record the individual activity entry
        UserStreakActivity activity = UserStreakActivity.builder()
                .userId(cleanUserId)
                .activityDate(todayIST)
                .activityType(request.getActivityType() != null ? request.getActivityType() : "TEST_COMPLETED")
                .activityDetails(request.getActivityDetails() != null ? request.getActivityDetails() : "Completed test")
                .build();
        activityRepository.save(activity);

        return buildResponse(streak, true, 0L, todayIST);
    }

    /**
     * Reset streak for a user (useful for testing or administration)
     */
    @Transactional
    public StreakResponse resetStreak(String userId) {
        String cleanUserId = (userId != null && !userId.isBlank()) ? userId.trim() : "student-1";
        LocalDate todayIST = LocalDate.now(IST_ZONE);

        UserStreak streak = streakRepository.findByUserId(cleanUserId)
                .orElseGet(() -> UserStreak.builder().userId(cleanUserId).build());

        streak.setCurrentStreak(0);
        streak.setLastActivityDate(null);
        streak.setLastActivityTimestamp(null);
        streakRepository.save(streak);

        return buildResponse(streak, false, null, todayIST);
    }

    private StreakResponse buildResponse(UserStreak streak, boolean todayCompleted, Long daysSinceLast, LocalDate todayIST) {
        // Calculate status message
        String statusMessage;
        if (todayCompleted) {
            statusMessage = "Streak Active! You've completed today's practice 🔥";
        } else if (daysSinceLast != null && daysSinceLast == 1) {
            statusMessage = String.format("Active streak! Complete a test today to extend to %d days 🔥", streak.getCurrentStreak() + 1);
        } else if (streak.getCurrentStreak() == 0) {
            statusMessage = "No active streak. Complete a test today to start your 1-day streak!";
        } else {
            statusMessage = "Streak active! Complete today's practice to keep your streak alive.";
        }

        // Build week progress (Monday to Sunday of current week in Asia/Kolkata)
        LocalDate monday = todayIST.with(DayOfWeek.MONDAY);
        LocalDate sunday = todayIST.with(DayOfWeek.SUNDAY);

        List<UserStreakActivity> weekActivities = activityRepository
                .findByUserIdAndActivityDateBetweenOrderByActivityDateAsc(streak.getUserId(), monday, sunday);

        Set<LocalDate> completedDates = new HashSet<>();
        for (UserStreakActivity act : weekActivities) {
            completedDates.add(act.getActivityDate());
        }

        List<StreakResponse.DailyProgressDTO> weekProgress = new ArrayList<>();
        for (int i = 0; i < 7; i++) {
            LocalDate date = monday.plusDays(i);
            String dayName = date.getDayOfWeek().getDisplayName(TextStyle.SHORT, Locale.ENGLISH);
            boolean isCompleted = completedDates.contains(date);
            boolean isToday = date.equals(todayIST);

            weekProgress.add(StreakResponse.DailyProgressDTO.builder()
                    .dayOfWeek(dayName)
                    .date(date.format(DATE_FORMATTER))
                    .completed(isCompleted)
                    .isToday(isToday)
                    .build());
        }

        return StreakResponse.builder()
                .userId(streak.getUserId())
                .currentStreak(streak.getCurrentStreak())
                .longestStreak(streak.getLongestStreak())
                .lastActivityDate(streak.getLastActivityDate() != null ? streak.getLastActivityDate().format(DATE_FORMATTER) : null)
                .todayCompleted(todayCompleted)
                .totalActiveDays(streak.getTotalActiveDays())
                .daysSinceLastActivity(daysSinceLast)
                .statusMessage(statusMessage)
                .weekProgress(weekProgress)
                .build();
    }
}
