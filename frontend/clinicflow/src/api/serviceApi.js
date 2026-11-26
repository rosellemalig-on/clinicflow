// ============================================================
// OWNER   : Padilla
// FEATURE : Services
// ============================================================

import api from "./api";

export const getServices = () => api.get("/services");
export const createService = (payload) => api.post("/services", payload);
export const updateService = (serviceId, payload) => api.put(`/services/${serviceId}`, payload);
