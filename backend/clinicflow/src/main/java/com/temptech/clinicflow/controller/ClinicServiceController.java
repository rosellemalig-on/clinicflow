package com.temptech.clinicflow.controller;

import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.temptech.clinicflow.entity.ClinicService;
import com.temptech.clinicflow.exception.NotFoundException;
import com.temptech.clinicflow.repository.ClinicServiceRepository;

@RestController
@RequestMapping("/api/services")
public class ClinicServiceController {

    private final ClinicServiceRepository repository;

    public ClinicServiceController(ClinicServiceRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Map<String, Object>> listAll() {
        return repository.findAll().stream().map(this::toDto).toList();
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> create(@RequestBody Map<String, Object> body) {
        ClinicService entity = new ClinicService();
        applyFields(entity, body, true);
        ClinicService saved = repository.save(entity);
        return ResponseEntity.status(HttpStatus.CREATED).body(toDto(saved));
    }

    @PutMapping("/{id}")
    public Map<String, Object> update(@PathVariable Integer id, @RequestBody Map<String, Object> body) {
        ClinicService entity = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Service not found: " + id));
        applyFields(entity, body, false);
        return toDto(repository.save(entity));
    }

    private void applyFields(ClinicService target, Map<String, Object> body, boolean isCreate) {
        Object nameVal = body.containsKey("name") ? body.get("name") : body.get("serviceName");
        if (nameVal != null) {
            String trimmed = String.valueOf(nameVal).trim();
            if (trimmed.isEmpty()) {
                throw new IllegalArgumentException("Service name is required.");
            }
            target.setServiceName(trimmed);
        } else if (isCreate) {
            throw new IllegalArgumentException("Service name is required.");
        }

        if (body.containsKey("fee") && body.get("fee") != null) {
            target.setFee(new BigDecimal(String.valueOf(body.get("fee"))));
        }

        Object durVal = body.containsKey("durationMin") ? body.get("durationMin") : body.get("duration");
        if (durVal != null) {
            target.setDuration(Integer.parseInt(String.valueOf(durVal)));
        } else if (isCreate && target.getDuration() <= 0) {
            target.setDuration(30);
        }

        if (body.containsKey("active") && body.get("active") != null) {
            target.setActive(Boolean.parseBoolean(String.valueOf(body.get("active"))));
        }
    }

    private Map<String, Object> toDto(ClinicService s) {
        Map<String, Object> dto = new LinkedHashMap<>();
        dto.put("id", String.valueOf(s.getClinicServiceId()));
        dto.put("serviceId", s.getClinicServiceId());
        dto.put("name", s.getServiceName());
        dto.put("fee", s.getFee() != null ? s.getFee().doubleValue() : 0);
        dto.put("durationMin", s.getDuration());
        dto.put("active", s.isActive());
        return dto;
    }
}
