import axios from "axios";

// Đọc từ biến môi trường VITE_API_URL được inject lúc build
// - Khi dev local: fallback về http://localhost:5000
// - Khi deploy lên Vercel: dùng URL backend Render đã set trong env
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;