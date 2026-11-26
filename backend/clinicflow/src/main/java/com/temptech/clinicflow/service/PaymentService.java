package com.temptech.clinicflow.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
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
    public Map<String, Object> confirmPayment(
            Integer appointmentId,
            String paymentMethod,
            String referenceNumber,
            String confirmedBy
    ) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new NotFoundException("Appointment not found: " + appointmentId));

        Payment payment = paymentRepository.findByAppointment_AppointmentId(appointmentId)
                .orElseGet(() -> {
                    Payment p = new Payment();
                    p.setAppointment(appointment);
                    p.setAmount(appointment.getResolvedService() != null ? appointment.getResolvedService().getFee() : null);
                    return p;
                });

        boolean isStaff = "staff".equalsIgnoreCase(confirmedBy);
        String method = (paymentMethod == null || paymentMethod.isBlank())
                ? (isStaff ? "Cash at Clinic" : "GCash")
                : paymentMethod.trim();
        boolean isCash = "Cash at Clinic".equalsIgnoreCase(method);
        String trimmedRef = referenceNumber != null ? referenceNumber.trim() : "";

        if (isStaff) {
            payment.setMethod(method);
            if (!trimmedRef.isEmpty()) {
                payment.setReferenceNumber(trimmedRef);
            } else if (payment.getReferenceNumber() == null || payment.getReferenceNumber().isBlank()) {
                String dateStamp = LocalDate.now().format(DateTimeFormatter.BASIC_ISO_DATE);
                payment.setReferenceNumber(String.format("CASH-%s-%03d", dateStamp, appointmentId));
            }
            payment.setStatus("Paid");
            payment.setPaidAt(LocalDateTime.now());
            payment = paymentRepository.save(payment);

            notificationService.createNotification(
                    appointment.getPatient(),
                    appointment,
                    "update",
                    "Payment verified & confirmed",
                    "Clinic staff verified your " + method + " payment (Ref: " + payment.getReferenceNumber()
                            + ") for appointment APT-" + (200 + appointmentId) + "."
            );
            return toDto(payment);
        }

        if (isCash) {
            payment.setMethod("Cash at Clinic");
            payment.setStatus("Pending");
            payment.setReferenceNumber(null);
            payment.setPaidAt(null);
            payment = paymentRepository.save(payment);

            notificationService.createNotification(
                    appointment.getPatient(),
                    appointment,
                    "update",
                    "Cash payment selected",
                    "Please settle your Cash at Clinic payment at the front desk for appointment APT-"
                            + (200 + appointmentId) + "."
            );
            return toDto(payment);
        }

        if (trimmedRef.length() < 4) {
            throw new IllegalArgumentException("Please enter a valid payment reference number (at least 4 characters).");
        }

        payment.setMethod(method);
        payment.setReferenceNumber(trimmedRef);
        payment.setStatus("For Verification");
        payment.setPaidAt(null);
        payment = paymentRepository.save(payment);

        notificationService.createNotification(
                appointment.getPatient(),
                appointment,
                "update",
                "Reference submitted for verification",
                "Your " + method + " reference (" + trimmedRef + ") for appointment APT-"
                        + (200 + appointmentId) + " is waiting for staff verification."
        );

        return toDto(payment);
    }

    public Map<String, Object> toDto(Payment p) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("paymentId", p.getPaymentId());
        map.put("appointmentId", p.getAppointment().getAppointmentId());
        map.put("amount", p.getAmount());
        map.put("method", p.getMethod() != null ? p.getMethod() : "Unselected");
        map.put("referenceNumber", p.getReferenceNumber() != null ? p.getReferenceNumber() : "");
        map.put("status", p.getStatus() != null ? p.getStatus() : "Pending");
        map.put("paidAt", p.getPaidAt() != null ? p.getPaidAt().toString() : null);
        return map;
    }
}
