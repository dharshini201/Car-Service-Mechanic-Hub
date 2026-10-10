const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const vehicleRoutes = require("./routes/vehicleRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const mechanicRoutes = require("./routes/mechanicRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const adminRoutes = require("./routes/adminRoutes");
const contactRoutes = require("./routes/contactRoutes");

// Error Middleware
const {
  notFound,
  errorHandler,
} = require("./middleware/errorMiddleware");

const app = express();

// ================= DATABASE =================

connectDB();

// ================= MIDDLEWARE =================

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Standard security headers
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  next();
});

// ================= TEST ROUTE =================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Car Service Mechanic Hub Backend is running!",
  });
});

// ================= API ROUTES =================

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/mechanics", mechanicRoutes);
app.use("/api/mechanic", mechanicRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", adminRoutes);

// Contact Routes
app.use("/api/contact", contactRoutes);

// ================= ERROR HANDLING =================

app.use(notFound);
app.use(errorHandler);

// ================= SERVER =================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT}`
  );
});

module.exports = app;