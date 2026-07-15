import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.MODE === "production"
    ? "/api"
    : "http://localhost:5000/api",
});

API.interceptors.request.use((config) => {
  const admin = JSON.parse(localStorage.getItem("admin"));
  if (admin?.token) {
    config.headers.Authorization = `Bearer ${admin.token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("admin");
      window.location.href = "/admin-login";
    }
    return Promise.reject(error);
  }
);

export default API;

