// frontend/src/services/authService.ts
import api from "./api";

export const register = (data: any) => {
  return api.post("/api/auth/register", data);
};

export const login = (data: { email: string; password: string }) => {
  return api.post("/api/auth/login", data);
};

export const me = () => {
  return api.get("/api/auth/me");
};
