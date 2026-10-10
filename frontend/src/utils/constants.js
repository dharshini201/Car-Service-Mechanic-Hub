// ================= API CONFIGURATION =================

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5001/api";

// ================= USER ROLES =================

export const ROLES = {
  CUSTOMER: "customer",
  MECHANIC: "mechanic",
  ADMIN: "admin",
};

// ================= BOOKING STATUS =================

export const BOOKING_STATUS = {
  PENDING: "Pending",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

// ================= FUEL TYPES =================

export const FUEL_TYPES = [
  "Petrol",
  "Diesel",
  "CNG",
  "Electric",
  "Hybrid",
];

// ================= VEHICLE YEARS =================

export const VEHICLE_YEARS = Array.from(
  { length: 30 },
  (_, index) => new Date().getFullYear() - index
);

// ================= SERVICE TYPES =================

export const SERVICE_TYPES = [
  {
    id: "engine",
    name: "Engine Service",
    icon: "bi-gear-wide-connected",
  },
  {
    id: "brake",
    name: "Brake Service",
    icon: "bi-disc",
  },
  {
    id: "battery",
    name: "Battery Service",
    icon: "bi-battery-half",
  },
  {
    id: "oil",
    name: "Oil Change",
    icon: "bi-droplet-half",
  },
  {
    id: "ac",
    name: "AC Service",
    icon: "bi-snow",
  },
  {
    id: "general",
    name: "General Service",
    icon: "bi-tools",
  },
];

// ================= PAGINATION =================

export const DEFAULT_PAGE_SIZE = 10;

// ================= LOCAL STORAGE KEYS =================

export const STORAGE_KEYS = {
  TOKEN: "token",
  USER: "user",
  VEHICLES: "vehicles",
  BOOKINGS: "bookings",
  NOTIFICATIONS: "notifications",
  SERVICE_HISTORY: "serviceHistory",
  ADMIN_SETTINGS: "adminSettings",
  ACTIVITIES: "activities",
};