package com.temptech.clinicflow.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.temptech.clinicflow.service.AppointmentService;

@RestController
@RequestMapping("/api/slots")
public class TimeSlotController {

    private final AppointmentService appointmentService;

    public TimeSlotController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @GetMapping
    public List<Map<String, Object>> getSlots(@RequestParam(required = false) String date) {
        LocalDate target = (date == null || date.isBlank()) ? LocalDate.now() : LocalDate.parse(date.trim());
        return appointmentService.getSlotsForDate(target);
    }
}
