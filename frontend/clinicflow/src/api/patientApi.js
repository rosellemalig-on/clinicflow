// ============================================================
// OWNER   : Malig-on
// FEATURE : Patient
// ============================================================

import api from "./api";

export const getPatientProfile = (patientId) =>
  api.get(
    patientId != null
      ? `/patients/profile?patientId=${encodeURIComponent(patientId)}`
      : "/patients/profile",
  );

export const updatePatientProfile = (patientId, payload) =>
  api.put(`/patients/${patientId}`, payload);

export const getStaffPatients = () => api.get("/staff/patients");
