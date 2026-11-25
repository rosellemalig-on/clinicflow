package com.temptech.clinicflow.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.temptech.clinicflow.entity.Staff;

public interface StaffRepository extends JpaRepository<Staff, Integer> {
}
