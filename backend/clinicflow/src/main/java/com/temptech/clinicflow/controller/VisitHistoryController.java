package com.temptech.clinicflow.controller;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.temptech.clinicflow.entity.Appointment;
import com.temptech.clinicflow.entity.QueueEntry;
import com.temptech.clinicflow.entity.VisitHistory;
import com.temptech.clinicflow.repository.VisitHistoryRepository;

@RestController
@RequestMapping("/api/history")
public class VisitHistoryController {

    private final VisitHistoryRepository visitHistoryRepository;

    public VisitHistoryController(VisitHistoryRepository visitHistoryRepository) {
        this.visitHistoryRepository = visitHistoryRepository;
    }

    @GetMapping
    public List<Map<String, Object>> list(@RequestParam(required = false) Integer patientId) {
        List<VisitHistory> records = patientId != null
                ? visitHistoryRepository.findByPatient_PatientIdOrderByVisitHistoryIdDesc(patientId)
                : visitHistoryRepository.findAllByOrderByVisitHistoryIdDesc();
        return records.stream().map(this::toDto).toList();
    }

    private Map<String, Object> toDto(VisitHistory vh) {
        QueueEntry entry = vh.getQueueEntry();
        Appointment apt = entry != null ? entry.getAppointment() : null;

        Map<String, Object> dto = new LinkedHashMap<>();
        dto.put("id", "VH-" + (100 + vh.getVisitHistoryId()));
        dto.put("visitHistoryId", vh.getVisitHistoryId());
        dto.put("patientId", vh.getPatient().getPatientId());
        dto.put("patientName", vh.getPatient().getUser().getName());
        dto.put("visitDate", vh.getVisitDate() != null ? vh.getVisitDate().toString() : "");
        dto.put("outcome", vh.getOutcome() != null ? vh.getOutcome() : "Completed");
        dto.put("queueNumber", entry != null ? entry.getQueueNumber() : "—");
        dto.put("serviceName", apt != null && apt.getResolvedService() != null
                ? apt.getResolvedService().getServiceName() : "");
        dto.put("doctorName", apt != null && apt.getResolvedDoctor() != null
                ? apt.getResolvedDoctor().getDoctorName() : "");
        return dto;
    }
}
