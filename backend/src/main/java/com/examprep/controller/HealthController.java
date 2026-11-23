package com.examprep.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
public class HealthController {

    @GetMapping({"/", "/api/health"})
    public ResponseEntity<Map<String, Object>> healthCheck() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "service", "ExamPrep AI Backend",
                "timestamp", LocalDateTime.now().toString(),
                "endpoints", Map.of(
                        "generateMockTest", "/api/ai/generate-mock-test",
                        "analyzeTest", "/api/ai/analyze-test",
                        "weakSections", "/api/ai/weak-sections/{studentId}",
                        "tutor", "/api/ai/tutor/improve-section"
                )
        ));
    }
}
