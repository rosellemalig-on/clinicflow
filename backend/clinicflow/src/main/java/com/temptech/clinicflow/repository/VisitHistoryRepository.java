package com.temptech.clinicflow.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.temptech.clinicflow.entity.VisitHistory;

public interface VisitHistoryRepository extends JpaRepository<VisitHistory, Integer> {
}
