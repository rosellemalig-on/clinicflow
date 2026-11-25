package com.temptech.clinicflow.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.temptech.clinicflow.entity.ClinicService;

public interface ClinicServiceRepository extends JpaRepository<ClinicService, Integer> {
}
