package com.temptech.clinicflow.entity;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

// Owner: Padilla
@Entity
@Table(name = "queues")
public class Queue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer queueId;

    @ManyToOne
    @JoinColumn(name = "staff_id")
    private Staff staff;

    @Column(unique = true, nullable = false)
    private LocalDate queueDate;

    private int nowServing;

    public Queue() {}

    public Integer getQueueId() {
        return queueId;
    }

    public void setQueueId(Integer queueId) {
        this.queueId = queueId;
    }

    public Staff getStaff() {
        return staff;
    }

    public void setStaff(Staff staff) {
        this.staff = staff;
    }

    public LocalDate getQueueDate() {
        return queueDate;
    }

    public void setQueueDate(LocalDate queueDate) {
        this.queueDate = queueDate;
    }

    public int getNowServing() {
        return nowServing;
    }

    public void setNowServing(int nowServing) {
        this.nowServing = nowServing;
    }
}
