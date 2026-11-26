package com.temptech.clinicflow.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.temptech.clinicflow.entity.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Integer> {
    Optional<Payment> findByAppointment_AppointmentId(Integer appointmentId);
    List<Payment> findAllByOrderByPaymentIdDesc();
}
