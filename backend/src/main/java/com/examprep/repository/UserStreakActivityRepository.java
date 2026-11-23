package com.examprep.repository;

import com.examprep.entity.UserStreakActivity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface UserStreakActivityRepository extends JpaRepository<UserStreakActivity, Long> {
    List<UserStreakActivity> findByUserIdAndActivityDate(String userId, LocalDate activityDate);
    List<UserStreakActivity> findByUserIdAndActivityDateBetweenOrderByActivityDateAsc(String userId, LocalDate startDate, LocalDate endDate);
}
