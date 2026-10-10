import api from "./api";

// ================= GET ALL VEHICLES =================
export const getVehicles = async () => {
  const response = await api.get("/vehicles");
  return response.data;
};

// ================= GET SINGLE VEHICLE =================
export const getVehicleById = async (vehicleId) => {
  const response = await api.get(`/vehicles/${vehicleId}`);
  return response.data;
};

// ================= ADD VEHICLE =================
export const addVehicle = async (vehicleData) => {
  const response = await api.post("/vehicles", vehicleData);
  return response.data;
};

// ================= UPDATE VEHICLE =================
export const updateVehicle = async (vehicleId, vehicleData) => {
  const response = await api.put(
    `/vehicles/${vehicleId}`,
    vehicleData
  );
  return response.data;
};

// ================= DELETE VEHICLE =================
export const deleteVehicle = async (vehicleId) => {
  const response = await api.delete(`/vehicles/${vehicleId}`);
  return response.data;
};

// ================= GET ALL VEHICLES (ADMIN) =================
export const getAllVehiclesAdmin = async () => {
  const response = await api.get("/admin/vehicles");
  return response.data;
};