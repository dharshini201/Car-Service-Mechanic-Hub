import api from "./api";

// ================= GET ALL BOOKINGS =================
export const getBookings = async () => {
  const response = await api.get("/bookings");
  return response.data;
};

// ================= GET SINGLE BOOKING =================
export const getBookingById = async (bookingId) => {
  const response = await api.get(`/bookings/${bookingId}`);
  return response.data;
};

// ================= CREATE BOOKING =================
export const createBooking = async (bookingData) => {
  const response = await api.post("/bookings", bookingData);
  return response.data;
};

// ================= UPDATE BOOKING =================
export const updateBooking = async (bookingId, bookingData) => {
  const response = await api.put(
    `/bookings/${bookingId}`,
    bookingData
  );
  return response.data;
};

// ================= CANCEL BOOKING =================
export const cancelBooking = async (bookingId) => {
  const response = await api.put(
    `/bookings/${bookingId}/cancel`
  );
  return response.data;
};

// ================= DELETE BOOKING =================
export const deleteBooking = async (bookingId) => {
  const response = await api.delete(`/bookings/${bookingId}`);
  return response.data;
};

// ================= GET SERVICE HISTORY =================
export const getServiceHistory = async () => {
  const response = await api.get("/bookings/history");
  return response.data;
};

// ================= GET ALL BOOKINGS (ADMIN) =================
export const getAllBookingsAdmin = async (params) => {
  const response = await api.get("/admin/bookings", { params });
  return response.data;
};

// ================= REASSIGN BOOKING (ADMIN) =================
export const reassignBookingAdmin = async (bookingId, payloadOrMechanicId) => {
  let body = {};
  if (payloadOrMechanicId && typeof payloadOrMechanicId === "object") {
    body = payloadOrMechanicId;
  } else if (typeof payloadOrMechanicId === "string" && payloadOrMechanicId.trim()) {
    body = { mechanicId: payloadOrMechanicId.trim() };
  } else {
    body = { auto: true };
  }
  const response = await api.post(`/admin/bookings/${bookingId}/reassign`, body);
  return response.data;
};