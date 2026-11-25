package com.temptech.clinicflow.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

// Owner: Padilla
@Entity
@Table(name = "doctor_services")
public class DoctorClinicService {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int doctorClinicServiceId;

    @ManyToOne
    @JoinColumn(name = "doctor_id")
    private Doctor doctor;

    @ManyToOne
    @JoinColumn(name = "service_id")
    private ClinicService service;

    public DoctorClinicService() {}

    public int getDoctorClinicServiceId() {
        return doctorClinicServiceId;
    }

    public void setDoctorClinicServiceId(int doctorClinicServiceId) {
        this.doctorClinicServiceId = doctorClinicServiceId;
    }

    public Doctor getDoctor() {
        return doctor;
    }

    public void setDoctor(Doctor doctor) {
        this.doctor = doctor;
    }

    public ClinicService getService() {
        return service;
    }

    public void setService(ClinicService service) {
        this.service = service;
    }
}
