//frontend/src/services/problemService.ts
import api from "./api";

export interface GetProblemsParams {
  page?: number;
  limit?: number;
  search?: string;
  difficulty?: string;
  tag?: string;
  solved?: boolean;
}

export const getProblems = (params: GetProblemsParams = {}) => {
  const { page = 1, limit = 20, search, difficulty, tag, solved } = params;
  return api.get("/api/problems", {
    params: {
      page,
      limit,
      ...(search && { search }),
      ...(difficulty && { difficulty }),
      ...(tag && { tag }),
      ...(solved !== undefined && { solved }),
    },
  });
};

export const getProblem = (id: string) => {
  return api.get(`/api/problems/${id}`);
};

export const getDailyProblem = () => {
  return api.get("/api/problems/daily");
};

export const getDailyProblems = () => {
  return api.get("/api/problems/daily");
};

export const createProblem = (data: any) => {
  return api.post("/api/problems", data);
};

export const getTopicCounts = () => {
  return api.get("/api/problems/topic-counts");
};

export const updateProblem = (id: string, data: any) => {
  return api.put(`/api/problems/${id}`, data);
};
