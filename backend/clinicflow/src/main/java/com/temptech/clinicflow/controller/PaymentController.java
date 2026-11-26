package com.temptech.clinicflow.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.temptech.clinicflow.service.PaymentService;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @GetMapping
    public List<Map<String, Object>> listAll() {
        return paymentService.getAllPayments();
    }

    @PostMapping("/{appointmentId}/confirm")
    public Map<String, Object> confirm(
            @PathVariable Integer appointmentId,
            @RequestBody(required = false) Map<String, String> body
    ) {
        String method = null;
        String referenceNumber = null;
        String confirmedBy = "patient";
        if (body != null) {
            method = body.containsKey("method") ? body.get("method") : body.get("paymentMethod");
            referenceNumber = body.get("referenceNumber");
            if (body.get("confirmedBy") != null && !body.get("confirmedBy").isBlank()) {
                confirmedBy = body.get("confirmedBy").trim();
            }
        }
        return paymentService.confirmPayment(appointmentId, method, referenceNumber, confirmedBy);
    }
}
