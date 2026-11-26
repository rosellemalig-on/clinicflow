package com.temptech.clinicflow.repository;

import java.time.LocalDate;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.temptech.clinicflow.entity.Queue;

public interface QueueRepository extends JpaRepository<Queue, Integer> {
    Optional<Queue> findByQueueDate(LocalDate queueDate);
    Optional<Queue> findTopByOrderByQueueIdDesc();
}
