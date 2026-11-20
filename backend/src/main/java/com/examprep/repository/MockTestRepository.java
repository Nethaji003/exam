package com.examprep.repository;

import com.examprep.entity.MockTest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MockTestRepository extends JpaRepository<MockTest, String> {
    List<MockTest> findByExamGroup(String examGroup);
    List<MockTest> findByTestType(String testType);
    List<MockTest> findAllByOrderByCreatedAtDesc();
}

