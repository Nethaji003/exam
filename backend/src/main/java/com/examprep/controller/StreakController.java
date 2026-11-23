package com.examprep.controller;

import com.examprep.dto.RecordActivityRequest;
import com.examprep.dto.StreakResponse;
import com.examprep.service.StreakService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/streak")
@CrossOrigin(originPatterns = {"http://localhost:*", "http://127.0.0.1:*", "https://*.vercel.app"}, allowCredentials = "true")
public class StreakController {

    private final StreakService streakService;

    public StreakController(StreakService streakService) {
        this.streakService = streakService;
    }

    /**
     * 1. Get streak data for a user (Asia/Kolkata timezone calculated)
     */
    @GetMapping("/{userId}")
    public ResponseEntity<StreakResponse> getStreak(@PathVariable String userId) {
        return ResponseEntity.ok(streakService.getStreak(userId));
    }

    /**
     * 2. Record qualifying activity to continue or start streak
     */
    @PostMapping("/record-activity")
    public ResponseEntity<StreakResponse> recordActivity(@Valid @RequestBody RecordActivityRequest request) {
        return ResponseEntity.ok(streakService.recordActivity(request));
    }

    /**
     * 3. Reset streak (for testing and administrative reset)
     */
    @PostMapping("/reset/{userId}")
    public ResponseEntity<StreakResponse> resetStreak(@PathVariable String userId) {
        return ResponseEntity.ok(streakService.resetStreak(userId));
    }
}
