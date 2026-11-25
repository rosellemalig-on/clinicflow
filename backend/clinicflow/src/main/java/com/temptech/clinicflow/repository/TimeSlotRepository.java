package com.temptech.clinicflow.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.temptech.clinicflow.entity.TimeSlot;

public interface TimeSlotRepository extends JpaRepository<TimeSlot, Integer> {
}
