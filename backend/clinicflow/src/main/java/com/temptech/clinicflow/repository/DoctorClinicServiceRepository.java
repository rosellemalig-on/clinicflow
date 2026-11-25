package com.temptech.clinicflow.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.temptech.clinicflow.entity.DoctorClinicService;

public interface DoctorClinicServiceRepository extends JpaRepository<DoctorClinicService, Integer> {
}
