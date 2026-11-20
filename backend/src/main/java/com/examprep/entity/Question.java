package com.examprep.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "questions")
public class Question {

    @Id
    private String id;

    @Column(name = "question_text", columnDefinition = "LONGTEXT", nullable = false)
    private String questionText;

    @Column(name = "question_text_ta", columnDefinition = "LONGTEXT")
    private String questionTextTa;

    @Column(name = "option_a", columnDefinition = "TEXT", nullable = false)
    private String optionA;

    @Column(name = "option_a_ta", columnDefinition = "TEXT")
    private String optionATa;

    @Column(name = "option_b", columnDefinition = "TEXT", nullable = false)
    private String optionB;

    @Column(name = "option_b_ta", columnDefinition = "TEXT")
    private String optionBTa;

    @Column(name = "option_c", columnDefinition = "TEXT", nullable = false)
    private String optionC;

    @Column(name = "option_c_ta", columnDefinition = "TEXT")
    private String optionCTa;

    @Column(name = "option_d", columnDefinition = "TEXT", nullable = false)
    private String optionD;

    @Column(name = "option_d_ta", columnDefinition = "TEXT")
    private String optionDTa;

    @Column(name = "correct_answer", length = 10, nullable = false)
    private String correctAnswer;

    @Column(name = "explanation", columnDefinition = "LONGTEXT")
    private String explanation;

    @Column(name = "explanation_ta", columnDefinition = "LONGTEXT")
    private String explanationTa;

    @Column(name = "subject", nullable = false)
    private String subject;

    @Column(name = "topic", nullable = false)
    private String topic;

    @Column(name = "exam_group", nullable = false)
    private String examGroup; // Group 2, Group 4, Banking, etc.

    @Column(name = "exam_year")
    private Integer examYear;

    @Column(name = "language")
    private String language = "Bilingual"; // Tamil, English, Bilingual

    @Column(name = "question_source")
    private String questionSource = "PREVIOUS_YEAR"; // PREVIOUS_YEAR, AI_GENERATED

    @Column(name = "pdf_id")
    private String pdfId;

    @Column(name = "pdf_page_number")
    private Integer pdfPageNumber;

    @Column(name = "question_number")
    private Integer questionNumber;

    @Column(name = "verification_status")
    private String verificationStatus = "VERIFIED"; // VERIFIED, PENDING_VERIFICATION, REJECTED

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public Question() {}

    public Question(String id, String questionText, String questionTextTa, String optionA, String optionB, String optionC, String optionD, String correctAnswer, String explanation, String explanationTa, String subject, String topic, String examGroup, Integer examYear, String language, String questionSource, String pdfId, Integer pdfPageNumber, Integer questionNumber, String verificationStatus) {
        this.id = id;
        this.questionText = questionText;
        this.questionTextTa = questionTextTa;
        this.optionA = optionA;
        this.optionB = optionB;
        this.optionC = optionC;
        this.optionD = optionD;
        this.correctAnswer = correctAnswer;
        this.explanation = explanation;
        this.explanationTa = explanationTa;
        this.subject = subject;
        this.topic = topic;
        this.examGroup = examGroup;
        this.examYear = examYear;
        this.language = language;
        this.questionSource = questionSource;
        this.pdfId = pdfId;
        this.pdfPageNumber = pdfPageNumber;
        this.questionNumber = questionNumber;
        this.verificationStatus = verificationStatus;
        this.createdAt = LocalDateTime.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getQuestionText() { return questionText; }
    public void setQuestionText(String questionText) { this.questionText = questionText; }

    public String getQuestionTextTa() { return questionTextTa; }
    public void setQuestionTextTa(String questionTextTa) { this.questionTextTa = questionTextTa; }

    public String getOptionA() { return optionA; }
    public void setOptionA(String optionA) { this.optionA = optionA; }

    public String getOptionATa() { return optionATa; }
    public void setOptionATa(String optionATa) { this.optionATa = optionATa; }

    public String getOptionB() { return optionB; }
    public void setOptionB(String optionB) { this.optionB = optionB; }

    public String getOptionBTa() { return optionBTa; }
    public void setOptionBTa(String optionBTa) { this.optionBTa = optionBTa; }

    public String getOptionC() { return optionC; }
    public void setOptionC(String optionC) { this.optionC = optionC; }

    public String getOptionCTa() { return optionCTa; }
    public void setOptionCTa(String optionCTa) { this.optionCTa = optionCTa; }

    public String getOptionD() { return optionD; }
    public void setOptionD(String optionD) { this.optionD = optionD; }

    public String getOptionDTa() { return optionDTa; }
    public void setOptionDTa(String optionDTa) { this.optionDTa = optionDTa; }

    public String getCorrectAnswer() { return correctAnswer; }
    public void setCorrectAnswer(String correctAnswer) { this.correctAnswer = correctAnswer; }

    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }

    public String getExplanationTa() { return explanationTa; }
    public void setExplanationTa(String explanationTa) { this.explanationTa = explanationTa; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getTopic() { return topic; }
    public void setTopic(String topic) { this.topic = topic; }

    public String getExamGroup() { return examGroup; }
    public void setExamGroup(String examGroup) { this.examGroup = examGroup; }

    public Integer getExamYear() { return examYear; }
    public void setExamYear(Integer examYear) { this.examYear = examYear; }

    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }

    public String getQuestionSource() { return questionSource; }
    public void setQuestionSource(String questionSource) { this.questionSource = questionSource; }

    public String getPdfId() { return pdfId; }
    public void setPdfId(String pdfId) { this.pdfId = pdfId; }

    public Integer getPdfPageNumber() { return pdfPageNumber; }
    public void setPdfPageNumber(Integer pdfPageNumber) { this.pdfPageNumber = pdfPageNumber; }

    public Integer getQuestionNumber() { return questionNumber; }
    public void setQuestionNumber(Integer questionNumber) { this.questionNumber = questionNumber; }

    public String getVerificationStatus() { return verificationStatus; }
    public void setVerificationStatus(String verificationStatus) { this.verificationStatus = verificationStatus; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

