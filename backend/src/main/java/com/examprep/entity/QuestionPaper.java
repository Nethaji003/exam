package com.examprep.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "question_papers")
public class QuestionPaper {

    @Id
    private String id;

    @Column(name = "exam_group", nullable = false)
    private String examGroup; // Group 2, Group 4

    @Column(name = "exam_year", nullable = false)
    private Integer examYear;

    @Column(name = "exam_type", nullable = false)
    private String examType; // Prelims, Mains, Objective

    @Column(name = "language", nullable = false)
    private String language; // Tamil, English, Bilingual

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "total_questions")
    private Integer totalQuestions = 200;

    @Column(name = "duration_minutes")
    private Integer durationMinutes = 180;

    @Column(name = "total_marks")
    private Integer totalMarks = 300;

    @Column(name = "pdf_file_path", nullable = false)
    private String pdfFilePath;

    @Column(name = "file_size_bytes")
    private Long fileSizeBytes = 0L;

    @Column(name = "publication_status")
    private String publicationStatus = "Ready";

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public QuestionPaper() {}

    public QuestionPaper(String id, String examGroup, Integer examYear, String examType, String language, String title, Integer totalQuestions, Integer durationMinutes, Integer totalMarks, String pdfFilePath, String publicationStatus) {
        this.id = id;
        this.examGroup = examGroup;
        this.examYear = examYear;
        this.examType = examType;
        this.language = language;
        this.title = title;
        this.totalQuestions = totalQuestions;
        this.durationMinutes = durationMinutes;
        this.totalMarks = totalMarks;
        this.pdfFilePath = pdfFilePath;
        this.publicationStatus = publicationStatus;
        this.createdAt = LocalDateTime.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getExamGroup() { return examGroup; }
    public void setExamGroup(String examGroup) { this.examGroup = examGroup; }

    public Integer getExamYear() { return examYear; }
    public void setExamYear(Integer examYear) { this.examYear = examYear; }

    public String getExamType() { return examType; }
    public void setExamType(String examType) { this.examType = examType; }

    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public Integer getTotalQuestions() { return totalQuestions; }
    public void setTotalQuestions(Integer totalQuestions) { this.totalQuestions = totalQuestions; }

    public Integer getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }

    public Integer getTotalMarks() { return totalMarks; }
    public void setTotalMarks(Integer totalMarks) { this.totalMarks = totalMarks; }

    public String getPdfFilePath() { return pdfFilePath; }
    public void setPdfFilePath(String pdfFilePath) { this.pdfFilePath = pdfFilePath; }

    public Long getFileSizeBytes() { return fileSizeBytes; }
    public void setFileSizeBytes(Long fileSizeBytes) { this.fileSizeBytes = fileSizeBytes; }

    public String getPublicationStatus() { return publicationStatus; }
    public void setPublicationStatus(String publicationStatus) { this.publicationStatus = publicationStatus; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

