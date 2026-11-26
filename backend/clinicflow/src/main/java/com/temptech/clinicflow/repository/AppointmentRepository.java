package com.temptech.clinicflow.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.temptech.clinicflow.entity.Appointment;

public interface AppointmentRepository extends JpaRepository<Appointment, Integer> {
    List<Appointment> findAllByOrderByAppointmentIdDesc();
    List<Appointment> findByPatient_PatientIdOrderByAppointmentIdDesc(Integer patientId);
}
