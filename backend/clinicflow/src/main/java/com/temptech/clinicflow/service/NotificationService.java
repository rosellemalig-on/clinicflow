package com.temptech.clinicflow.service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.temptech.clinicflow.entity.Appointment;
import com.temptech.clinicflow.entity.Notification;
import com.temptech.clinicflow.entity.Patient;
import com.temptech.clinicflow.exception.NotFoundException;
import com.temptech.clinicflow.repository.NotificationRepository;

// ============================================================
// OWNER   : Lepon
// FEATURE : Notifications
// ============================================================

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public List<Map<String, Object>> getNotifications(Integer patientId) {
        List<Notification> list = patientId != null
                ? notificationRepository.findByPatient_PatientIdOrderByNotificationIdDesc(patientId)
                : notificationRepository.findAllByOrderByNotificationIdDesc();
        return list.stream().map(this::toDto).toList();
    }

    @Transactional
    public Notification createNotification(Patient patient, Appointment appointment, String type, String title, String message) {
        Notification n = new Notification();
        n.setPatient(patient);
        n.setAppointment(appointment);
        n.setType(type);
        n.setTitle(title);
        n.setMessage(message);
        n.setSentAt(LocalDateTime.now());
        n.setRead(false);
        return notificationRepository.save(n);
    }

    @Transactional
    public Map<String, Object> markRead(Integer notificationId) {
        Notification n = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new NotFoundException("Notification not found: " + notificationId));
        n.setRead(true);
        return toDto(notificationRepository.save(n));
    }

    @Transactional
    public void markAllRead(Integer patientId) {
        List<Notification> list = patientId != null
                ? notificationRepository.findByPatient_PatientIdOrderByNotificationIdDesc(patientId)
                : notificationRepository.findAll();
        for (Notification n : list) {
            if (!n.isRead()) {
                n.setRead(true);
            }
        }
        notificationRepository.saveAll(list);
    }

    public Map<String, Object> toDto(Notification n) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", String.valueOf(n.getNotificationId()));
        map.put("notificationId", n.getNotificationId());
        map.put("type", n.getType() != null ? n.getType() : "update");
        map.put("title", n.getTitle() != null ? n.getTitle() : "Clinic update");
        map.put("message", n.getMessage() != null ? n.getMessage() : "");
        map.put("time", formatRelativeTime(n.getSentAt()));
        map.put("read", n.isRead());
        return map;
    }

    private String formatRelativeTime(LocalDateTime sentAt) {
        if (sentAt == null) return "Just now";
        long mins = Duration.between(sentAt, LocalDateTime.now()).toMinutes();
        if (mins <= 1) return "Just now";
        if (mins < 60) return mins + " mins ago";
        long hours = mins / 60;
        if (hours < 24) return hours + (hours == 1 ? " hour ago" : " hours ago");
        long days = hours / 24;
        return days + (days == 1 ? " day ago" : " days ago");
    }
}
