package com.temptech.clinicflow.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.temptech.clinicflow.entity.QueueEntry;

public interface QueueEntryRepository extends JpaRepository<QueueEntry, Integer> {
}
