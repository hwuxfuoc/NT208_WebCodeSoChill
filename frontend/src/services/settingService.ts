//frontend/src/services/settingService.ts
import api from "./api";

export const updateAccount = (data: any) => {
  return api.put("/api/settings/account", data);
};

export const updateAppearance = (data: any) => {
  return api.put("/api/settings/appearance", data);
};

export const changePassword = (data: {
  currentPassword: string;
  newPassword: string;
}) => {
  return api.put("/api/settings/security/password", data);
};

export const uploadAvatar = (file: File) => {
  const formData = new FormData();
  formData.append('avatar', file);
  return api.post('/api/upload/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};