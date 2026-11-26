package com.temptech.clinicflow.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.temptech.clinicflow.entity.Staff;

public interface StaffRepository extends JpaRepository<Staff, Integer> {
    Optional<Staff> findByUser_UserId(Integer userId);
}
