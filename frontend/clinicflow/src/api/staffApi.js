// ============================================================
// OWNER   : Padilla
// FEATURE : Staff Accounts
// ============================================================

import api from "./api";

export const getStaffAccounts = () => api.get("/staff/accounts");
export const createStaffAccount = (payload) => api.post("/staff/accounts", payload);
export const updateStaffStatus = (staffId, active, actingUserId) =>
  api.patch(`/staff/accounts/${staffId}/status`, { active, actingUserId });
