package com.temptech.clinicflow.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.temptech.clinicflow.entity.Notification;

public interface NotificationRepository extends JpaRepository<Notification, Integer> {
    List<Notification> findAllByOrderByNotificationIdDesc();
    List<Notification> findByPatient_PatientIdOrderByNotificationIdDesc(Integer patientId);
}
