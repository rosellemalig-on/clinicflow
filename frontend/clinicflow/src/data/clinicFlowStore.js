import { useCallback, useEffect, useSyncExternalStore } from 'react';
import * as appointmentApi from '@/api/appointmentApi';
import * as doctorApi from '@/api/doctorApi';
import * as historyApi from '@/api/historyApi';
import * as myQueueApi from '@/api/myQueueApi';
import * as notificationApi from '@/api/notificationApi';
import * as patientApi from '@/api/patientApi';
import * as paymentApi from '@/api/paymentApi';
import * as queueApi from '@/api/queueApi';
import * as reportApi from '@/api/reportApi';
import * as serviceApi from '@/api/serviceApi';
import * as staffApi from '@/api/staffApi';
import { authService } from '@/services/auth.service';
import { playNotificationSound } from '@/utils/notificationSound';

const DEFAULT_DATE = '2026-11-26';

const DEFAULT_DAILY_STATS = [
  { day: 'Mon', patients: 0 },
  { day: 'Tue', patients: 0 },
  { day: 'Wed', patients: 0 },
  { day: 'Thu', patients: 0 },
  { day: 'Fri', patients: 0 },
  { day: 'Sat', patients: 0 },
];

const INITIAL_STATE = {
  patient: {
    id: '',
    patientId: null,
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    sex: '',
    bloodType: 'Unknown',
    address: '',
    allergies: '',
    emergencyContact: '',
    medicalNotes: '',
  },
  patients: [],
  staffAccounts: [],
  services: [],
  doctors: [],
  slotsByDate: {},
  appointments: [],
  visitHistory: [],
  queue: {
    nowServingNumber: 0,
    patientQueueNumber: 0,
    patientQueueCode: null,
    patientQueueStatus: null,
    hasActiveTicket: false,
    patientServiceName: null,
    patientDoctorName: null,
    patientAppointmentId: null,
    patientScheduledAt: null,
    totalInQueue: 0,
    avgMinutesPerPatient: 5,
    entries: [],
  },
  notifications: [],
  dailyStats: DEFAULT_DAILY_STATS,
  loading: false,
  error: null,
};

export function getSlotsForDate(slotsByDate, date) {
  return slotsByDate[date] || [];
}

let currentState = INITIAL_STATE;
const listeners = new Set();
let initialized = false;
let activeDate = DEFAULT_DATE;
let refreshInFlight = false;
let notificationsHydratedForKey = null;
const seenNotificationIds = new Set();

function emitChange() {
  listeners.forEach((listener) => listener());
}

function updateStore(updater) {
  const nextState = typeof updater === 'function' ? updater(currentState) : updater;
  if (nextState === currentState) return;
  currentState = nextState;
  emitChange();
}

function getActiveSession() {
  return authService.currentUser();
}

function getScopedPatientId(session) {
  if (session?.role === 'patient' && session?.patientId != null) {
    return session.patientId;
  }
  return null;
}

function resolveNumericId(list, idOrDisplayId, numericKey) {
  if (idOrDisplayId == null) return null;
  const match = list.find(
    (item) =>
      String(item.id) === String(idOrDisplayId) ||
      String(item[numericKey]) === String(idOrDisplayId),
  );
  if (match && match[numericKey] != null) return match[numericKey];
  const digits = String(idOrDisplayId).replace(/[^0-9]/g, '');
  return digits ? Number(digits) : null;
}

export async function loadSlotsForDate(date) {
  if (!date) return [];
  activeDate = date;
  try {
    const slots = await appointmentApi.getSlotsByDate(date);
    updateStore((prev) => ({
      ...prev,
      slotsByDate: { ...prev.slotsByDate, [date]: Array.isArray(slots) ? slots : [] },
      error: null,
    }));
    return slots;
  } catch (err) {
    updateStore((prev) => ({ ...prev, error: err.message }));
    return [];
  }
}

export async function refreshClinicFlowStore(dateOverride, { silent = false } = {}) {
  const session = getActiveSession();
  if (!session) {
    notificationsHydratedForKey = null;
    seenNotificationIds.clear();
    updateStore(INITIAL_STATE);
    return;
  }
  if (silent && refreshInFlight) {
    return;
  }

  const targetDate = dateOverride || activeDate || DEFAULT_DATE;
  activeDate = targetDate;
  const isStaff = session.role === 'staff';
  const patientId = getScopedPatientId(session);
  const sessionKey = `${session.role}:${session.userId ?? session.patientId ?? session.email ?? 'anon'}`;

  refreshInFlight = true;
  if (!silent) {
    updateStore((prev) => ({ ...prev, loading: true }));
  }

  try {
    const [
      servicesRes,
      doctorsRes,
      appointmentsRes,
      queueRes,
      notificationsRes,
      reportRes,
      historyRes,
      slotsRes,
      profileRes,
      staffPatientsRes,
      staffAccountsRes,
    ] = await Promise.allSettled([
      serviceApi.getServices(),
      doctorApi.getDoctors(),
      appointmentApi.getAppointments(patientId),
      isStaff ? queueApi.getQueueSnapshot(null) : myQueueApi.getMyQueue(patientId),
      notificationApi.getNotifications(patientId),
      isStaff ? reportApi.getReportSummary() : Promise.resolve(null),
      historyApi.getVisitHistory(patientId),
      appointmentApi.getSlotsByDate(targetDate),
      isStaff ? Promise.resolve(null) : patientApi.getPatientProfile(patientId),
      isStaff ? patientApi.getStaffPatients() : Promise.resolve([]),
      isStaff ? staffApi.getStaffAccounts() : Promise.resolve([]),
    ]);

    const firstError = [
      servicesRes,
      doctorsRes,
      appointmentsRes,
      queueRes,
    ].find((r) => r.status === 'rejected')?.reason?.message || null;

    const incomingNotifications =
      notificationsRes.status === 'fulfilled' && Array.isArray(notificationsRes.value)
        ? notificationsRes.value
        : null;

    let newlyArrivedNotification = null;
    if (incomingNotifications) {
      if (notificationsHydratedForKey !== sessionKey) {
        seenNotificationIds.clear();
        incomingNotifications.forEach((n) => seenNotificationIds.add(String(n.id)));
        notificationsHydratedForKey = sessionKey;
      } else {
        const freshUnread = incomingNotifications.filter(
          (n) => !seenNotificationIds.has(String(n.id)) && !n.read,
        );
        incomingNotifications.forEach((n) => seenNotificationIds.add(String(n.id)));
        if (!isStaff && freshUnread.length > 0) {
          newlyArrivedNotification =
            freshUnread.find((n) => n.type === 'next' || n.type === 'approaching') ||
            freshUnread[0];
        }
      }
    }

    updateStore((prev) => ({
      ...prev,
      services: servicesRes.status === 'fulfilled' && Array.isArray(servicesRes.value)
        ? servicesRes.value
        : prev.services,
      doctors: doctorsRes.status === 'fulfilled' && Array.isArray(doctorsRes.value)
        ? doctorsRes.value
        : prev.doctors,
      appointments: appointmentsRes.status === 'fulfilled' && Array.isArray(appointmentsRes.value)
        ? appointmentsRes.value
        : prev.appointments,
      queue: queueRes.status === 'fulfilled' && queueRes.value
        ? {
            nowServingNumber: queueRes.value.nowServingNumber ?? 0,
            patientQueueNumber: queueRes.value.patientQueueNumber ?? 0,
            patientQueueCode: queueRes.value.patientQueueCode ?? null,
            patientQueueStatus: queueRes.value.patientQueueStatus ?? null,
            hasActiveTicket: Boolean(queueRes.value.hasActiveTicket),
            patientServiceName: queueRes.value.patientServiceName ?? null,
            patientDoctorName: queueRes.value.patientDoctorName ?? null,
            patientAppointmentId: queueRes.value.patientAppointmentId ?? null,
            patientScheduledAt: queueRes.value.patientScheduledAt ?? null,
            totalInQueue: queueRes.value.totalInQueue ?? 0,
            avgMinutesPerPatient: queueRes.value.avgMinutesPerPatient ?? 5,
            entries: Array.isArray(queueRes.value.entries) ? queueRes.value.entries : [],
          }
        : prev.queue,
      notifications: incomingNotifications ?? prev.notifications,
      dailyStats: reportRes.status === 'fulfilled' && Array.isArray(reportRes.value?.dailyStats)
        ? reportRes.value.dailyStats
        : prev.dailyStats,
      visitHistory: historyRes.status === 'fulfilled' && Array.isArray(historyRes.value)
        ? historyRes.value
        : prev.visitHistory,
      slotsByDate: slotsRes.status === 'fulfilled' && Array.isArray(slotsRes.value)
        ? { ...prev.slotsByDate, [targetDate]: slotsRes.value }
        : prev.slotsByDate,
      patient: isStaff
        ? INITIAL_STATE.patient
        : profileRes.status === 'fulfilled' && profileRes.value
          ? { ...prev.patient, ...profileRes.value }
          : prev.patient,
      patients: isStaff && staffPatientsRes.status === 'fulfilled' && Array.isArray(staffPatientsRes.value)
        ? staffPatientsRes.value
        : [],
      staffAccounts: isStaff && staffAccountsRes.status === 'fulfilled' && Array.isArray(staffAccountsRes.value)
        ? staffAccountsRes.value
        : [],
      loading: false,
      error: firstError,
    }));

    if (newlyArrivedNotification) {
      playNotificationSound(newlyArrivedNotification.type);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('clinicflow:notification', { detail: newlyArrivedNotification }),
        );
      }
    }
  } finally {
    refreshInFlight = false;
  }
}

function subscribe(listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return currentState;
}

if (typeof window !== 'undefined') {
  window.addEventListener('clinicflow:session', () => {
    refreshClinicFlowStore();
  });

  window.addEventListener('focus', () => {
    if (getActiveSession()) {
      refreshClinicFlowStore(undefined, { silent: true });
    }
  });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && getActiveSession()) {
      refreshClinicFlowStore(undefined, { silent: true });
    }
  });

  window.setInterval(() => {
    if (document.visibilityState === 'visible' && getActiveSession()) {
      refreshClinicFlowStore(undefined, { silent: true });
    }
  }, 5000);
}

export function useClinicFlowStore() {
  const state = useSyncExternalStore(subscribe, getSnapshot);

  useEffect(() => {
    if (!initialized) {
      initialized = true;
      refreshClinicFlowStore();
    }
  }, []);

  const updatePatientProfile = useCallback(async (updated) => {
    const session = getActiveSession();
    const patientId =
      updated?.patientId ||
      currentState.patient?.patientId ||
      session?.patientId;

    if (!patientId) {
      throw new Error('No patient record is loaded to update.');
    }

    const payload = {};
    const stringFields = [
      'fullName',
      'email',
      'phone',
      'dateOfBirth',
      'sex',
      'bloodType',
      'address',
      'allergies',
      'emergencyContact',
      'medicalNotes',
    ];
    stringFields.forEach((field) => {
      if (updated[field] !== undefined && updated[field] !== null) {
        payload[field] = String(updated[field]);
      }
    });

    const saved = await patientApi.updatePatientProfile(patientId, payload);
    updateStore((prev) => ({
      ...prev,
      patient: { ...prev.patient, ...saved },
      error: null,
    }));
    if (session?.role === 'patient') {
      authService.updateSessionUser({
        name: saved.fullName || session.name,
        email: saved.email || session.email,
        contactNumber: saved.phone ?? session.contactNumber,
      });
    } else {
      await refreshClinicFlowStore();
    }
    return saved;
  }, []);

  const bookAppointment = useCallback(async ({ serviceId, doctorName, doctorId, date, slotId }) => {
    const session = getActiveSession();
    const patientId = session?.patientId || currentState.patient?.patientId;
    const resolvedServiceId = resolveNumericId(currentState.services, serviceId, 'serviceId');
    const daySlots = getSlotsForDate(currentState.slotsByDate, date);
    const resolvedSlotId = resolveNumericId(daySlots, slotId, 'slotId');
    const resolvedDoctorId =
      doctorId ||
      currentState.doctors.find((d) => d.name === doctorName)?.doctorId ||
      null;

    try {
      const appointment = await appointmentApi.bookAppointment({
        patientId,
        serviceId: resolvedServiceId,
        doctorId: resolvedDoctorId,
        doctorName,
        slotId: resolvedSlotId,
      });
      await refreshClinicFlowStore(date);
      return { ok: true, appointment };
    } catch (err) {
      await loadSlotsForDate(date);
      return {
        ok: false,
        slotFull: err.status === 409,
        error: err.message || 'Unable to book this slot.',
      };
    }
  }, []);

  const updateAppointmentStatus = useCallback(async (appointmentId, status) => {
    const numericId = resolveNumericId(currentState.appointments, appointmentId, 'appointmentId');
    if (!numericId) return;
    await appointmentApi.updateAppointmentStatus(numericId, status);
    await refreshClinicFlowStore();
  }, []);

  const cancelAppointment = useCallback(async (appointmentId) => {
    const session = getActiveSession();
    const numericId = resolveNumericId(currentState.appointments, appointmentId, 'appointmentId');
    if (!numericId) {
      throw new Error('Unable to identify the appointment to cancel.');
    }
    const cancelled = await appointmentApi.cancelAppointment(numericId, getScopedPatientId(session));
    await refreshClinicFlowStore();
    return cancelled;
  }, []);

  const confirmPayment = useCallback(
    async (appointmentId, paymentMethod, referenceNumber = '', confirmedBy = 'patient') => {
      const numericId = resolveNumericId(currentState.appointments, appointmentId, 'appointmentId');
      if (!numericId) return null;
      const saved = await paymentApi.confirmPayment(numericId, {
        method: paymentMethod,
        referenceNumber,
        confirmedBy,
      });
      await refreshClinicFlowStore();
      return saved;
    },
    [],
  );

  const markNotificationRead = useCallback(async (id) => {
    const numericId = resolveNumericId(currentState.notifications, id, 'notificationId');
    if (!numericId) return;
    await notificationApi.markNotificationRead(numericId);
    await refreshClinicFlowStore();
  }, []);

  const markAllNotificationsRead = useCallback(async () => {
    const session = getActiveSession();
    await notificationApi.markAllNotificationsRead(getScopedPatientId(session));
    await refreshClinicFlowStore();
  }, []);

  const addService = useCallback(async (svc) => {
    await serviceApi.createService({
      name: svc.name.trim(),
      fee: Math.max(0, Number(svc.fee) || 0),
      durationMin: Math.max(5, Number(svc.durationMin) || 20),
      active: true,
    });
    await refreshClinicFlowStore();
  }, []);

  const updateService = useCallback(async (id, updates) => {
    const numericId = resolveNumericId(currentState.services, id, 'serviceId');
    if (!numericId) return;
    await serviceApi.updateService(numericId, updates);
    await refreshClinicFlowStore();
  }, []);

  const addDoctor = useCallback(async (doc) => {
    await doctorApi.createDoctor({
      name: doc.name.trim(),
      specialty: doc.specialty.trim(),
      department: doc.department?.trim() || doc.specialty.trim(),
      schedule: doc.schedule?.trim() || 'Mon–Fri, 9:00 AM – 5:00 PM',
      scheduleDates: Array.isArray(doc.scheduleDates) ? doc.scheduleDates : [],
      available: true,
    });
    await refreshClinicFlowStore();
  }, []);

  const updateDoctor = useCallback(async (id, updates) => {
    const numericId = resolveNumericId(currentState.doctors, id, 'doctorId');
    if (!numericId) return;
    await doctorApi.updateDoctor(numericId, updates);
    await refreshClinicFlowStore();
  }, []);

  const addStaffAccount = useCallback(async (account) => {
    const created = await staffApi.createStaffAccount({
      name: account.name.trim(),
      email: account.email.trim(),
      contactNumber: account.contactNumber?.trim() || '',
      password: account.password,
    });
    await refreshClinicFlowStore();
    return created;
  }, []);

  const toggleStaffAccountStatus = useCallback(async (id, active) => {
    const session = getActiveSession();
    const numericId = resolveNumericId(currentState.staffAccounts, id, 'staffId');
    if (!numericId) return;
    await staffApi.updateStaffStatus(numericId, active, session?.userId ?? null);
    await refreshClinicFlowStore();
  }, []);

  const queueAction = useCallback(async (action, targetEntryId = null) => {
    const session = getActiveSession();
    const entryId = resolveNumericId(currentState.queue.entries, targetEntryId, 'queueEntryId');
    await queueApi.performQueueAction({
      action,
      entryId,
      patientId: getScopedPatientId(session),
    });
    await refreshClinicFlowStore();
  }, []);

  const resetDemoData = useCallback(() => {
    refreshClinicFlowStore();
  }, []);

  return {
    state,
    refreshData: refreshClinicFlowStore,
    loadSlotsForDate,
    updatePatientProfile,
    bookAppointment,
    updateAppointmentStatus,
    cancelAppointment,
    confirmPayment,
    markNotificationRead,
    markAllNotificationsRead,
    addService,
    updateService,
    addDoctor,
    updateDoctor,
    addStaffAccount,
    toggleStaffAccountStatus,
    queueAction,
    resetDemoData,
  };
}
