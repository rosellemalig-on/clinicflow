package com.temptech.clinicflow.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.temptech.clinicflow.entity.Notification;

public interface NotificationRepository extends JpaRepository<Notification, Integer> {
}
