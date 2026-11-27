package com.temptech.clinicflow.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.temptech.clinicflow.entity.Appointment;
import com.temptech.clinicflow.entity.ClinicService;
import com.temptech.clinicflow.entity.Doctor;
import com.temptech.clinicflow.entity.Patient;
import com.temptech.clinicflow.entity.Payment;
import com.temptech.clinicflow.entity.Queue;
import com.temptech.clinicflow.entity.QueueEntry;
import com.temptech.clinicflow.entity.Staff;
import com.temptech.clinicflow.entity.TimeSlot;
import com.temptech.clinicflow.exception.NotFoundException;
import com.temptech.clinicflow.exception.SlotFullException;
import com.temptech.clinicflow.repository.AppointmentRepository;
import com.temptech.clinicflow.repository.ClinicServiceRepository;
import com.temptech.clinicflow.repository.DoctorRepository;
import com.temptech.clinicflow.repository.PaymentRepository;
import com.temptech.clinicflow.repository.QueueEntryRepository;
import com.temptech.clinicflow.repository.QueueRepository;
import com.temptech.clinicflow.repository.StaffRepository;
import com.temptech.clinicflow.repository.TimeSlotRepository;

// ============================================================
// OWNER   : Malig-on
// FEATURE : Book Appointment & Time Slots
// ============================================================

@Service
public class AppointmentService {

    private static final DateTimeFormatter TIME_FMT = DateTimeFormatter.ofPattern("hh:mm a", Locale.ENGLISH);

    private final TimeSlotRepository timeSlotRepository;
    private final AppointmentRepository appointmentRepository;
    private final ClinicServiceRepository serviceRepository;
    private final DoctorRepository doctorRepository;
    private final PaymentRepository paymentRepository;
    private final QueueRepository queueRepository;
    private final QueueEntryRepository queueEntryRepository;
    private final StaffRepository staffRepository;
    private final AuthService authService;
    private final NotificationService notificationService;

    public AppointmentService(
            TimeSlotRepository timeSlotRepository,
            AppointmentRepository appointmentRepository,
            ClinicServiceRepository serviceRepository,
            DoctorRepository doctorRepository,
            PaymentRepository paymentRepository,
            QueueRepository queueRepository,
            QueueEntryRepository queueEntryRepository,
            StaffRepository staffRepository,
            AuthService authService,
            NotificationService notificationService
    ) {
        this.timeSlotRepository = timeSlotRepository;
        this.appointmentRepository = appointmentRepository;
        this.serviceRepository = serviceRepository;
        this.doctorRepository = doctorRepository;
        this.paymentRepository = paymentRepository;
        this.queueRepository = queueRepository;
        this.queueEntryRepository = queueEntryRepository;
        this.staffRepository = staffRepository;
        this.authService = authService;
        this.notificationService = notificationService;
    }

    @Transactional
    public List<Map<String, Object>> getSlotsForDate(LocalDate date) {
        List<TimeSlot> slots = timeSlotRepository.findBySlotDateOrderByStartTimeAsc(date);
        if (slots.isEmpty()) {
            Doctor defaultDoc = doctorRepository.findAll().stream().filter(Doctor::isAvailable).findFirst()
                    .orElseGet(() -> doctorRepository.findAll().stream().findFirst()
                            .orElseThrow(() -> new NotFoundException("No doctors configured.")));
            ClinicService defaultSvc = serviceRepository.findAll().stream().filter(ClinicService::isActive).findFirst()
                    .orElseGet(() -> serviceRepository.findAll().stream().findFirst()
                            .orElseThrow(() -> new NotFoundException("No services configured.")));

            List<LocalTime> defaultTimes = List.of(
                    LocalTime.of(9, 0),
                    LocalTime.of(11, 0),
                    LocalTime.of(14, 0),
                    LocalTime.of(15, 30)
            );
            for (LocalTime t : defaultTimes) {
                TimeSlot slot = new TimeSlot();
                slot.setDoctor(defaultDoc);
                slot.setService(defaultSvc);
                slot.setSlotDate(date);
                slot.setStartTime(t);
                slot.setCapacity(2);
                slot.setBookedCount(0);
                slot.setStatus("Available");
                timeSlotRepository.save(slot);
            }
            slots = timeSlotRepository.findBySlotDateOrderByStartTimeAsc(date);
        }
        return slots.stream().map(this::toSlotDto).toList();
    }

    @Transactional
    public Map<String, Object> bookAppointment(Map<String, Object> req) {
        Integer patientId = toInt(req.get("patientId"));
        Integer serviceId = toInt(req.get("serviceId"));
        Integer doctorId = toInt(req.get("doctorId"));
        Integer slotId = toInt(req.get("slotId"));

        Patient patient = authService.resolvePatient(patientId);
        ClinicService service = serviceRepository.findById(serviceId)
                .filter(ClinicService::isActive)
                .orElseThrow(() -> new IllegalArgumentException("Please select an active service."));

        TimeSlot slot = timeSlotRepository.findById(slotId)
                .orElseThrow(() -> new NotFoundException("Time slot not found: " + slotId));

        if (slot.getSlotDate() != null && slot.getSlotDate().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException(
                    "Appointments cannot be booked on dates that have already passed."
            );
        }

        if (slot.getBookedCount() >= slot.getCapacity()) {
            throw new SlotFullException("This time slot is already full. Please choose another available slot.");
        }

        Doctor selectedDoctor = slot.getDoctor();
        if (doctorId != null) {
            selectedDoctor = doctorRepository.findById(doctorId)
                    .orElseThrow(() -> new NotFoundException("Doctor not found: " + doctorId));
        } else if (req.get("doctorName") != null) {
            String docName = String.valueOf(req.get("doctorName"));
            selectedDoctor = doctorRepository.findAll().stream()
                    .filter(d -> d.getDoctorName().equalsIgnoreCase(docName))
                    .findFirst()
                    .orElse(selectedDoctor);
        }

        slot.setBookedCount(slot.getBookedCount() + 1);
        slot.setStatus(slot.getBookedCount() >= slot.getCapacity() ? "Full" : "Available");
        slot = timeSlotRepository.save(slot);

        Staff defaultStaff = staffRepository.findAll().stream().findFirst().orElse(null);

        Appointment apt = new Appointment();
        apt.setPatient(patient);
        apt.setSlot(slot);
        apt.setService(service);
        apt.setDoctor(selectedDoctor);
        apt.setApprovedBy(defaultStaff);
        apt.setStatus("Confirmed");
        apt = appointmentRepository.save(apt);

        Payment payment = new Payment();
        payment.setAppointment(apt);
        payment.setAmount(service.getFee());
        payment.setMethod("Unselected");
        payment.setStatus("Pending");
        paymentRepository.save(payment);

        LocalDate queueDate = slot.getSlotDate() != null ? slot.getSlotDate() : LocalDate.now();
        Queue queue = queueRepository.findTopByOrderByQueueIdDesc().orElseGet(() -> {
            Queue q = new Queue();
            q.setStaff(defaultStaff);
            q.setQueueDate(queueDate);
            q.setNowServing(1);
            return queueRepository.save(q);
        });

        int nextNumber = queueEntryRepository.findAllByOrderByQueueEntryIdAsc().size() + 1;
        String queueCode = String.format("Q-%03d", nextNumber);

        QueueEntry entry = new QueueEntry();
        entry.setQueue(queue);
        entry.setAppointment(apt);
        entry.setQueueNumber(queueCode);
        entry.setStatus("Waiting");
        entry.setEstimatedWait(Math.max(0, nextNumber - queue.getNowServing()) * 5);
        entry.setCheckedInAt(LocalDateTime.now());
        queueEntryRepository.save(entry);

        String formattedTime = slot.getStartTime() != null ? slot.getStartTime().format(TIME_FMT) : "09:00 AM";
        notificationService.createNotification(
                patient,
                apt,
                "update",
                "New appointment booked",
                service.getServiceName() + " on " + slot.getSlotDate() + " at " + formattedTime
                        + " (Queue " + queueCode + "). Payment is pending."
        );

        return toAppointmentDto(apt);
    }

    public List<Map<String, Object>> getAppointments(Integer patientId) {
        List<Appointment> list = patientId != null
                ? appointmentRepository.findByPatient_PatientIdOrderByAppointmentIdDesc(patientId)
                : appointmentRepository.findAllByOrderByAppointmentIdDesc();
        return list.stream().map(this::toAppointmentDto).toList();
    }

    @Transactional
    public Map<String, Object> updateStatus(Integer appointmentId, String status) {
        Appointment apt = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new NotFoundException("Appointment not found: " + appointmentId));
        boolean wasCancelled = "Cancelled".equalsIgnoreCase(apt.getStatus());
        apt.setStatus(status);
        apt = appointmentRepository.save(apt);

        if ("Cancelled".equalsIgnoreCase(status) && !wasCancelled) {
            releaseSlotAndCancelQueue(apt);
        }

        return toAppointmentDto(apt);
    }

    @Transactional
    public Map<String, Object> cancelByPatient(Integer appointmentId, Integer patientId) {
        Appointment apt = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new NotFoundException("Appointment not found: " + appointmentId));

        if (patientId != null && apt.getPatient() != null
                && !patientId.equals(apt.getPatient().getPatientId())) {
            throw new IllegalArgumentException("You can only cancel your own appointments.");
        }

        if ("Cancelled".equalsIgnoreCase(apt.getStatus())) {
            throw new IllegalArgumentException("This appointment is already cancelled.");
        }

        if ("Completed".equalsIgnoreCase(apt.getStatus())) {
            throw new IllegalArgumentException("Completed appointments cannot be cancelled.");
        }

        QueueEntry entry = queueEntryRepository.findByAppointment_AppointmentId(apt.getAppointmentId()).orElse(null);
        if (entry != null && ("Serving".equalsIgnoreCase(entry.getStatus())
                || "Completed".equalsIgnoreCase(entry.getStatus()))) {
            throw new IllegalArgumentException("Appointments already being served or completed cannot be cancelled.");
        }

        TimeSlot slot = apt.getSlot();
        if (slot != null && slot.getSlotDate() != null && slot.getStartTime() != null) {
            LocalDateTime scheduledAt = LocalDateTime.of(slot.getSlotDate(), slot.getStartTime());
            LocalDateTime cutoff = scheduledAt.minusMinutes(20);
            if (!LocalDateTime.now().isBefore(cutoff)) {
                throw new IllegalArgumentException(
                        "Appointments cannot be cancelled within 20 minutes of the scheduled time."
                );
            }
        }

        apt.setStatus("Cancelled");
        apt = appointmentRepository.save(apt);
        releaseSlotAndCancelQueue(apt);

        ClinicService svc = apt.getResolvedService();
        String serviceName = svc != null ? svc.getServiceName() : "Appointment";
        String dateLabel = slot != null && slot.getSlotDate() != null ? slot.getSlotDate().toString() : "";
        String timeLabel = slot != null && slot.getStartTime() != null ? slot.getStartTime().format(TIME_FMT) : "";
        notificationService.createNotification(
                apt.getPatient(),
                apt,
                "update",
                "Appointment cancelled",
                serviceName + (dateLabel.isEmpty() ? "" : " on " + dateLabel)
                        + (timeLabel.isEmpty() ? "" : " at " + timeLabel)
                        + " has been cancelled."
        );

        return toAppointmentDto(apt);
    }

    private void releaseSlotAndCancelQueue(Appointment apt) {
        TimeSlot slot = apt.getSlot();
        if (slot != null && slot.getBookedCount() > 0) {
            slot.setBookedCount(slot.getBookedCount() - 1);
            slot.setStatus(slot.getBookedCount() >= slot.getCapacity() ? "Full" : "Available");
            timeSlotRepository.save(slot);
        }

        queueEntryRepository.findByAppointment_AppointmentId(apt.getAppointmentId()).ifPresent(entry -> {
            if (!"Completed".equalsIgnoreCase(entry.getStatus())) {
                entry.setStatus("Cancelled");
                queueEntryRepository.save(entry);
            }
        });
    }

    public Map<String, Object> toSlotDto(TimeSlot slot) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", String.valueOf(slot.getTimeSlotId()));
        map.put("slotId", slot.getTimeSlotId());
        map.put("date", slot.getSlotDate() != null ? slot.getSlotDate().toString() : "");
        map.put("time", slot.getStartTime() != null ? slot.getStartTime().format(TIME_FMT) : "");
        map.put("capacity", slot.getCapacity());
        map.put("booked", slot.getBookedCount());
        map.put("status", slot.getStatus());
        return map;
    }

    public Map<String, Object> toAppointmentDto(Appointment apt) {
        TimeSlot slot = apt.getSlot();
        ClinicService svc = apt.getResolvedService();
        Doctor doc = apt.getResolvedDoctor();
        Payment payment = paymentRepository.findByAppointment_AppointmentId(apt.getAppointmentId()).orElse(null);
        QueueEntry entry = queueEntryRepository.findByAppointment_AppointmentId(apt.getAppointmentId()).orElse(null);

        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", "APT-" + (200 + apt.getAppointmentId()));
        map.put("appointmentId", apt.getAppointmentId());
        map.put("patientId", apt.getPatient().getPatientId());
        map.put("patientName", apt.getPatient().getUser().getName());
        map.put("serviceId", svc != null ? String.valueOf(svc.getClinicServiceId()) : "");
        map.put("serviceName", svc != null ? svc.getServiceName() : "");
        map.put("doctorName", doc != null ? doc.getDoctorName() : "");
        map.put("date", slot != null && slot.getSlotDate() != null ? slot.getSlotDate().toString() : "");
        map.put("time", slot != null && slot.getStartTime() != null ? slot.getStartTime().format(TIME_FMT) : "");
        map.put("scheduledAt",
                slot != null && slot.getSlotDate() != null && slot.getStartTime() != null
                        ? LocalDateTime.of(slot.getSlotDate(), slot.getStartTime()).toString()
                        : "");
        map.put("fee", svc != null && svc.getFee() != null ? svc.getFee().doubleValue() : 0);
        map.put("queueNumber", entry != null ? entry.getQueueNumber() : "—");
        map.put("status", apt.getStatus() != null ? apt.getStatus() : "Confirmed");
        map.put("paymentStatus", payment != null ? payment.getStatus() : "Pending");
        map.put("paymentMethod", payment != null ? payment.getMethod() : "Unselected");
        map.put("paymentReference", payment != null && payment.getReferenceNumber() != null ? payment.getReferenceNumber() : "");
        return map;
    }

    private Integer toInt(Object val) {
        if (val == null) return null;
        if (val instanceof Number n) return n.intValue();
        String s = String.valueOf(val).replaceAll("[^0-9]", "");
        return s.isEmpty() ? null : Integer.parseInt(s);
    }
}
