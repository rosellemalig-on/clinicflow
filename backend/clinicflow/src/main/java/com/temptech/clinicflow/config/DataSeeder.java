package com.temptech.clinicflow.config;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.temptech.clinicflow.entity.Appointment;
import com.temptech.clinicflow.entity.ClinicService;
import com.temptech.clinicflow.entity.Doctor;
import com.temptech.clinicflow.entity.Notification;
import com.temptech.clinicflow.entity.Patient;
import com.temptech.clinicflow.entity.Payment;
import com.temptech.clinicflow.entity.Queue;
import com.temptech.clinicflow.entity.QueueEntry;
import com.temptech.clinicflow.entity.Staff;
import com.temptech.clinicflow.entity.TimeSlot;
import com.temptech.clinicflow.entity.User;
import com.temptech.clinicflow.entity.VisitHistory;
import com.temptech.clinicflow.repository.AppointmentRepository;
import com.temptech.clinicflow.repository.ClinicServiceRepository;
import com.temptech.clinicflow.repository.DoctorRepository;
import com.temptech.clinicflow.repository.NotificationRepository;
import com.temptech.clinicflow.repository.PatientRepository;
import com.temptech.clinicflow.repository.PaymentRepository;
import com.temptech.clinicflow.repository.QueueEntryRepository;
import com.temptech.clinicflow.repository.QueueRepository;
import com.temptech.clinicflow.repository.StaffRepository;
import com.temptech.clinicflow.repository.TimeSlotRepository;
import com.temptech.clinicflow.repository.UserRepository;
import com.temptech.clinicflow.repository.VisitHistoryRepository;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PatientRepository patientRepository;
    private final StaffRepository staffRepository;
    private final ClinicServiceRepository serviceRepository;
    private final DoctorRepository doctorRepository;
    private final TimeSlotRepository timeSlotRepository;
    private final AppointmentRepository appointmentRepository;
    private final PaymentRepository paymentRepository;
    private final QueueRepository queueRepository;
    private final QueueEntryRepository queueEntryRepository;
    private final NotificationRepository notificationRepository;
    private final VisitHistoryRepository visitHistoryRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(
            UserRepository userRepository,
            PatientRepository patientRepository,
            StaffRepository staffRepository,
            ClinicServiceRepository serviceRepository,
            DoctorRepository doctorRepository,
            TimeSlotRepository timeSlotRepository,
            AppointmentRepository appointmentRepository,
            PaymentRepository paymentRepository,
            QueueRepository queueRepository,
            QueueEntryRepository queueEntryRepository,
            NotificationRepository notificationRepository,
            VisitHistoryRepository visitHistoryRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.patientRepository = patientRepository;
        this.staffRepository = staffRepository;
        this.serviceRepository = serviceRepository;
        this.doctorRepository = doctorRepository;
        this.timeSlotRepository = timeSlotRepository;
        this.appointmentRepository = appointmentRepository;
        this.paymentRepository = paymentRepository;
        this.queueRepository = queueRepository;
        this.queueEntryRepository = queueEntryRepository;
        this.notificationRepository = notificationRepository;
        this.visitHistoryRepository = visitHistoryRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        boolean isFreshDatabase = userRepository.count() == 0;

        // Always ensure realistic staff accounts exist even on an already-seeded database
        Staff primaryStaff = ensureStaffAccount(
                "ClinicFlow Demo Staff",
                "staff@clinicflow.test",
                "+63 900 000 0201",
                "ClinicFlowDemo!2026"
        );
        ensureStaffAccount(
                "Elena Reyes",
                "admin@clinicflow.ph",
                "+63 917 555 0210",
                "AdminStaff!2026"
        );
        ensureStaffAccount(
                "Miguel Torres",
                "frontdesk@clinicflow.ph",
                "+63 917 555 0211",
                "FrontDesk!2026"
        );
        ensureStaffAccount(
                "Clarisse Navarro",
                "nurse@clinicflow.ph",
                "+63 917 555 0212",
                "ClinicNurse!2026"
        );

        if (!isFreshDatabase) {
            return;
        }

        Staff staff = primaryStaff;

        // 2. Seed primary Patient account
        Patient kaina = createPatient(
                "Kaina Padilla",
                "patient@clinicflow.test",
                "+63 917 555 0142",
                "PatientDemo!2026",
                LocalDate.of(1998, 4, 14),
                "Female",
                "O+",
                "Lahug, Cebu City",
                "Penicillin",
                "Marco Padilla (+63 917 555 0199)",
                "Annual checkup patient; mild seasonal allergies."
        );

        // Additional sample patients for a realistic live queue
        Patient liam = createPatient("Liam Cruz", "liam.cruz@example.com", "+63 917 555 0101", "PatientDemo!2026", LocalDate.of(1995, 2, 10), "Male", "A+", "Cebu City", "None", "", "");
        Patient sofia = createPatient("Sofia Tan", "sofia.tan@example.com", "+63 917 555 0102", "PatientDemo!2026", LocalDate.of(1999, 7, 22), "Female", "B+", "Mandaue City", "None", "", "");
        Patient noah = createPatient("Noah Mendoza", "noah.mendoza@example.com", "+63 917 555 0103", "PatientDemo!2026", LocalDate.of(1992, 11, 5), "Male", "O+", "Cebu City", "None", "", "");

        // 3. Seed Services
        ClinicService general = createService("General Consultation", 20, new BigDecimal("500.00"));
        ClinicService lab = createService("Basic Laboratory Screening", 30, new BigDecimal("1200.00"));
        ClinicService dental = createService("Dental Checkup & Cleaning", 40, new BigDecimal("950.00"));
        createService("Follow-up Visit", 15, new BigDecimal("350.00"));

        // 4. Seed Doctors
        Doctor drSantos = createDoctor("Dr. Maria Santos, MD", "Internal Medicine", "General Medicine", "Mon–Fri, 8:00 AM – 4:00 PM");
        Doctor drReyes = createDoctor("Dr. Jose Reyes, DMD", "General Dentistry", "Dental", "Tue–Sat, 9:00 AM – 5:00 PM");
        Doctor drLim = createDoctor("Dr. Clara Lim, MD", "Family & Diagnostic Medicine", "Diagnostics", "Mon–Sat, 8:00 AM – 3:00 PM");

        // 5. Seed Time Slots for 2026-11-26 and 2026-11-27
        LocalDate day1 = LocalDate.of(2026, 11, 26);
        LocalDate day2 = LocalDate.of(2026, 11, 27);

        TimeSlot s1 = createSlot(drSantos, general, day1, LocalTime.of(9, 0), 2, 2);
        TimeSlot s2 = createSlot(drSantos, general, day1, LocalTime.of(10, 0), 2, 1);
        createSlot(drSantos, general, day1, LocalTime.of(11, 0), 2, 0);
        createSlot(drLim, lab, day1, LocalTime.of(14, 0), 2, 2);
        createSlot(drReyes, dental, day1, LocalTime.of(15, 0), 2, 0);

        createSlot(drSantos, general, day2, LocalTime.of(9, 0), 2, 0);
        createSlot(drLim, lab, day2, LocalTime.of(10, 30), 2, 1);
        createSlot(drReyes, dental, day2, LocalTime.of(13, 30), 2, 0);
        createSlot(drSantos, general, day2, LocalTime.of(15, 30), 2, 0);

        // 6. Seed Sample Appointments & Payments
        Appointment aptLiam = createAppointment(liam, s1, staff, "Confirmed");
        Appointment aptSofia = createAppointment(sofia, createSlot(drLim, lab, day1, LocalTime.of(9, 30), 2, 1), staff, "Confirmed");
        Appointment aptNoah = createAppointment(noah, s1, staff, "Confirmed");
        Appointment aptKaina = createAppointment(kaina, s2, staff, "Confirmed");

        TimeSlot pastSlot1 = createSlot(drLim, lab, LocalDate.of(2026, 11, 12), LocalTime.of(9, 0), 2, 1);
        Appointment pastKaina1 = createAppointment(kaina, pastSlot1, staff, "Completed");

        TimeSlot pastSlot2 = createSlot(drReyes, dental, LocalDate.of(2026, 10, 28), LocalTime.of(14, 0), 2, 1);
        Appointment pastKaina2 = createAppointment(kaina, pastSlot2, staff, "Completed");

        createPayment(aptKaina, general.getFee(), "GCash", "Paid");
        createPayment(pastKaina1, lab.getFee(), "Cash at Clinic", "Paid");
        createPayment(pastKaina2, dental.getFee(), "Card", "Paid");
        createPayment(aptLiam, general.getFee(), "GCash", "Paid");
        createPayment(aptSofia, lab.getFee(), "Maya", "Paid");
        createPayment(aptNoah, general.getFee(), "Cash at Clinic", "Pending");

        // 7. Seed Daily Queue & Queue Entries
        Queue queue = new Queue();
        queue.setStaff(staff);
        queue.setQueueDate(day1);
        queue.setNowServing(1);
        queue = queueRepository.save(queue);

        createQueueEntry(queue, aptLiam, "Q-001", "Serving", 0);
        createQueueEntry(queue, aptSofia, "Q-002", "Waiting", 5);
        createQueueEntry(queue, aptNoah, "Q-003", "Waiting", 10);
        QueueEntry kainaEntry = createQueueEntry(queue, aptKaina, "Q-004", "Waiting", 15);

        // 8. Seed Visit History for completed visits
        VisitHistory vh = new VisitHistory();
        vh.setPatient(kaina);
        vh.setQueueEntry(kainaEntry);
        vh.setVisitDate(LocalDate.of(2026, 11, 12));
        vh.setOutcome("Completed - Basic Laboratory Screening");
        visitHistoryRepository.save(vh);

        // 9. Seed Notifications for Kaina
        createNotification(kaina, aptKaina, "approaching", "Your turn is approaching",
                "Now serving Q-001. Your number Q-004 is only 3 patients away (~15 min wait).", false);
        createNotification(kaina, aptKaina, "next", "Next-in-line alert preview",
                "When Now Serving reaches Q-003, you will be marked Next in Line.", false);
        createNotification(kaina, aptKaina, "update", "Appointment & payment confirmed",
                "General Consultation with Dr. Maria Santos, MD on 2026-11-26 at 10:00 AM is confirmed.", true);
    }

    private Staff ensureStaffAccount(String name, String email, String phone, String rawPassword) {
        User existing = userRepository.findByEmailIgnoreCase(email).orElse(null);
        if (existing != null) {
            return staffRepository.findByUser_UserId(existing.getUserId()).orElseGet(() -> {
                Staff s = new Staff();
                s.setUser(existing);
                return staffRepository.save(s);
            });
        }

        User u = new User();
        u.setName(name);
        u.setEmail(email);
        u.setContactNumber(phone);
        u.setPassword(passwordEncoder.encode(rawPassword));
        u.setRole("staff");
        u.setActive(true);
        u = userRepository.save(u);

        Staff s = new Staff();
        s.setUser(u);
        return staffRepository.save(s);
    }

    private Patient createPatient(
            String name, String email, String phone, String rawPassword,
            LocalDate dob, String gender, String bloodType, String address,
            String allergies, String emergencyContact, String notes
    ) {
        User u = new User();
        u.setName(name);
        u.setEmail(email);
        u.setContactNumber(phone);
        u.setPassword(passwordEncoder.encode(rawPassword));
        u.setRole("patient");
        u.setActive(true);
        u = userRepository.save(u);

        Patient p = new Patient();
        p.setUser(u);
        p.setDateOfBirth(dob);
        p.setGender(gender);
        p.setBloodType(bloodType);
        p.setAddress(address);
        p.setAllergies(allergies);
        p.setEmergencyContact(emergencyContact);
        p.setMedicalNotes(notes);
        return patientRepository.save(p);
    }

    private ClinicService createService(String name, int duration, BigDecimal fee) {
        ClinicService s = new ClinicService();
        s.setServiceName(name);
        s.setDuration(duration);
        s.setFee(fee);
        s.setActive(true);
        return serviceRepository.save(s);
    }

    private Doctor createDoctor(String name, String specialty, String dept, String schedule) {
        Doctor d = new Doctor();
        d.setDoctorName(name);
        d.setSpecialization(specialty);
        d.setDepartment(dept);
        d.setSchedule(schedule);
        d.setAvailable(true);
        return doctorRepository.save(d);
    }

    private TimeSlot createSlot(Doctor doctor, ClinicService service, LocalDate date, LocalTime time, int capacity, int booked) {
        TimeSlot slot = new TimeSlot();
        slot.setDoctor(doctor);
        slot.setService(service);
        slot.setSlotDate(date);
        slot.setStartTime(time);
        slot.setCapacity(capacity);
        slot.setBookedCount(booked);
        slot.setStatus(booked >= capacity ? "Full" : "Available");
        return timeSlotRepository.save(slot);
    }

    private Appointment createAppointment(Patient patient, TimeSlot slot, Staff staff, String status) {
        Appointment a = new Appointment();
        a.setPatient(patient);
        a.setSlot(slot);
        a.setService(slot.getService());
        a.setDoctor(slot.getDoctor());
        a.setApprovedBy(staff);
        a.setStatus(status);
        return appointmentRepository.save(a);
    }

    private void createPayment(Appointment apt, BigDecimal amount, String method, String status) {
        Payment p = new Payment();
        p.setAppointment(apt);
        p.setAmount(amount);
        p.setMethod(method);
        p.setStatus(status);
        if ("Paid".equals(status)) {
            p.setPaidAt(LocalDateTime.now());
        }
        paymentRepository.save(p);
    }

    private QueueEntry createQueueEntry(Queue queue, Appointment apt, String code, String status, int wait) {
        QueueEntry e = new QueueEntry();
        e.setQueue(queue);
        e.setAppointment(apt);
        e.setQueueNumber(code);
        e.setStatus(status);
        e.setEstimatedWait(wait);
        e.setCheckedInAt(LocalDateTime.now());
        return queueEntryRepository.save(e);
    }

    private void createNotification(Patient patient, Appointment apt, String type, String title, String msg, boolean read) {
        Notification n = new Notification();
        n.setPatient(patient);
        n.setAppointment(apt);
        n.setType(type);
        n.setTitle(title);
        n.setMessage(msg);
        n.setSentAt(LocalDateTime.now());
        n.setRead(read);
        notificationRepository.save(n);
    }
}
