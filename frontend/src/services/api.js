import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5001/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// ================= REQUEST INTERCEPTOR =================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ================= RESPONSE INTERCEPTOR =================
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Only clear authentication if request is to a protected endpoint that explicitly fails with 401
    // and not during initial login attempts or public requests
    if (
      error.response?.status === 401 &&
      !error.config?.url?.includes("/auth/login") &&
      !error.config?.url?.includes("/mechanics/login") &&
      !error.config?.url?.includes("/auth/register")
    ) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }

    return Promise.reject(error);
  }
);

export default api;
