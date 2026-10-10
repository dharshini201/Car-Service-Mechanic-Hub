import api from "./api";

// ================= GET ALL SERVICES =================
export const getServices = async () => {
  const response = await api.get("/services");
  return response.data;
};

// ================= GET SINGLE SERVICE =================
export const getServiceById = async (serviceId) => {
  const response = await api.get(`/services/${serviceId}`);
  return response.data;
};

// ================= ADD SERVICE =================
export const addService = async (serviceData) => {
  const response = await api.post("/services", serviceData);
  return response.data;
};

// ================= UPDATE SERVICE =================
export const updateService = async (serviceId, serviceData) => {
  const response = await api.put(
    `/services/${serviceId}`,
    serviceData
  );
  return response.data;
};

// ================= DELETE SERVICE =================
export const deleteService = async (serviceId) => {
  const response = await api.delete(`/services/${serviceId}`);
  return response.data;
};

// ================= GET ALL CATEGORIES (ADMIN) =================
export const getCategories = async () => {
  const response = await api.get("/admin/categories");
  return response.data;
};

// ================= ADD CATEGORY (ADMIN) =================
export const addCategory = async (categoryData) => {
  const response = await api.post("/admin/categories", categoryData);
  return response.data;
};

// ================= UPDATE CATEGORY (ADMIN) =================
export const updateCategory = async (categoryId, categoryData) => {
  const response = await api.put(`/admin/categories/${categoryId}`, categoryData);
  return response.data;
};

// ================= DELETE CATEGORY (ADMIN) =================
export const deleteCategory = async (categoryId) => {
  const response = await api.delete(`/admin/categories/${categoryId}`);
  return response.data;
};