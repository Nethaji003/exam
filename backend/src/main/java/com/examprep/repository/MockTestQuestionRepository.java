package com.examprep.repository;

import com.examprep.entity.MockTestQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MockTestQuestionRepository extends JpaRepository<MockTestQuestion, Long> {
    List<MockTestQuestion> findByMockTestIdOrderByQuestionOrderAsc(String mockTestId);
    void deleteByMockTestId(String mockTestId);
}

