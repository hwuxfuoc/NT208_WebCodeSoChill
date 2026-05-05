//frontend/src/services/profileService.ts
import api from "./api";

export const getLeaderboard = () => {
  return api.get("/api/users/leaderboard");
};

export const getProfile = (username: string) => {
  return api.get(`/api/users/${username}`);
};

export const getUserSubmissions = (userId: string) => {
  return api.get(`/api/users/${userId}/submissions`);
};

export const getUserStats = (userId: string) => {
  return api.get(`/api/users/${userId}/stats`);
};
