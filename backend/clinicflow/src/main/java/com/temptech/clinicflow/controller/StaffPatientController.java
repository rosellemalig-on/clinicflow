package com.temptech.clinicflow.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.temptech.clinicflow.service.AuthService;

@RestController
@RequestMapping("/api/staff/patients")
public class StaffPatientController {

    private final AuthService authService;

    public StaffPatientController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping
    public List<Map<String, Object>> listClinicPatients() {
        return authService.getAllPatientsForStaff();
    }
}
