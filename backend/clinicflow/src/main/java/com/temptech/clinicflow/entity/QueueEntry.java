package com.temptech.clinicflow.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

// Owner: Padilla
@Entity
@Table(name = "queue_entries")
public class QueueEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int queueEntryId;

    @ManyToOne
    @JoinColumn(name = "queue_id")
    private Queue queue;

    @ManyToOne
    @JoinColumn(name = "appointment_id")
    private Appointment appointment;

    private String queueNumber;

    private String status;

    private int estimatedWait;

    private LocalDateTime checkedInAt;

    public QueueEntry() {}

    public int getQueueEntryId() {
        return queueEntryId;
    }

    public void setQueueEntryId(int queueEntryId) {
        this.queueEntryId = queueEntryId;
    }

    public Queue getQueue() {
        return queue;
    }

    public void setQueue(Queue queue) {
        this.queue = queue;
    }

    public Appointment getAppointment() {
        return appointment;
    }

    public void setAppointment(Appointment appointment) {
        this.appointment = appointment;
    }

    public String getQueueNumber() {
        return queueNumber;
    }

    public void setQueueNumber(String queueNumber) {
        this.queueNumber = queueNumber;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public int getEstimatedWait() {
        return estimatedWait;
    }

    public void setEstimatedWait(int estimatedWait) {
        this.estimatedWait = estimatedWait;
    }

    public LocalDateTime getCheckedInAt() {
        return checkedInAt;
    }

    public void setCheckedInAt(LocalDateTime checkedInAt) {
        this.checkedInAt = checkedInAt;
    }
}
