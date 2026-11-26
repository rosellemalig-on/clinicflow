package com.temptech.clinicflow.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.temptech.clinicflow.service.QueueService;

@RestController
@RequestMapping("/api/patient/queue")
public class PatientQueueController {

    private final QueueService queueService;

    public PatientQueueController(QueueService queueService) {
        this.queueService = queueService;
    }

    @GetMapping
    public Map<String, Object> patientSnapshot(@RequestParam(required = false) Integer patientId) {
        return queueService.getQueueSnapshot(patientId);
    }
}
