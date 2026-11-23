package com.examprep.service;

import com.examprep.dto.RecordActivityRequest;
import com.examprep.dto.StreakResponse;
import com.examprep.entity.UserStreak;
import com.examprep.entity.UserStreakActivity;
import com.examprep.repository.UserStreakActivityRepository;
import com.examprep.repository.UserStreakRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class StreakServiceTest {

    @Mock
    private UserStreakRepository streakRepository;

    @Mock
    private UserStreakActivityRepository activityRepository;

    @InjectMocks
    private StreakService streakService;

    private final String userId = "student-1";
    private LocalDate todayIST;

    @BeforeEach
    void setUp() {
        todayIST = LocalDate.now(StreakService.IST_ZONE);
    }

    @Test
    @DisplayName("Scenario 1: First completed activity creates a 1-day streak")
    void testFirstCompletedActivity() {
        when(streakRepository.findByUserId(userId)).thenReturn(Optional.empty());
        when(streakRepository.save(any(UserStreak.class))).thenAnswer(i -> i.getArgument(0));

        RecordActivityRequest request = RecordActivityRequest.builder()
                .userId(userId)
                .activityType("DAILY_CHALLENGE")
                .activityDetails("Completed Daily Challenge (20 Qs)")
                .build();

        StreakResponse response = streakService.recordActivity(request);

        assertNotNull(response);
        assertEquals(1, response.getCurrentStreak());
        assertEquals(1, response.getLongestStreak());
        assertTrue(response.isTodayCompleted());
        assertEquals(todayIST.toString(), response.getLastActivityDate());
        verify(streakRepository, times(1)).save(any(UserStreak.class));
        verify(activityRepository, times(1)).save(any(UserStreakActivity.class));
    }

    @Test
    @DisplayName("Scenario 2: Activity on consecutive day extends streak from 1 to 2")
    void testConsecutiveDayActivity() {
        LocalDate yesterdayIST = todayIST.minusDays(1);
        UserStreak existingStreak = UserStreak.builder()
                .userId(userId)
                .currentStreak(1)
                .longestStreak(1)
                .lastActivityDate(yesterdayIST)
                .lastActivityTimestamp(yesterdayIST.atTime(18, 0))
                .totalActiveDays(1)
                .build();

        when(streakRepository.findByUserId(userId)).thenReturn(Optional.of(existingStreak));
        when(streakRepository.save(any(UserStreak.class))).thenAnswer(i -> i.getArgument(0));

        RecordActivityRequest request = RecordActivityRequest.builder()
                .userId(userId)
                .activityType("MOCK_TEST")
                .activityDetails("Completed Mock Test")
                .build();

        StreakResponse response = streakService.recordActivity(request);

        assertEquals(2, response.getCurrentStreak());
        assertEquals(2, response.getLongestStreak());
        assertTrue(response.isTodayCompleted());
        assertEquals(todayIST.toString(), response.getLastActivityDate());
        assertEquals(2, response.getTotalActiveDays());
    }

    @Test
    @DisplayName("Scenario 3: Multiple activities on the same day do not increase streak")
    void testMultipleActivitiesSameDay() {
        UserStreak existingStreak = UserStreak.builder()
                .userId(userId)
                .currentStreak(3)
                .longestStreak(5)
                .lastActivityDate(todayIST) // Already completed earlier today
                .lastActivityTimestamp(LocalDateTime.now(StreakService.IST_ZONE).minusHours(2))
                .totalActiveDays(3)
                .build();

        when(streakRepository.findByUserId(userId)).thenReturn(Optional.of(existingStreak));
        when(streakRepository.save(any(UserStreak.class))).thenAnswer(i -> i.getArgument(0));

        RecordActivityRequest request = RecordActivityRequest.builder()
                .userId(userId)
                .activityType("PRACTICE")
                .activityDetails("Another test completed today")
                .build();

        StreakResponse response = streakService.recordActivity(request);

        // Streak MUST REMAIN 3, not increase to 4
        assertEquals(3, response.getCurrentStreak());
        assertEquals(5, response.getLongestStreak());
        assertTrue(response.isTodayCompleted());
        assertEquals(todayIST.toString(), response.getLastActivityDate());
    }

    @Test
    @DisplayName("Scenario 4: Missing a full day resets current streak to 0 on inspection and restarts at 1 on next activity")
    void testMissedDayStreakReset() {
        // Last activity was 3 days ago
        LocalDate threeDaysAgo = todayIST.minusDays(3);
        UserStreak existingStreak = UserStreak.builder()
                .userId(userId)
                .currentStreak(7)
                .longestStreak(7)
                .lastActivityDate(threeDaysAgo)
                .lastActivityTimestamp(threeDaysAgo.atTime(10, 0))
                .totalActiveDays(7)
                .build();

        when(streakRepository.findByUserId(userId)).thenReturn(Optional.of(existingStreak));
        when(streakRepository.save(any(UserStreak.class))).thenAnswer(i -> i.getArgument(0));

        // 1. Get streak before doing activity today: streak must be reset to 0
        StreakResponse statusResponse = streakService.getStreak(userId);
        assertEquals(0, statusResponse.getCurrentStreak());
        assertEquals(7, statusResponse.getLongestStreak()); // Longest streak preserved!
        assertFalse(statusResponse.isTodayCompleted());

        // 2. Now user completes an activity today: streak restarts at 1
        RecordActivityRequest request = RecordActivityRequest.builder()
                .userId(userId)
                .activityType("DAILY_CHALLENGE")
                .build();

        StreakResponse activeResponse = streakService.recordActivity(request);
        assertEquals(1, activeResponse.getCurrentStreak());
        assertEquals(7, activeResponse.getLongestStreak()); // Still preserved!
        assertTrue(activeResponse.isTodayCompleted());
        assertEquals(todayIST.toString(), activeResponse.getLastActivityDate());
    }

    @Test
    @DisplayName("Scenario 5: Browser refresh / repeated query preserves exact database streak state")
    void testQueryPreservesState() {
        UserStreak existingStreak = UserStreak.builder()
                .userId(userId)
                .currentStreak(4)
                .longestStreak(6)
                .lastActivityDate(todayIST)
                .lastActivityTimestamp(LocalDateTime.now(StreakService.IST_ZONE))
                .totalActiveDays(4)
                .build();

        when(streakRepository.findByUserId(userId)).thenReturn(Optional.of(existingStreak));

        StreakResponse response1 = streakService.getStreak(userId);
        StreakResponse response2 = streakService.getStreak(userId);

        assertEquals(4, response1.getCurrentStreak());
        assertEquals(4, response2.getCurrentStreak());
        assertEquals(6, response1.getLongestStreak());
        assertTrue(response1.isTodayCompleted());
        assertTrue(response2.isTodayCompleted());
    }
}
