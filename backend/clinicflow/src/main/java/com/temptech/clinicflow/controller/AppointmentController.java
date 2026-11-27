package com.temptech.clinicflow.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.temptech.clinicflow.service.AppointmentService;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @GetMapping
    public List<Map<String, Object>> list(@RequestParam(required = false) Integer patientId) {
        return appointmentService.getAppointments(patientId);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> book(@RequestBody Map<String, Object> body) {
        return ResponseEntity.status(HttpStatus.CREATED).body(appointmentService.bookAppointment(body));
    }

    @PatchMapping("/{id}/status")
    public Map<String, Object> changeStatus(@PathVariable Integer id, @RequestBody Map<String, String> body) {
        String status = body.get("status");
        if (status == null || status.isBlank()) {
            throw new IllegalArgumentException("Appointment status is required.");
        }
        return appointmentService.updateStatus(id, status.trim());
    }

    @PatchMapping("/{id}/cancel")
    public Map<String, Object> cancelByPatient(
            @PathVariable Integer id,
            @RequestBody(required = false) Map<String, Object> body
    ) {
        Integer patientId = null;
        if (body != null && body.get("patientId") != null) {
            String digits = String.valueOf(body.get("patientId")).replaceAll("[^0-9]", "");
            if (!digits.isEmpty()) {
                patientId = Integer.parseInt(digits);
            }
        }
        return appointmentService.cancelByPatient(id, patientId);
    }
}
