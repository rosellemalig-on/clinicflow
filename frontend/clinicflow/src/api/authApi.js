// ============================================================
// OWNER   : Malig-on
// FEATURE : Auth
// ============================================================

import api from "./api";

export const login = (payload) => api.post("/auth/login", payload);
export const register = (payload) => api.post("/auth/register", payload);
export const registerStaff = (payload) => api.post("/auth/register-staff", payload);
