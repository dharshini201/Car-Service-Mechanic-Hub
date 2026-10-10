import api from "./api";

// ================= MECHANIC AUTH =================
export const mechanicLogin = async (credentials) => {
  const response = await api.post("/mechanics/login", credentials);
  return response.data;
};

// ================= MECHANIC PROFILE =================
export const getMechanicProfile = async () => {
  const response = await api.get("/mechanics/profile");
  return response.data;
};

export const updateMechanicProfile = async (profileData) => {
  const response = await api.put("/mechanics/profile", profileData);
  return response.data;
};

// ================= GET ALL MECHANICS (ADMIN) =================
export const getMechanics = async () => {
  const response = await api.get("/mechanics");
  return response.data;
};

// ================= GET SINGLE MECHANIC (ADMIN) =================
export const getMechanicById = async (mechanicId) => {
  const response = await api.get(`/mechanics/${mechanicId}`);
  return response.data;
};

// ================= ADD MECHANIC (ADMIN) =================
export const addMechanic = async (mechanicData) => {
  const response = await api.post("/mechanics", mechanicData);
  return response.data;
};

// ================= UPDATE MECHANIC (ADMIN) =================
export const updateMechanic = async (mechanicId, mechanicData) => {
  const response = await api.put(
    `/mechanics/${mechanicId}`,
    mechanicData
  );
  return response.data;
};

// ================= DELETE MECHANIC (ADMIN) =================
export const deleteMechanic = async (mechanicId) => {
  const response = await api.delete(`/mechanics/${mechanicId}`);
  return response.data;
};

// ================= GET ASSIGNED SERVICES =================
export const getAssignedServices = async (params) => {
  const response = await api.get("/mechanics/assigned-services", { params });
  return response.data;
};

// ================= GET SINGLE ASSIGNED BOOKING =================
export const getAssignedBookingById = async (bookingId) => {
  const response = await api.get(`/mechanics/bookings/${bookingId}`);
  return response.data;
};

// ================= GET MECHANIC DASHBOARD STATS =================
export const getMechanicDashboard = async () => {
  const response = await api.get("/mechanics/dashboard");
  return response.data;
};

// ================= UPDATE SERVICE STATUS =================
export const updateServiceStatus = async (serviceId, statusData) => {
  // Supports both string (status) or object ({ status, mechanicNotes })
  const payload = typeof statusData === "string" ? { status: statusData } : statusData;
  const response = await api.put(
    `/mechanics/service/${serviceId}/status`,
    payload
  );
  return response.data;
};

// ================= PENDING OFFERS (ACCEPT / REJECT) =================
export const getPendingOffers = async () => {
  const response = await api.get("/mechanics/offers");
  return response.data;
};

export const acceptOffer = async (bookingId) => {
  const response = await api.put(`/mechanics/offers/${bookingId}/accept`);
  return response.data;
};

export const rejectOffer = async (bookingId, reason = "") => {
  const response = await api.put(`/mechanics/offers/${bookingId}/reject`, { reason });
  return response.data;
};