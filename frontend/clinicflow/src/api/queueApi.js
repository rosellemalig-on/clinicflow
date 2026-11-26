// ============================================================
// OWNER   : Padilla
// FEATURE : Queue
// ============================================================

import api from "./api";

export const getQueueSnapshot = (patientId) =>
  api.get(patientId != null ? `/queue?patientId=${encodeURIComponent(patientId)}` : "/queue");

export const performQueueAction = (payload) => api.post("/queue/action", payload);
