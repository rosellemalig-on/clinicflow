package com.temptech.clinicflow.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.temptech.clinicflow.entity.Appointment;

public interface AppointmentRepository extends JpaRepository<Appointment, Integer> {
}
