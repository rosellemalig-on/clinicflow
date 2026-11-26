package com.temptech.clinicflow.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.temptech.clinicflow.service.NotificationService;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    public List<Map<String, Object>> list(@RequestParam(required = false) Integer patientId) {
        return notificationService.getNotifications(patientId);
    }

    @PatchMapping("/{id}/read")
    public Map<String, Object> markRead(@PathVariable Integer id) {
        return notificationService.markRead(id);
    }

    @PatchMapping("/read-all")
    public Map<String, Object> markAllRead(@RequestParam(required = false) Integer patientId) {
        notificationService.markAllRead(patientId);
        return Map.of("ok", true);
    }
}
