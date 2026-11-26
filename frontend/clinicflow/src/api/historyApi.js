// ============================================================
// OWNER   : Lepon
// FEATURE : History
// ============================================================

import api from "./api";

export const getVisitHistory = (patientId) =>
  api.get(patientId != null ? `/history?patientId=${encodeURIComponent(patientId)}` : "/history");
