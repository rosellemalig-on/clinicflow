package com.temptech.clinicflow.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.temptech.clinicflow.entity.QueueEntry;

public interface QueueEntryRepository extends JpaRepository<QueueEntry, Integer> {
    List<QueueEntry> findByQueue_QueueIdOrderByQueueEntryIdAsc(Integer queueId);
    Optional<QueueEntry> findByAppointment_AppointmentId(Integer appointmentId);
    List<QueueEntry> findAllByOrderByQueueEntryIdAsc();
}
