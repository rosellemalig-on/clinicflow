package com.temptech.clinicflow.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.temptech.clinicflow.entity.Doctor;

public interface DoctorRepository extends JpaRepository<Doctor, Integer> {
}
