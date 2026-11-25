package com.temptech.clinicflow.entity;

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
    private int clinicServiceId;

    private String serviceName;

    private int duration;

    private double fee;

    public ClinicService() {}

    public int getClinicServiceId() {
        return clinicServiceId;
    }

    public void setClinicServiceId(int clinicServiceId) {
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

    public double getFee() {
        return fee;
    }

    public void setFee(double fee) {
        this.fee = fee;
    }
}
