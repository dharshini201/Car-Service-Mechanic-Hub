import { Routes, Route, useLocation, Navigate, useParams } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

// ================= PUBLIC PAGES =================

import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import ServiceDetails from "./pages/ServiceDetails";
import Contact from "./pages/Contact";

// ================= AUTHENTICATION =================

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

// ================= CUSTOMER PAGES =================

import CustomerDashboard from "./pages/customer/CustomerDashboard";
import Profile from "./pages/customer/Profile";
import EditProfile from "./pages/customer/EditProfile";
import Vehicles from "./pages/customer/Vehicles";
import AddVehicle from "./pages/customer/AddVehicle";
import EditVehicle from "./pages/customer/EditVehicle";
import BookService from "./pages/customer/BookService";
import MyBookings from "./pages/customer/MyBookings";
import BookingDetails from "./pages/customer/BookingDetails";
import ServiceHistory from "./pages/customer/ServiceHistory";
import Notifications from "./pages/customer/Notifications";

import MechanicProtectedRoute from "./components/MechanicProtectedRoute";

// ================= MECHANIC PAGES =================

import MechanicLogin from "./pages/mechanic/MechanicLogin";
import MechanicDashboard from "./pages/mechanic/MechanicDashboard";
import MechanicProfile from "./pages/mechanic/MechanicProfile";
import ServiceRequests from "./pages/mechanic/ServiceRequests";
import RequestDetails from "./pages/mechanic/RequestDetails";
import AssignedServices from "./pages/mechanic/AssignedServices";
import UpdateServiceStatus from "./pages/mechanic/UpdateServiceStatus";
import MechanicServiceHistory from "./pages/mechanic/ServiceHistory";

// ================= ADMIN PAGES =================

import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageMechanics from "./pages/admin/ManageMechanics";
import ManageVehicles from "./pages/admin/ManageVehicles";
import ManageServices from "./pages/admin/ManageServices";
import ManageBookings from "./pages/admin/ManageBookings";
import ManageCategories from "./pages/admin/ManageCategories";
import Reports from "./pages/admin/Reports";
import Activity from "./pages/admin/Activity";
import Settings from "./pages/admin/Settings";

function BookingRedirect() {
  const { user, isAuthenticated } = useAuth();
  const { bookingId } = useParams();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role === "admin") return <Navigate to="/admin/bookings" replace />;
  if (user?.role === "mechanic") return <Navigate to={bookingId ? `/mechanic/bookings/${bookingId}` : "/mechanic/dashboard"} replace />;
  return <Navigate to={bookingId ? `/customer/booking/${bookingId}` : "/customer/bookings"} replace />;
}

function App() {
  const location = useLocation();

  const isDashboard =
    location.pathname.startsWith("/customer") ||
    (location.pathname.startsWith("/mechanic") &&
      location.pathname !== "/mechanic/login") ||
    (location.pathname.startsWith("/admin") &&
      location.pathname !== "/admin/login") ||
    location.pathname.startsWith("/booking");

  const isAuth =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname.startsWith("/forgot-password") ||
    location.pathname.startsWith("/reset-password") ||
    location.pathname === "/mechanic/login" ||
    location.pathname === "/admin/login";

  return (
    <>
      {!isDashboard && <Navbar />}

      <Routes>

        {/* ================================================== */}
        {/* PUBLIC PAGES */}
        {/* ================================================== */}

        <Route path="/" element={<Home />} />

        <Route
          path="/about"
          element={<About />}
        />

        <Route
          path="/services"
          element={<Services />}
        />

        <Route
          path="/services/:serviceId"
          element={<ServiceDetails />}
        />

        <Route
          path="/contact"
          element={<Contact />}
        />

        {/* Global Booking Route Redirection based on verified role */}
        <Route path="/bookings" element={<BookingRedirect />} />
        <Route path="/bookings/:bookingId" element={<BookingRedirect />} />
        <Route path="/booking/:bookingId" element={<BookingRedirect />} />

        {/* ================================================== */}
        {/* AUTHENTICATION */}
        {/* ================================================== */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/reset-password/:token"
          element={<ResetPassword />}
        />

        <Route
          path="/reset-password"
          element={<ResetPassword />}
        />


        {/* ================================================== */}
        {/* CUSTOMER ROUTES */}
        {/* ================================================== */}

        <Route
          element={
            <ProtectedRoute allowedRoles={["customer"]} />
          }
        >

          <Route
            path="/customer/dashboard"
            element={<CustomerDashboard />}
          />

          <Route
            path="/customer/profile"
            element={<Profile />}
          />

          <Route
            path="/customer/edit-profile"
            element={<EditProfile />}
          />

          <Route
            path="/customer/vehicles"
            element={<Vehicles />}
          />

          <Route
            path="/customer/add-vehicle"
            element={<AddVehicle />}
          />

          <Route
            path="/customer/edit-vehicle/:vehicleId"
            element={<EditVehicle />}
          />

          <Route
            path="/customer/book-service"
            element={<BookService />}
          />

          <Route
            path="/customer/bookings"
            element={<MyBookings />}
          />

          <Route
            path="/customer/booking/:bookingId"
            element={<BookingDetails />}
          />

          <Route
            path="/customer/service-history"
            element={<ServiceHistory />}
          />

          <Route
            path="/customer/notifications"
            element={<Notifications />}
          />

        </Route>


        {/* ================================================== */}
        {/* MECHANIC LOGIN (PUBLIC) */}
        {/* ================================================== */}

        <Route
          path="/mechanic/login"
          element={<MechanicLogin />}
        />


        {/* ================================================== */}
        {/* MECHANIC ROUTES (PROTECTED) */}
        {/* ================================================== */}

        <Route
          element={
            <ProtectedRoute allowedRoles={["mechanic"]} />
          }
        >

          <Route
            path="/mechanic/dashboard"
            element={<MechanicDashboard />}
          />

          <Route
            path="/mechanic/service-requests"
            element={<ServiceRequests />}
          />

          <Route
            path="/mechanic/request/:requestId"
            element={<RequestDetails />}
          />

          <Route
            path="/mechanic/assigned-services"
            element={<AssignedServices />}
          />

          <Route
            path="/mechanic/update-status/:serviceId"
            element={<UpdateServiceStatus />}
          />

          <Route
            path="/mechanic/service-history"
            element={<MechanicServiceHistory />}
          />

          <Route
            path="/mechanic/profile"
            element={<MechanicProfile />}
          />

          <Route
            path="/mechanic/bookings"
            element={<AssignedServices />}
          />

          <Route
            path="/mechanic/bookings/:requestId"
            element={<RequestDetails />}
          />

        </Route>


        {/* ================================================== */}
        {/* ADMIN LOGIN */}
        {/* ================================================== */}

        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />


        {/* ================================================== */}
        {/* ADMIN ROUTES */}
        {/* ================================================== */}

        <Route
          element={
            <ProtectedRoute allowedRoles={["admin"]} />
          }
        >

          {/* Admin Dashboard */}

          <Route
            path="/admin/dashboard"
            element={<AdminDashboard />}
          />


          {/* Manage Users */}

          <Route
            path="/admin/users"
            element={<ManageUsers />}
          />


          {/* Manage Mechanics */}

          <Route
            path="/admin/mechanics"
            element={<ManageMechanics />}
          />


          {/* Manage Vehicles */}

          <Route
            path="/admin/vehicles"
            element={<ManageVehicles />}
          />


          {/* Manage Services */}

          <Route
            path="/admin/services"
            element={<ManageServices />}
          />


          {/* Manage Bookings */}

          <Route
            path="/admin/bookings"
            element={<ManageBookings />}
          />
          <Route
            path="/admin/bookings/:bookingId"
            element={<ManageBookings />}
          />


          {/* Manage Categories */}

          <Route
            path="/admin/categories"
            element={<ManageCategories />}
          />


          {/* Reports */}

          <Route
            path="/admin/reports"
            element={<Reports />}
          />


          {/* Activity */}

          <Route
            path="/admin/activity"
            element={<Activity />}
          />


          {/* Settings */}

          <Route
            path="/admin/settings"
            element={<Settings />}
          />

        </Route>

      </Routes>

      {!isDashboard && !isAuth && <Footer />}
    </>
  );
}

export default App;