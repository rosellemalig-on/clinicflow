package com.temptech.clinicflow.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.temptech.clinicflow.entity.Queue;

public interface QueueRepository extends JpaRepository<Queue, Integer> {
}
