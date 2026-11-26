package com.temptech.clinicflow.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.temptech.clinicflow.service.AuthService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> registerAccount(@RequestBody Map<String, String> payload) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(payload));
    }

    @PostMapping("/register-staff")
    public ResponseEntity<Map<String, Object>> registerStaffAccount(@RequestBody Map<String, String> payload) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.registerStaff(payload));
    }

    @PostMapping("/login")
    public Map<String, Object> loginAccount(@RequestBody Map<String, String> payload) {
        return authService.login(payload);
    }
}
