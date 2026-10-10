import api from "./api";

// ================= REGISTER =================
export const registerUser = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

// ================= LOGIN =================
export const loginUser = async (loginData) => {
  const response = await api.post("/auth/login", loginData);
  return response.data;
};

// ================= FORGOT PASSWORD =================
export const forgotPassword = async (email) => {
  const response = await api.post("/auth/forgot-password", {
    email,
  });
  return response.data;
};

// ================= RESET PASSWORD =================
export const resetPassword = async (token, password, confirmPassword) => {
  const response = await api.post(`/auth/reset-password/${token}`, {
    password,
    confirmPassword,
  });
  return response.data;
};

// ================= LOGOUT =================
export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// ================= GET CURRENT USER =================
export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};