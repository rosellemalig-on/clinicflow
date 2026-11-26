// ============================================================
// OWNER   : Padilla
// FEATURE : Reports
// ============================================================

import api from "./api";

export const getReportSummary = () => api.get("/reports/summary");
