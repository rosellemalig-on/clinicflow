// ============================================================
// OWNER   : Lepon
// FEATURE : My Queue
// ============================================================

import api from "./api";

export const getMyQueue = (patientId) =>
  api.get(
    patientId != null
      ? `/patient/queue?patientId=${encodeURIComponent(patientId)}`
      : "/patient/queue",
  );
