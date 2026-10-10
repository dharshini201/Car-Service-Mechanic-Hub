import api from "./api";

// ================= GET USER PROFILE =================
export const getUserProfile = async () => {
  const response = await api.get("/users/profile");
  return response.data;
};

// ================= UPDATE USER PROFILE =================
export const updateUserProfile = async (userData) => {
  const response = await api.put("/users/profile", userData);
  return response.data;
};

// ================= GET ALL USERS (ADMIN) =================
export const getAllUsers = async () => {
  const response = await api.get("/admin/users");
  return response.data;
};

// ================= DELETE USER (ADMIN) =================
export const deleteUser = async (userId) => {
  const response = await api.delete(`/users/${userId}`);
  return response.data;
};