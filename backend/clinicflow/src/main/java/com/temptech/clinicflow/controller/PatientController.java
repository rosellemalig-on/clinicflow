package com.temptech.clinicflow.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.temptech.clinicflow.service.AuthService;

@RestController
@RequestMapping("/api/patients")
public class PatientController {

    private final AuthService authService;

    public PatientController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping("/profile")
    public Map<String, Object> fetchProfile(@RequestParam(required = false) Integer patientId) {
        return authService.getPatientProfile(patientId);
    }

    @PutMapping("/{patientId}")
    public Map<String, Object> saveProfile(
            @PathVariable Integer patientId,
            @RequestBody Map<String, String> updates
    ) {
        return authService.updatePatientProfile(patientId, updates);
    }
}
