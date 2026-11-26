package com.temptech.clinicflow.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.temptech.clinicflow.entity.User;

public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByEmailIgnoreCase(String email);
    boolean existsByEmailIgnoreCase(String email);
}
