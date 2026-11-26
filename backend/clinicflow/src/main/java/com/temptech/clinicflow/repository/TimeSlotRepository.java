package com.temptech.clinicflow.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.temptech.clinicflow.entity.TimeSlot;

public interface TimeSlotRepository extends JpaRepository<TimeSlot, Integer> {
    List<TimeSlot> findBySlotDateOrderByStartTimeAsc(LocalDate slotDate);
}
