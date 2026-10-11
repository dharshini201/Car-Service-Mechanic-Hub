import axios from "axios";

/**
 * Normalizes and validates the API base URL.
 * Handles both root URLs (e.g., https://app.onrender.com) and pre-appended URLs (e.g., https://app.onrender.com/api)
 * ensuring requests never fail due to missing or duplicate '/api' path segments.
 */
export const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (!envUrl || !envUrl.trim()) {
    return "http://localhost:5001/api";
  }

  let cleanUrl = envUrl.trim().replace(/\/+$/, "");
  if (!cleanUrl.endsWith("/api")) {
    cleanUrl = `${cleanUrl}/api`;
  }
  return cleanUrl;
};

const api = axios.create({
  baseURL: getApiBaseUrl(),
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
