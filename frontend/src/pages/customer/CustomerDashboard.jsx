import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import BookingCard from "../../components/BookingCard";
import VehicleCard from "../../components/VehicleCard";
import { getUserProfile } from "../../services/userService";
import { getVehicles, deleteVehicle } from "../../services/vehicleService";
import { getBookings, cancelBooking } from "../../services/bookingService";

function CustomerDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [userRes, vehiclesRes, bookingsRes] = await Promise.allSettled([
        getUserProfile(),
        getVehicles(),
        getBookings(),
      ]);

      if (userRes.status === "fulfilled" && userRes.value?.user) {
        setUser(userRes.value.user);
      } else {
        const stored = localStorage.getItem("user");
        if (stored) setUser(JSON.parse(stored));
      }

      if (vehiclesRes.status === "fulfilled") {
        setVehicles(vehiclesRes.value?.vehicles || []);
      }

      if (bookingsRes.status === "fulfilled") {
        setBookings(bookingsRes.value?.bookings || []);
      }
    } catch (err) {
      console.error("Dashboard loading error:", err);
      setError("Failed to load dashboard data. Please refresh.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleCancelBooking = async (booking) => {
    const id = booking._id || booking.id;
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    try {
      await cancelBooking(id);
      loadDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel booking.");
    }
  };

  const handleDeleteVehicle = async (vehicle) => {
    const id = vehicle._id || vehicle.id;
    if (!window.confirm(`Delete ${vehicle.brand} ${vehicle.model}?`)) return;

    try {
      await deleteVehicle(id);
      loadDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete vehicle.");
    }
  };

  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter((b) => b.status === "Pending").length;
  const inProgressBookings = bookings.filter((b) =>
    ["In Service", "In Progress"].includes(b.status)
  ).length;
  const readyForPickupBookings = bookings.filter(
    (b) => b.status === "Ready for Pickup"
  ).length;
  const completedBookings = bookings.filter((b) => b.status === "Completed").length;

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-3 col-lg-2 px-0">
          <Sidebar role="customer" />
        </div>

        {/* Main Content */}
        <main className="col-md-9 col-lg-10 py-4 px-4 bg-light min-vh-100">
          {/* Header */}
          <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
            <div>
              <h2 className="fw-bold mb-1 text-dark">
                Welcome, {user?.name || "Customer"}!
              </h2>
              <p className="text-secondary mb-0">
                Manage your vehicles, bookings, and track maintenance records in real time.
              </p>
            </div>
            <div className="d-flex gap-2">
              <Link to="/customer/add-vehicle" className="btn btn-outline-primary rounded-pill px-3 py-2 fw-semibold">
                <i className="bi bi-car-front me-2"></i>Add Vehicle
              </Link>
              <Link to="/customer/book-service" className="btn btn-primary rounded-pill px-4 py-2 fw-semibold shadow-sm">
                <i className="bi bi-calendar-plus me-2"></i>Book Service
              </Link>
            </div>
          </div>

          {/* Special Banner if any car is Ready for Pickup */}
          {readyForPickupBookings > 0 && (
            <div
              className="alert border-0 text-white rounded-4 p-3 mb-4 shadow-sm d-flex align-items-center justify-content-between"
              style={{ background: "linear-gradient(135deg, #059669 0%, #10b981 100%)" }}
            >
              <div className="d-flex align-items-center gap-3">
                <div
                  className="rounded-circle bg-white text-success d-flex align-items-center justify-content-center fw-bold"
                  style={{ width: "45px", height: "45px" }}
                >
                  <i className="bi bi-car-front-fill fs-5"></i>
                </div>
                <div>
                  <h6 className="fw-bold mb-0">
                    Your Car is Ready for Pickup ({readyForPickupBookings} {readyForPickupBookings === 1 ? "Vehicle" : "Vehicles"})
                  </h6>
                  <small className="text-white-50">
                    Service completed! Please visit Car Service &amp; Mechanic Hub to collect your vehicle.
                  </small>
                </div>
              </div>
              <Link
                to="/customer/bookings"
                className="btn btn-sm btn-light text-success fw-bold rounded-pill px-3 shadow-sm"
              >
                View Details
              </Link>
            </div>
          )}

          {error && (
            <div className="alert alert-danger d-flex align-items-center mb-4">
              <i className="bi bi-exclamation-octagon-fill me-2 fs-5"></i>
              <div>{error}</div>
            </div>
          )}

          {/* Stats Cards */}
          <div className="row g-3 mb-4">
            <div className="col-sm-6 col-xl-3">
              <div className="card border-0 shadow-sm rounded-4 p-3 h-100 bg-white">
                <div className="d-flex align-items-center">
                  <div
                    className="rounded-4 p-3 me-3 text-primary d-flex align-items-center justify-content-center"
                    style={{ backgroundColor: "rgba(37, 99, 235, 0.1)", width: "56px", height: "56px" }}
                  >
                    <i className="bi bi-car-front-fill fs-3"></i>
                  </div>
                  <div>
                    <span className="text-secondary small fw-medium">My Vehicles</span>
                    <h3 className="fw-bold text-dark mb-0">{vehicles.length}</h3>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-sm-6 col-xl-3">
              <div className="card border-0 shadow-sm rounded-4 p-3 h-100 bg-white">
                <div className="d-flex align-items-center">
                  <div
                    className="rounded-4 p-3 me-3 text-warning d-flex align-items-center justify-content-center"
                    style={{ backgroundColor: "rgba(245, 158, 11, 0.1)", width: "56px", height: "56px" }}
                  >
                    <i className="bi bi-hourglass-split fs-3"></i>
                  </div>
                  <div>
                    <span className="text-secondary small fw-medium">Pending Services</span>
                    <h3 className="fw-bold text-dark mb-0">{pendingBookings}</h3>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-sm-6 col-xl-3">
              <div className="card border-0 shadow-sm rounded-4 p-3 h-100 bg-white">
                <div className="d-flex align-items-center">
                  <div
                    className="rounded-4 p-3 me-3 text-info d-flex align-items-center justify-content-center"
                    style={{ backgroundColor: "rgba(6, 182, 212, 0.1)", width: "56px", height: "56px" }}
                  >
                    <i className="bi bi-gear-wide-connected fs-3"></i>
                  </div>
                  <div>
                    <span className="text-secondary small fw-medium">In Progress</span>
                    <h3 className="fw-bold text-dark mb-0">{inProgressBookings}</h3>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-sm-6 col-xl-3">
              <div className="card border-0 shadow-sm rounded-4 p-3 h-100 bg-white">
                <div className="d-flex align-items-center">
                  <div
                    className="rounded-4 p-3 me-3 text-success d-flex align-items-center justify-content-center"
                    style={{ backgroundColor: "rgba(16, 185, 129, 0.1)", width: "56px", height: "56px" }}
                  >
                    <i className="bi bi-check2-circle fs-3"></i>
                  </div>
                  <div>
                    <span className="text-secondary small fw-medium">Completed</span>
                    <h3 className="fw-bold text-dark mb-0">{completedBookings}</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Active Bookings Section */}
          <div className="mb-5">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="fw-bold text-dark mb-0">Recent Service Bookings</h4>
              <Link to="/customer/bookings" className="text-decoration-none small fw-semibold text-primary">
                View All Bookings ({totalBookings}) &rarr;
              </Link>
            </div>

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status"></div>
                <p className="mt-2 text-muted small">Loading bookings...</p>
              </div>
            ) : bookings.length === 0 ? (
              <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
                <i className="bi bi-calendar-x text-muted" style={{ fontSize: "50px" }}></i>
                <h5 className="fw-bold mt-3 text-dark">No Bookings Yet</h5>
                <p className="text-secondary small mb-3">
                  You haven't scheduled any car services yet. Keep your vehicle in top condition today!
                </p>
                <div>
                  <Link to="/customer/book-service" className="btn btn-primary rounded-pill px-4">
                    Book Your First Service
                  </Link>
                </div>
              </div>
            ) : (
              <div className="row g-3">
                {bookings.slice(0, 3).map((booking) => (
                  <div className="col-md-6 col-lg-4" key={booking._id || booking.id}>
                    <BookingCard
                      booking={booking}
                      onView={(b) => navigate(`/customer/booking/${b._id || b.id}`)}
                      onCancel={handleCancelBooking}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* My Vehicles Section */}
          <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="fw-bold text-dark mb-0">My Registered Vehicles</h4>
              <Link to="/customer/vehicles" className="text-decoration-none small fw-semibold text-primary">
                Manage Vehicles ({vehicles.length}) &rarr;
              </Link>
            </div>

            {loading ? (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status"></div>
              </div>
            ) : vehicles.length === 0 ? (
              <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
                <i className="bi bi-car-front text-muted" style={{ fontSize: "50px" }}></i>
                <h5 className="fw-bold mt-3 text-dark">No Registered Vehicles</h5>
                <p className="text-secondary small mb-3">
                  Add your vehicle details to start booking maintenance services easily.
                </p>
                <div>
                  <Link to="/customer/add-vehicle" className="btn btn-outline-primary rounded-pill px-4">
                    Add Vehicle
                  </Link>
                </div>
              </div>
            ) : (
              <div className="row g-3">
                {vehicles.slice(0, 3).map((v) => (
                  <div className="col-md-6 col-lg-4" key={v._id || v.id}>
                    <VehicleCard
                      vehicle={v}
                      onEdit={(item) => navigate(`/customer/edit-vehicle/${item._id || item.id}`)}
                      onDelete={handleDeleteVehicle}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default CustomerDashboard;