// ============================================================
// OWNER   : Malig-on
// FEATURE : Payments
// ============================================================

import api from "./api";

export const getPayments = () => api.get("/payments");
export const confirmPayment = (appointmentId, method) =>
  api.post(`/payments/${appointmentId}/confirm`, { method });
