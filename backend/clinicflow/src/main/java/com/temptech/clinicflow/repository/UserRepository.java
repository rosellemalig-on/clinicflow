package com.temptech.clinicflow.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.temptech.clinicflow.entity.User;

public interface UserRepository extends JpaRepository<User, Integer> {
}
