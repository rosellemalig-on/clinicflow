package com.temptech.clinicflow.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.temptech.clinicflow.service.QueueService;

@RestController
@RequestMapping("/api/queue")
public class QueueController {

    private final QueueService queueService;

    public QueueController(QueueService queueService) {
        this.queueService = queueService;
    }

    @GetMapping
    public Map<String, Object> snapshot(@RequestParam(required = false) Integer patientId) {
        return queueService.getQueueSnapshot(patientId);
    }

    @PostMapping("/action")
    public Map<String, Object> handleAction(@RequestBody Map<String, Object> body) {
        Object actionVal = body.get("action");
        if (actionVal == null || String.valueOf(actionVal).isBlank()) {
            throw new IllegalArgumentException("Queue action is required.");
        }
        String action = String.valueOf(actionVal).trim();
        Integer entryId = parseIntOrNull(body.containsKey("entryId") ? body.get("entryId") : body.get("queueEntryId"));
        Integer patientId = parseIntOrNull(body.get("patientId"));
        return queueService.performAction(action, entryId, patientId);
    }

    private Integer parseIntOrNull(Object raw) {
        if (raw == null) return null;
        if (raw instanceof Number n) return n.intValue();
        String digits = String.valueOf(raw).replaceAll("[^0-9]", "");
        return digits.isEmpty() ? null : Integer.parseInt(digits);
    }
}
