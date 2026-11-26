// ============================================================
// OWNER   : Malig-on
// FEATURE : Appointments
// ============================================================

import api from "./api";

const withPatient = (path, patientId) =>
  patientId != null ? `${path}?patientId=${encodeURIComponent(patientId)}` : path;

export const getAppointments = (patientId) => api.get(withPatient("/appointments", patientId));
export const getSlotsByDate = (date) => api.get(`/slots?date=${encodeURIComponent(date)}`);
export const bookAppointment = (payload) => api.post("/appointments", payload);
export const updateAppointmentStatus = (appointmentId, status) =>
  api.patch(`/appointments/${appointmentId}/status`, { status });
