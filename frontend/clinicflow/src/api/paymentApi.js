// ============================================================
// OWNER   : Malig-on
// FEATURE : Payments
// ============================================================

import api from "./api";

export const getPayments = () => api.get("/payments");
export const confirmPayment = (appointmentId, methodOrPayload, referenceNumber, confirmedBy) => {
  const body =
    typeof methodOrPayload === "object" && methodOrPayload !== null
      ? methodOrPayload
      : {
          method: methodOrPayload,
          referenceNumber,
          confirmedBy,
        };
  return api.post(`/payments/${appointmentId}/confirm`, body);
};
