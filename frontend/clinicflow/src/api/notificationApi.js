// ============================================================
// OWNER   : Lepon
// FEATURE : Notifications
// ============================================================

import api from "./api";

export const getNotifications = (patientId) =>
  api.get(
    patientId != null
      ? `/notifications?patientId=${encodeURIComponent(patientId)}`
      : "/notifications",
  );

export const markNotificationRead = (notificationId) =>
  api.patch(`/notifications/${notificationId}/read`);

export const markAllNotificationsRead = (patientId) =>
  api.patch(
    patientId != null
      ? `/notifications/read-all?patientId=${encodeURIComponent(patientId)}`
      : "/notifications/read-all",
  );
