package com.temptech.clinicflow.service;

import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.temptech.clinicflow.entity.Appointment;
import com.temptech.clinicflow.entity.Patient;
import com.temptech.clinicflow.entity.QueueEntry;
import com.temptech.clinicflow.entity.Staff;
import com.temptech.clinicflow.entity.User;
import com.temptech.clinicflow.exception.NotFoundException;
import com.temptech.clinicflow.repository.AppointmentRepository;
import com.temptech.clinicflow.repository.PatientRepository;
import com.temptech.clinicflow.repository.QueueEntryRepository;
import com.temptech.clinicflow.repository.StaffRepository;
import com.temptech.clinicflow.repository.UserRepository;

// ============================================================
// OWNER   : Malig-on
// FEATURE : Auth & Patient Profile
// ============================================================

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PatientRepository patientRepository;
    private final StaffRepository staffRepository;
    private final AppointmentRepository appointmentRepository;
    private final QueueEntryRepository queueEntryRepository;
    private final PasswordEncoder passwordEncoder;
    private final String staffAccessCode;

    public AuthService(
            UserRepository userRepository,
            PatientRepository patientRepository,
            StaffRepository staffRepository,
            AppointmentRepository appointmentRepository,
            QueueEntryRepository queueEntryRepository,
            PasswordEncoder passwordEncoder,
            @Value("${clinicflow.staff.access-code:CLINICFLOW-STAFF-2026}") String staffAccessCode
    ) {
        this.userRepository = userRepository;
        this.patientRepository = patientRepository;
        this.staffRepository = staffRepository;
        this.appointmentRepository = appointmentRepository;
        this.queueEntryRepository = queueEntryRepository;
        this.passwordEncoder = passwordEncoder;
        this.staffAccessCode = staffAccessCode;
    }

    @Transactional
    public Map<String, Object> register(Map<String, String> req) {
        String name = req.getOrDefault("name", "").trim();
        String email = req.getOrDefault("email", "").trim().toLowerCase();
        String contactNumber = req.getOrDefault("contactNumber", "").trim();
        String password = req.getOrDefault("password", "");

        if (name.isEmpty() || email.isEmpty() || password.length() < 8) {
            throw new IllegalArgumentException("Name, valid email, and a password of at least 8 characters are required.");
        }
        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new IllegalArgumentException("An account with this email already exists.");
        }

        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setContactNumber(contactNumber);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole("patient");
        user.setActive(true);
        user = userRepository.save(user);

        Patient patient = new Patient();
        patient.setUser(user);
        patient.setBloodType("Unknown");
        patient = patientRepository.save(patient);

        return toAuthDto(user, patient, null);
    }

    @Transactional
    public Map<String, Object> registerStaff(Map<String, String> req) {
        String accessCode = req.getOrDefault("accessCode", "").trim();
        if (accessCode.isEmpty() || !accessCode.equals(staffAccessCode)) {
            throw new IllegalArgumentException("Invalid clinic staff access code.");
        }
        Staff staff = createStaffInternal(req);
        return toAuthDto(staff.getUser(), null, staff);
    }

    public List<Map<String, Object>> getAllStaffAccounts() {
        return staffRepository.findAll().stream()
                .map(this::toStaffDto)
                .toList();
    }

    @Transactional
    public Map<String, Object> createStaffAccount(Map<String, String> req) {
        Staff staff = createStaffInternal(req);
        return toStaffDto(staff);
    }

    @Transactional
    public Map<String, Object> updateStaffStatus(Integer staffId, boolean active, Integer actingUserId) {
        Staff staff = staffRepository.findById(staffId)
                .orElseThrow(() -> new NotFoundException("Staff account not found: " + staffId));
        User user = staff.getUser();

        user.setActive(active);
        userRepository.save(user);
        return toStaffDto(staff);
    }

    private Staff createStaffInternal(Map<String, String> req) {
        String name = req.getOrDefault("name", "").trim();
        String email = req.getOrDefault("email", "").trim().toLowerCase();
        String contactNumber = req.getOrDefault("contactNumber", "").trim();
        String password = req.getOrDefault("password", "");

        if (name.isEmpty() || email.isEmpty() || password.length() < 8) {
            throw new IllegalArgumentException("Name, valid email, and a password of at least 8 characters are required.");
        }
        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new IllegalArgumentException("An account with this email already exists.");
        }

        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setContactNumber(contactNumber);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole("staff");
        user.setActive(true);
        user = userRepository.save(user);

        Staff staff = new Staff();
        staff.setUser(user);
        return staffRepository.save(staff);
    }

    public Map<String, Object> login(Map<String, String> req) {
        String email = req.getOrDefault("email", "").trim();
        String password = req.getOrDefault("password", "");
        String expectedRole = req.getOrDefault("role", "patient").trim().toLowerCase();

        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new IllegalArgumentException("Incorrect email or password."));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new IllegalArgumentException("Incorrect email or password.");
        }
        if (!user.isActive()) {
            throw new IllegalArgumentException("This account has been deactivated. Please contact clinic administration.");
        }
        if (!user.getRole().equalsIgnoreCase(expectedRole)) {
            throw new IllegalArgumentException("This account does not have " + expectedRole + " access.");
        }

        Patient patient = patientRepository.findByUser_UserId(user.getUserId()).orElse(null);
        Staff staff = staffRepository.findByUser_UserId(user.getUserId()).orElse(null);
        return toAuthDto(user, patient, staff);
    }

    public Map<String, Object> getPatientProfile(Integer patientId) {
        Patient patient = resolvePatient(patientId);
        return toPatientDto(patient);
    }

    @Transactional
    public Map<String, Object> updatePatientProfile(Integer patientId, Map<String, String> req) {
        Patient patient = resolvePatient(patientId);
        User user = patient.getUser();

        if (req.containsKey("fullName") && !req.get("fullName").isBlank()) {
            user.setName(req.get("fullName").trim());
        }
        if (req.containsKey("email") && !req.get("email").isBlank()) {
            String newEmail = req.get("email").trim().toLowerCase();
            if (!newEmail.equalsIgnoreCase(user.getEmail()) && userRepository.existsByEmailIgnoreCase(newEmail)) {
                throw new IllegalArgumentException("That email address is already in use.");
            }
            user.setEmail(newEmail);
        }
        if (req.containsKey("phone")) {
            user.setContactNumber(req.get("phone").trim());
        }
        userRepository.save(user);

        if (req.containsKey("dateOfBirth") && !req.get("dateOfBirth").isBlank()) {
            patient.setDateOfBirth(LocalDate.parse(req.get("dateOfBirth").trim()));
        }
        if (req.containsKey("sex")) {
            patient.setGender(req.get("sex"));
        }
        if (req.containsKey("bloodType")) {
            patient.setBloodType(req.get("bloodType"));
        }
        if (req.containsKey("address")) {
            patient.setAddress(req.get("address"));
        }
        if (req.containsKey("allergies")) {
            patient.setAllergies(req.get("allergies"));
        }
        if (req.containsKey("emergencyContact")) {
            patient.setEmergencyContact(req.get("emergencyContact"));
        }
        if (req.containsKey("medicalNotes")) {
            patient.setMedicalNotes(req.get("medicalNotes"));
        }

        patient = patientRepository.save(patient);
        return toPatientDto(patient);
    }

    public List<Map<String, Object>> getAllPatientsForStaff() {
        List<QueueEntry> entries = queueEntryRepository.findAllByOrderByQueueEntryIdAsc();
        return patientRepository.findAll().stream().map(patient -> {
            Map<String, Object> dto = toPatientDto(patient);
            List<Appointment> apts = appointmentRepository.findByPatient_PatientIdOrderByAppointmentIdDesc(patient.getPatientId());
            String lastService = apts.isEmpty() || apts.get(0).getResolvedService() == null
                    ? "—"
                    : apts.get(0).getResolvedService().getServiceName();
            String queueStatus = entries.stream()
                    .filter(e -> e.getAppointment().getPatient().getPatientId().equals(patient.getPatientId()))
                    .reduce((first, second) -> second)
                    .map(QueueEntry::getStatus)
                    .orElse("Registered");
            dto.put("lastService", lastService);
            dto.put("queueStatus", queueStatus);
            return dto;
        }).toList();
    }

    public Patient resolvePatient(Integer patientId) {
        if (patientId != null) {
            return patientRepository.findById(patientId)
                    .orElseThrow(() -> new NotFoundException("Patient not found: " + patientId));
        }
        return patientRepository.findAll().stream().findFirst()
                .orElseThrow(() -> new NotFoundException("No patient record exists."));
    }

    private Map<String, Object> toAuthDto(User user, Patient patient, Staff staff) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", user.getUserId());
        map.put("userId", user.getUserId());
        map.put("patientId", patient != null ? patient.getPatientId() : null);
        map.put("staffId", staff != null ? staff.getStaffId() : null);
        map.put("name", user.getName());
        map.put("email", user.getEmail());
        map.put("contactNumber", user.getContactNumber() != null ? user.getContactNumber() : "");
        map.put("role", user.getRole());
        return map;
    }

    public Map<String, Object> toStaffDto(Staff staff) {
        User u = staff.getUser();
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", "STF-" + (100 + staff.getStaffId()));
        map.put("staffId", staff.getStaffId());
        map.put("userId", u.getUserId());
        map.put("name", u.getName() != null ? u.getName() : "");
        map.put("email", u.getEmail() != null ? u.getEmail() : "");
        map.put("contactNumber", u.getContactNumber() != null ? u.getContactNumber() : "");
        map.put("role", u.getRole());
        map.put("active", u.isActive());
        return map;
    }

    public Map<String, Object> toPatientDto(Patient patient) {
        User u = patient.getUser();
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", "PAT-" + (100 + patient.getPatientId()));
        map.put("patientId", patient.getPatientId());
        map.put("fullName", u.getName() != null ? u.getName() : "");
        map.put("email", u.getEmail() != null ? u.getEmail() : "");
        map.put("phone", u.getContactNumber() != null ? u.getContactNumber() : "");
        map.put("dateOfBirth", patient.getDateOfBirth() != null ? patient.getDateOfBirth().toString() : "");
        map.put("sex", patient.getGender() != null ? patient.getGender() : "");
        map.put("bloodType", patient.getBloodType() != null ? patient.getBloodType() : "Unknown");
        map.put("address", patient.getAddress() != null ? patient.getAddress() : "");
        map.put("allergies", patient.getAllergies() != null ? patient.getAllergies() : "");
        map.put("emergencyContact", patient.getEmergencyContact() != null ? patient.getEmergencyContact() : "");
        map.put("medicalNotes", patient.getMedicalNotes() != null ? patient.getMedicalNotes() : "");
        return map;
    }
}
