package com.temptech.clinicflow.entity;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

// Owner: Padilla
@Entity
@Table(name = "services")
public class ClinicService {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer clinicServiceId;

    @Column(nullable = false)
    private String serviceName;

    private int duration;

    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal fee = BigDecimal.ZERO;

    @Column(name = "is_active", nullable = false)
    private boolean active = true;

    public ClinicService() {}

    public Integer getClinicServiceId() {
        return clinicServiceId;
    }

    public void setClinicServiceId(Integer clinicServiceId) {
        this.clinicServiceId = clinicServiceId;
    }

    public String getServiceName() {
        return serviceName;
    }

    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }

    public int getDuration() {
        return duration;
    }

    public void setDuration(int duration) {
        this.duration = duration;
    }

    public BigDecimal getFee() {
        return fee;
    }

    public void setFee(BigDecimal fee) {
        this.fee = fee;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}
