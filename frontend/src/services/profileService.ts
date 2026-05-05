//frontend/src/services/profileService.ts
import api from "./api";

export const getLeaderboard = (page = 1, limit = 50) => {
  return api.get("/api/users/leaderboard", { params: { page, limit } });
};

export const getProfile = (username: string) => {
  return api.get(`/api/users/${username}`);
};

export const getUserSubmissions = (userId: string, page = 1, limit = 20) => {
  return api.get(`/api/users/${userId}/submissions`, { params: { page, limit } });
};

export const getUserStats = (userId: string) => {
  return api.get(`/api/users/${userId}/stats`);
};

export const updateProfile = (data: any) => {
  return api.put("/api/users/me", data);
};
