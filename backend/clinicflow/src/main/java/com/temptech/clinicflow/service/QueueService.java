package com.temptech.clinicflow.service;

import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.temptech.clinicflow.entity.Appointment;
import com.temptech.clinicflow.entity.Queue;
import com.temptech.clinicflow.entity.QueueEntry;
import com.temptech.clinicflow.entity.VisitHistory;
import com.temptech.clinicflow.repository.AppointmentRepository;
import com.temptech.clinicflow.repository.QueueEntryRepository;
import com.temptech.clinicflow.repository.QueueRepository;
import com.temptech.clinicflow.repository.VisitHistoryRepository;

// ============================================================
// OWNER   : Padilla
// FEATURE : Queue Management
// ============================================================

@Service
public class QueueService {

    private final QueueRepository queueRepository;
    private final QueueEntryRepository queueEntryRepository;
    private final AppointmentRepository appointmentRepository;
    private final VisitHistoryRepository visitHistoryRepository;
    private final NotificationService notificationService;

    public QueueService(
            QueueRepository queueRepository,
            QueueEntryRepository queueEntryRepository,
            AppointmentRepository appointmentRepository,
            VisitHistoryRepository visitHistoryRepository,
            NotificationService notificationService
    ) {
        this.queueRepository = queueRepository;
        this.queueEntryRepository = queueEntryRepository;
        this.appointmentRepository = appointmentRepository;
        this.visitHistoryRepository = visitHistoryRepository;
        this.notificationService = notificationService;
    }

    public Map<String, Object> getQueueSnapshot(Integer patientId) {
        Queue queue = queueRepository.findTopByOrderByQueueIdDesc().orElse(null);
        List<QueueEntry> entries = queueEntryRepository.findAllByOrderByQueueEntryIdAsc();

        QueueEntry serving = entries.stream()
                .filter(e -> "Serving".equals(e.getStatus()))
                .findFirst()
                .orElse(null);

        int nowServingNumber = serving != null
                ? parseQueueNum(serving.getQueueNumber())
                : (queue != null ? queue.getNowServing() : 0);

        QueueEntry patientEntry = entries.stream()
                .filter(e -> patientId == null
                        || e.getAppointment().getPatient().getPatientId().equals(patientId))
                .reduce((first, second) -> second)
                .orElse(null);

        int patientQueueNumber = patientEntry != null
                ? parseQueueNum(patientEntry.getQueueNumber())
                : nowServingNumber;

        List<Map<String, Object>> entryDtos = entries.stream().map(e -> {
            Appointment apt = e.getAppointment();
            Map<String, Object> row = new LinkedHashMap<>();
            row.put("id", String.valueOf(e.getQueueEntryId()));
            row.put("queueEntryId", e.getQueueEntryId());
            row.put("number", parseQueueNum(e.getQueueNumber()));
            row.put("code", e.getQueueNumber());
            row.put("patientName", apt.getPatient().getUser().getName());
            row.put("serviceName", apt.getResolvedService() != null ? apt.getResolvedService().getServiceName() : "");
            row.put("status", e.getStatus());
            return row;
        }).toList();

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("nowServingNumber", nowServingNumber);
        result.put("patientQueueNumber", patientQueueNumber);
        result.put("totalInQueue", entries.size());
        result.put("avgMinutesPerPatient", 5);
        result.put("entries", entryDtos);
        return result;
    }

    @Transactional
    public Map<String, Object> performAction(String action, Integer targetEntryId, Integer patientId) {
        Queue queue = queueRepository.findTopByOrderByQueueIdDesc().orElse(null);
        List<QueueEntry> entries = queueEntryRepository.findAllByOrderByQueueEntryIdAsc();

        QueueEntry currentServing = entries.stream()
                .filter(e -> "Serving".equals(e.getStatus()))
                .findFirst()
                .orElse(null);

        if ("CALL_NEXT".equalsIgnoreCase(action)) {
            if (currentServing != null) {
                currentServing.setStatus("Completed");
                queueEntryRepository.save(currentServing);

                Appointment completedApt = currentServing.getAppointment();
                completedApt.setStatus("Completed");
                appointmentRepository.save(completedApt);

                VisitHistory vh = new VisitHistory();
                vh.setPatient(completedApt.getPatient());
                vh.setQueueEntry(currentServing);
                vh.setVisitDate(LocalDate.now());
                String completedSvc = completedApt.getResolvedService() != null
                        ? completedApt.getResolvedService().getServiceName()
                        : "Clinic Visit";
                vh.setOutcome("Completed - " + completedSvc);
                visitHistoryRepository.save(vh);
            }

            QueueEntry nextWaiting = entries.stream()
                    .filter(e -> "Waiting".equals(e.getStatus()))
                    .findFirst()
                    .orElse(null);

            if (nextWaiting != null) {
                nextWaiting.setStatus("Serving");
                queueEntryRepository.save(nextWaiting);

                int servingNum = parseQueueNum(nextWaiting.getQueueNumber());
                if (queue != null) {
                    queue.setNowServing(servingNum);
                    queueRepository.save(queue);
                }

                // Notify upcoming waiting patients
                List<QueueEntry> stillWaiting = entries.stream()
                        .filter(e -> "Waiting".equals(e.getStatus()) && !e.getQueueEntryId().equals(nextWaiting.getQueueEntryId()))
                        .toList();

                for (int i = 0; i < stillWaiting.size() && i < 3; i++) {
                    QueueEntry upcoming = stillWaiting.get(i);
                    int ahead = i + 1;
                    if (ahead == 1) {
                        notificationService.createNotification(
                                upcoming.getAppointment().getPatient(),
                                upcoming.getAppointment(),
                                "next",
                                "You are next in line!",
                                "Now serving " + nextWaiting.getQueueNumber() + ". Please proceed near the consultation room."
                        );
                    } else {
                        notificationService.createNotification(
                                upcoming.getAppointment().getPatient(),
                                upcoming.getAppointment(),
                                "approaching",
                                "Your turn is approaching",
                                "Now serving " + nextWaiting.getQueueNumber() + ". " + ahead + " patients ahead of you."
                        );
                    }
                }
            }
        } else if ("HOLD".equalsIgnoreCase(action)) {
            QueueEntry target = resolveTarget(entries, targetEntryId, currentServing);
            if (target != null) {
                target.setStatus("On Hold");
                queueEntryRepository.save(target);
            }
        } else if ("SKIP".equalsIgnoreCase(action)) {
            QueueEntry target = resolveTarget(entries, targetEntryId, currentServing);
            if (target != null) {
                boolean wasServing = currentServing != null
                        && currentServing.getQueueEntryId().equals(target.getQueueEntryId());
                target.setStatus("Skipped");
                queueEntryRepository.save(target);

                if (wasServing) {
                    QueueEntry nextWaiting = entries.stream()
                            .filter(e -> "Waiting".equals(e.getStatus()) && !e.getQueueEntryId().equals(target.getQueueEntryId()))
                            .findFirst()
                            .orElse(null);
                    if (nextWaiting != null) {
                        nextWaiting.setStatus("Serving");
                        queueEntryRepository.save(nextWaiting);
                        if (queue != null) {
                            queue.setNowServing(parseQueueNum(nextWaiting.getQueueNumber()));
                            queueRepository.save(queue);
                        }
                    }
                }
            }
        } else if ("RECALL".equalsIgnoreCase(action) && targetEntryId != null) {
            QueueEntry target = entries.stream()
                    .filter(e -> e.getQueueEntryId().equals(targetEntryId))
                    .findFirst()
                    .orElse(null);
            if (target != null) {
                if (currentServing != null && !currentServing.getQueueEntryId().equals(target.getQueueEntryId())) {
                    currentServing.setStatus("Waiting");
                    queueEntryRepository.save(currentServing);
                }
                target.setStatus("Serving");
                queueEntryRepository.save(target);
                if (queue != null) {
                    queue.setNowServing(parseQueueNum(target.getQueueNumber()));
                    queueRepository.save(queue);
                }
            }
        }

        return getQueueSnapshot(patientId);
    }

    private QueueEntry resolveTarget(List<QueueEntry> entries, Integer targetEntryId, QueueEntry currentServing) {
        if (targetEntryId != null) {
            return entries.stream()
                    .filter(e -> e.getQueueEntryId().equals(targetEntryId))
                    .findFirst()
                    .orElse(null);
        }
        return currentServing;
    }

    private int parseQueueNum(String code) {
        if (code == null) return 0;
        String digits = code.replaceAll("[^0-9]", "");
        return digits.isEmpty() ? 0 : Integer.parseInt(digits);
    }
}
