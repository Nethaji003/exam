package com.examprep.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "mock_test_questions")
public class MockTestQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "mock_test_id", nullable = false)
    private String mockTestId;

    @Column(name = "question_id", nullable = false)
    private String questionId;

    @Column(name = "question_order")
    private Integer questionOrder = 1;

    public MockTestQuestion() {}

    public MockTestQuestion(String mockTestId, String questionId, Integer questionOrder) {
        this.mockTestId = mockTestId;
        this.questionId = questionId;
        this.questionOrder = questionOrder;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getMockTestId() { return mockTestId; }
    public void setMockTestId(String mockTestId) { this.mockTestId = mockTestId; }

    public String getQuestionId() { return questionId; }
    public void setQuestionId(String questionId) { this.questionId = questionId; }

    public Integer getQuestionOrder() { return questionOrder; }
    public void setQuestionOrder(Integer questionOrder) { this.questionOrder = questionOrder; }
}

