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
import org.springframework.web.bind.annotation.RestController;

import com.temptech.clinicflow.service.AuthService;

@RestController
@RequestMapping("/api/staff/accounts")
public class StaffAccountController {

    private final AuthService authService;

    public StaffAccountController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping
    public List<Map<String, Object>> listStaffAccounts() {
        return authService.getAllStaffAccounts();
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createStaffAccount(@RequestBody Map<String, String> payload) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.createStaffAccount(payload));
    }

    @PatchMapping("/{staffId}/status")
    public Map<String, Object> updateStaffStatus(
            @PathVariable Integer staffId,
            @RequestBody Map<String, Object> body
    ) {
        if (!body.containsKey("active") || body.get("active") == null) {
            throw new IllegalArgumentException("Account active status is required.");
        }
        boolean active = Boolean.parseBoolean(String.valueOf(body.get("active")));
        Integer actingUserId = parseIntOrNull(body.get("actingUserId"));
        return authService.updateStaffStatus(staffId, active, actingUserId);
    }

    private Integer parseIntOrNull(Object raw) {
        if (raw == null) return null;
        if (raw instanceof Number n) return n.intValue();
        String digits = String.valueOf(raw).replaceAll("[^0-9]", "");
        return digits.isEmpty() ? null : Integer.parseInt(digits);
    }
}
