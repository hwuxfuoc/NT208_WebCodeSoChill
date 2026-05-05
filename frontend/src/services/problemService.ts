//frontend/src/services/problemService.ts
import api from "./api";

export const getProblems = (page = 1, limit = 20) => {
  return api.get("/api/problems", { params: { page, limit } });
};

export const getProblem = (id: string) => {
  return api.get(`/api/problems/${id}`);
};

export const getDailyProblem = () => {
  return api.get("/api/problems/daily");
};

export const createProblem = (data: any) => {
  return api.post("/api/problems", data);
};

export const updateProblem = (id: string, data: any) => {
  return api.put(`/api/problems/${id}`, data);
};
