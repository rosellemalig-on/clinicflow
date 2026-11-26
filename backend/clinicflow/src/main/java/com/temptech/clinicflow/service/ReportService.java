package com.temptech.clinicflow.service;

import java.time.DayOfWeek;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.temptech.clinicflow.entity.Appointment;
import com.temptech.clinicflow.repository.AppointmentRepository;

// ============================================================
// OWNER   : Padilla
// FEATURE : Reports & Analytics
// ============================================================

@Service
public class ReportService {

    private final AppointmentRepository appointmentRepository;

    public ReportService(AppointmentRepository appointmentRepository) {
        this.appointmentRepository = appointmentRepository;
    }

    public Map<String, Object> getSummary() {
        List<Appointment> appointments = appointmentRepository.findAll();

        Map<DayOfWeek, String> labels = new LinkedHashMap<>();
        labels.put(DayOfWeek.MONDAY, "Mon");
        labels.put(DayOfWeek.TUESDAY, "Tue");
        labels.put(DayOfWeek.WEDNESDAY, "Wed");
        labels.put(DayOfWeek.THURSDAY, "Thu");
        labels.put(DayOfWeek.FRIDAY, "Fri");
        labels.put(DayOfWeek.SATURDAY, "Sat");

        Map<String, Integer> dayCounts = new LinkedHashMap<>();
        labels.values().forEach(day -> dayCounts.put(day, 0));

        Map<String, Integer> serviceCounts = new LinkedHashMap<>();
        for (Appointment apt : appointments) {
            if (apt.getSlot() != null && apt.getSlot().getSlotDate() != null) {
                String label = labels.get(apt.getSlot().getSlotDate().getDayOfWeek());
                if (label != null) {
                    dayCounts.put(label, dayCounts.get(label) + 1);
                }
            }
            if (apt.getResolvedService() != null) {
                String svcName = apt.getResolvedService().getServiceName();
                serviceCounts.put(svcName, serviceCounts.getOrDefault(svcName, 0) + 1);
            }
        }

        List<Map<String, Object>> dailyStats = new ArrayList<>();
        dayCounts.forEach((day, count) -> {
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("day", day);
            item.put("patients", count);
            dailyStats.add(item);
        });

        String topService = serviceCounts.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("General Consultation");

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("totalAppointments", appointments.size());
        result.put("mostRequestedService", topService);
        result.put("dailyStats", dailyStats);
        return result;
    }
}
