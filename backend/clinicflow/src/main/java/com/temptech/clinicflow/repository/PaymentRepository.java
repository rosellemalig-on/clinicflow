package com.temptech.clinicflow.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.temptech.clinicflow.entity.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Integer> {
}
