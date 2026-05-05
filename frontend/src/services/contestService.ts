//frontend/src/services/contestService.ts
import api from "./api";

export const getContests = () => {
  return api.get("/api/contests");
};

export const getContest = (id: string) => {
  return api.get(`/api/contests/${id}`);
};

export const getContestProblems = (id: string) => {
  return api.get(`/api/contests/${id}/problems`);
};

export const getContestLeaderboard = (id: string) => {
  return api.get(`/api/contests/${id}/leaderboard`);
};

export const registerContest = (id: string) => {
  return api.post(`/api/contests/${id}/register`);
};

export const createContest = (data: any) => {
  return api.post("/api/contests", data);
};
