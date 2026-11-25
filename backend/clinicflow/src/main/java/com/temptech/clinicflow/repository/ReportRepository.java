package com.temptech.clinicflow.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.temptech.clinicflow.entity.Report;

public interface ReportRepository extends JpaRepository<Report, Integer> {
}
