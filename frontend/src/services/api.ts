import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || (import.meta.env.MODE === "development" ? "http://localhost:5000" : window.location.origin);

const api = axios.create({
  baseURL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;