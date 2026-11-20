package com.examprep.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "mock_tests")
public class MockTest {

    @Id
    private String id;

    @Column(nullable = false)
    private String title;

    @Column(name = "exam_group", nullable = false)
    private String examGroup;

    @Column
    private String subject;

    @Column
    private String topic;

    @Column(name = "total_questions", nullable = false)
    private Integer totalQuestions = 20;

    @Column(name = "test_type", nullable = false)
    private String testType; // PYQ, AI_GENERATED, MIXED

    @Column(name = "pyq_percentage")
    private Integer pyqPercentage = 100;

    @Column(name = "duration_minutes")
    private Integer durationMinutes = 60;

    @Column(name = "total_marks")
    private Double totalMarks = 100.0;

    @Column(name = "negative_marking")
    private Double negativeMarking = 0.0;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Transient
    private List<Question> questions = new ArrayList<>();

    public MockTest() {}

    public MockTest(String id, String title, String examGroup, String subject, String topic, Integer totalQuestions, String testType, Integer pyqPercentage, Integer durationMinutes, Double totalMarks, Double negativeMarking) {
        this.id = id;
        this.title = title;
        this.examGroup = examGroup;
        this.subject = subject;
        this.topic = topic;
        this.totalQuestions = totalQuestions;
        this.testType = testType;
        this.pyqPercentage = pyqPercentage;
        this.durationMinutes = durationMinutes;
        this.totalMarks = totalMarks;
        this.negativeMarking = negativeMarking;
        this.createdAt = LocalDateTime.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getExamGroup() { return examGroup; }
    public void setExamGroup(String examGroup) { this.examGroup = examGroup; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getTopic() { return topic; }
    public void setTopic(String topic) { this.topic = topic; }

    public Integer getTotalQuestions() { return totalQuestions; }
    public void setTotalQuestions(Integer totalQuestions) { this.totalQuestions = totalQuestions; }

    public String getTestType() { return testType; }
    public void setTestType(String testType) { this.testType = testType; }

    public Integer getPyqPercentage() { return pyqPercentage; }
    public void setPyqPercentage(Integer pyqPercentage) { this.pyqPercentage = pyqPercentage; }

    public Integer getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }

    public Double getTotalMarks() { return totalMarks; }
    public void setTotalMarks(Double totalMarks) { this.totalMarks = totalMarks; }

    public Double getNegativeMarking() { return negativeMarking; }
    public void setNegativeMarking(Double negativeMarking) { this.negativeMarking = negativeMarking; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public List<Question> getQuestions() { return questions; }
    public void setQuestions(List<Question> questions) { this.questions = questions; }
}

