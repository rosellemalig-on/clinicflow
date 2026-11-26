// ============================================================
// OWNER   : Padilla
// FEATURE : Doctors
// ============================================================

import api from "./api";

export const getDoctors = () => api.get("/doctors");
export const createDoctor = (payload) => api.post("/doctors", payload);
export const updateDoctor = (doctorId, payload) => api.put(`/doctors/${doctorId}`, payload);
