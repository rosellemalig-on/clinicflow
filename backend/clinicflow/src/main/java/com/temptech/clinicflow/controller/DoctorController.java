package com.temptech.clinicflow.controller;

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

import com.temptech.clinicflow.entity.Doctor;
import com.temptech.clinicflow.exception.NotFoundException;
import com.temptech.clinicflow.repository.DoctorRepository;

@RestController
@RequestMapping("/api/doctors")
public class DoctorController {

    private final DoctorRepository repository;

    public DoctorController(DoctorRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Map<String, Object>> listAll() {
        return repository.findAll().stream().map(this::toDto).toList();
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> create(@RequestBody Map<String, Object> body) {
        Doctor entity = new Doctor();
        applyFields(entity, body, true);
        Doctor saved = repository.save(entity);
        return ResponseEntity.status(HttpStatus.CREATED).body(toDto(saved));
    }

    @PutMapping("/{id}")
    public Map<String, Object> update(@PathVariable Integer id, @RequestBody Map<String, Object> body) {
        Doctor entity = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Doctor not found: " + id));
        applyFields(entity, body, false);
        return toDto(repository.save(entity));
    }

    private void applyFields(Doctor target, Map<String, Object> body, boolean isCreate) {
        Object nameVal = body.containsKey("name") ? body.get("name") : body.get("doctorName");
        if (nameVal != null) {
            String trimmed = String.valueOf(nameVal).trim();
            if (trimmed.isEmpty()) {
                throw new IllegalArgumentException("Doctor name is required.");
            }
            target.setDoctorName(trimmed);
        } else if (isCreate) {
            throw new IllegalArgumentException("Doctor name is required.");
        }

        Object specVal = body.containsKey("specialty") ? body.get("specialty") : body.get("specialization");
        if (specVal != null) {
            target.setSpecialization(String.valueOf(specVal).trim());
        }
        if (body.containsKey("department") && body.get("department") != null) {
            target.setDepartment(String.valueOf(body.get("department")).trim());
        }
        if (body.containsKey("schedule") && body.get("schedule") != null) {
            target.setSchedule(String.valueOf(body.get("schedule")).trim());
        }
        if (body.containsKey("available") && body.get("available") != null) {
            target.setAvailable(Boolean.parseBoolean(String.valueOf(body.get("available"))));
        }
    }

    private Map<String, Object> toDto(Doctor d) {
        Map<String, Object> dto = new LinkedHashMap<>();
        dto.put("id", String.valueOf(d.getDoctorId()));
        dto.put("doctorId", d.getDoctorId());
        dto.put("name", d.getDoctorName());
        dto.put("specialty", d.getSpecialization() != null ? d.getSpecialization() : "");
        dto.put("department", d.getDepartment() != null ? d.getDepartment() : "");
        dto.put("schedule", d.getSchedule() != null ? d.getSchedule() : "");
        dto.put("available", d.isAvailable());
        return dto;
    }
}
