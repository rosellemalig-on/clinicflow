package com.temptech.clinicflow.service;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.temptech.clinicflow.entity.Appointment;
import com.temptech.clinicflow.entity.Payment;
import com.temptech.clinicflow.exception.NotFoundException;
import com.temptech.clinicflow.repository.AppointmentRepository;
import com.temptech.clinicflow.repository.PaymentRepository;

// ============================================================
// OWNER   : Malig-on
// FEATURE : Payments
// ============================================================

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final AppointmentRepository appointmentRepository;
    private final NotificationService notificationService;

    public PaymentService(
            PaymentRepository paymentRepository,
            AppointmentRepository appointmentRepository,
            NotificationService notificationService
    ) {
        this.paymentRepository = paymentRepository;
        this.appointmentRepository = appointmentRepository;
        this.notificationService = notificationService;
    }

    public List<Map<String, Object>> getAllPayments() {
        return paymentRepository.findAllByOrderByPaymentIdDesc().stream().map(this::toDto).toList();
    }

    @Transactional
    public Map<String, Object> confirmPayment(Integer appointmentId, String paymentMethod) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new NotFoundException("Appointment not found: " + appointmentId));

        Payment payment = paymentRepository.findByAppointment_AppointmentId(appointmentId)
                .orElseGet(() -> {
                    Payment p = new Payment();
                    p.setAppointment(appointment);
                    p.setAmount(appointment.getResolvedService() != null ? appointment.getResolvedService().getFee() : null);
                    return p;
                });

        String method = (paymentMethod == null || paymentMethod.isBlank()) ? "GCash" : paymentMethod.trim();
        payment.setMethod(method);
        payment.setStatus("Paid");
        payment.setPaidAt(LocalDateTime.now());
        payment = paymentRepository.save(payment);

        notificationService.createNotification(
                appointment.getPatient(),
                appointment,
                "update",
                "Payment confirmed",
                "Payment via " + method + " recorded for appointment APT-" + (200 + appointmentId) + "."
        );

        return toDto(payment);
    }

    public Map<String, Object> toDto(Payment p) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("paymentId", p.getPaymentId());
        map.put("appointmentId", p.getAppointment().getAppointmentId());
        map.put("amount", p.getAmount());
        map.put("method", p.getMethod() != null ? p.getMethod() : "Unselected");
        map.put("status", p.getStatus() != null ? p.getStatus() : "Pending");
        map.put("paidAt", p.getPaidAt() != null ? p.getPaidAt().toString() : null);
        return map;
    }
}
