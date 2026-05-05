//frontend/src/services/notificationService.ts
import api from "./api";

export const getNotifications = () => {
  return api.get("/api/notifications");
};

export const markAsRead = (id: string) => {
  return api.put(`/api/notifications/${id}/read`);
};

export const markAllAsRead = () => {
  return api.put("/api/notifications/read-all");
};

export const deleteAllNotifications = () => {
  return api.delete("/api/notifications");
};