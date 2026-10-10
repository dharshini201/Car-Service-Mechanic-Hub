import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import api from "../../services/api";

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalMechanics: 0,
    totalVehicles: 0,
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    totalServices: 0,
    totalCategories: 0,
  });

  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [dashRes, bookRes] = await Promise.all([
        api.get("/admin/dashboard"),
        api.get("/admin/bookings"),
      ]);

      if (dashRes.data?.success && dashRes.data.stats) {
        setStats(dashRes.data.stats);
      }

      if (bookRes.data?.success) {
        setRecentBookings((bookRes.data.bookings || []).slice(0, 5));
      }
    } catch (err) {
      console.error("Admin dashboard error:", err);
      setError("Failed to fetch administrative statistics from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const statusBadges = {
    Completed: "bg-success",
    Cancelled: "bg-danger",
    Pending: "bg-warning text-dark",
    "In Progress": "bg-info text-dark",
  };

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-3 col-lg-2 px-0">
          <Sidebar role="admin" />
        </div>

        {/* Main Content */}
        <main className="col-md-9 col-lg-10 py-4 px-4 bg-light min-vh-100">
          {/* Header */}
          <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
            <div>
              <h2 className="fw-bold mb-1 text-dark">Executive Command Center</h2>
              <p className="text-secondary mb-0">
                Real-time MongoDB operational metrics for MRT Car Service.
              </p>
            </div>
            <div className="d-flex gap-2">
              <Link
                to="/admin/mechanics"
                className="btn btn-danger rounded-pill px-3 py-2 fw-semibold shadow-sm"
              >
                <i className="bi bi-tools me-1"></i>
                Manage Mechanics
              </Link>
              <button
                type="button"
                className="btn btn-outline-primary rounded-pill px-3 py-2 fw-semibold"
                onClick={loadDashboardData}
              >
                <i className="bi bi-arrow-clockwise me-1"></i>
                Refresh Metrics
              </button>
            </div>
          </div>

          {error && (
            <div className="alert alert-danger d-flex align-items-center mb-4">
              <i className="bi bi-exclamation-octagon-fill me-2 fs-5"></i>
              <div>{error}</div>
            </div>
          )}

          {/* Primary 4 Metric Cards Required by Prompt */}
          <div className="row g-3 mb-4">
            {/* Total Users */}
            <div className="col-sm-6 col-xl-3">
              <div className="card border-0 shadow-sm rounded-4 p-3 bg-white h-100">
                <div className="d-flex align-items-center">
                  <div
                    className="rounded-4 p-3 me-3 text-primary d-flex align-items-center justify-content-center"
                    style={{ backgroundColor: "rgba(37, 99, 235, 0.1)", width: "56px", height: "56px" }}
                  >
                    <i className="bi bi-people-fill fs-3"></i>
                  </div>
                  <div>
                    <span className="text-secondary small fw-medium">Total Users</span>
                    <h3 className="fw-bold text-dark mb-0">{stats.totalUsers}</h3>
                    <small className="text-muted" style={{ fontSize: "11px" }}>Registered Customers</small>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Mechanics */}
            <div className="col-sm-6 col-xl-3">
              <div className="card border-0 shadow-sm rounded-4 p-3 bg-white h-100">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <div
                      className="rounded-4 p-3 me-3 text-info d-flex align-items-center justify-content-center"
                      style={{ backgroundColor: "rgba(6, 182, 212, 0.1)", width: "56px", height: "56px" }}
                    >
                      <i className="bi bi-person-gear fs-3"></i>
                    </div>
                    <div>
                      <span className="text-secondary small fw-medium">Total Mechanics</span>
                      <h3 className="fw-bold text-dark mb-0">{stats.totalMechanics}</h3>
                      <Link to="/admin/mechanics" className="text-decoration-none small text-primary fw-semibold" style={{ fontSize: "11px" }}>
                        Manage Team <i className="bi bi-arrow-right ms-1"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Vehicles */}
            <div className="col-sm-6 col-xl-3">
              <div className="card border-0 shadow-sm rounded-4 p-3 bg-white h-100">
                <div className="d-flex align-items-center">
                  <div
                    className="rounded-4 p-3 me-3 text-warning d-flex align-items-center justify-content-center"
                    style={{ backgroundColor: "rgba(245, 158, 11, 0.1)", width: "56px", height: "56px" }}
                  >
                    <i className="bi bi-car-front-fill fs-3"></i>
                  </div>
                  <div>
                    <span className="text-secondary small fw-medium">Total Vehicles</span>
                    <h3 className="fw-bold text-dark mb-0">{stats.totalVehicles}</h3>
                    <small className="text-muted" style={{ fontSize: "11px" }}>Fleet in System</small>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Bookings */}
            <div className="col-sm-6 col-xl-3">
              <div className="card border-0 shadow-sm rounded-4 p-3 bg-white h-100">
                <div className="d-flex align-items-center">
                  <div
                    className="rounded-4 p-3 me-3 text-success d-flex align-items-center justify-content-center"
                    style={{ backgroundColor: "rgba(16, 185, 129, 0.1)", width: "56px", height: "56px" }}
                  >
                    <i className="bi bi-calendar-check-fill fs-3"></i>
                  </div>
                  <div>
                    <span className="text-secondary small fw-medium">Total Bookings</span>
                    <h3 className="fw-bold text-dark mb-0">{stats.totalBookings}</h3>
                    <small className="text-muted" style={{ fontSize: "11px" }}>
                      {stats.pendingBookings} Pending | {stats.completedBookings} Done
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Management Short-links */}
          <div className="row g-3 mb-4">
            <div className="col-6 col-md-3">
              <Link to="/admin/bookings" className="card border-0 shadow-sm rounded-4 p-3 text-decoration-none text-dark bg-white hover-shadow transition-all">
                <div className="d-flex align-items-center">
                  <i className="bi bi-calendar-check text-primary fs-4 me-3"></i>
                  <div>
                    <strong className="d-block">Bookings</strong>
                    <small className="text-muted">Manage & Assign</small>
                  </div>
                </div>
              </Link>
            </div>
            <div className="col-6 col-md-3">
              <Link to="/admin/mechanics" className="card border-0 shadow-sm rounded-4 p-3 text-decoration-none text-dark bg-white hover-shadow transition-all">
                <div className="d-flex align-items-center">
                  <i className="bi bi-person-gear text-info fs-4 me-3"></i>
                  <div>
                    <strong className="d-block">Mechanics</strong>
                    <small className="text-muted">Add / Dispatch</small>
                  </div>
                </div>
              </Link>
            </div>
            <div className="col-6 col-md-3">
              <Link to="/admin/services" className="card border-0 shadow-sm rounded-4 p-3 text-decoration-none text-dark bg-white hover-shadow transition-all">
                <div className="d-flex align-items-center">
                  <i className="bi bi-tools text-warning fs-4 me-3"></i>
                  <div>
                    <strong className="d-block">Services</strong>
                    <small className="text-muted">Packages & Pricing</small>
                  </div>
                </div>
              </Link>
            </div>
            <div className="col-6 col-md-3">
              <Link to="/admin/reports" className="card border-0 shadow-sm rounded-4 p-3 text-decoration-none text-dark bg-white hover-shadow transition-all">
                <div className="d-flex align-items-center">
                  <i className="bi bi-bar-chart text-success fs-4 me-3"></i>
                  <div>
                    <strong className="d-block">Analytics</strong>
                    <small className="text-muted">Reports & Graphs</small>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Recent Service Bookings Table */}
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold text-dark mb-0">Recent Maintenance Requests</h5>
              <Link to="/admin/bookings" className="text-decoration-none text-primary small fw-semibold">
                View All Bookings <i className="bi bi-arrow-right ms-1"></i>
              </Link>
            </div>

            {loading ? (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status"></div>
              </div>
            ) : recentBookings.length === 0 ? (
              <p className="text-muted text-center py-4 mb-0">
                No recent bookings recorded yet.
              </p>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="py-3 text-secondary small fw-semibold">CUSTOMER</th>
                      <th className="py-3 text-secondary small fw-semibold">VEHICLE</th>
                      <th className="py-3 text-secondary small fw-semibold">SERVICE</th>
                      <th className="py-3 text-secondary small fw-semibold">ASSIGNED MECHANIC</th>
                      <th className="py-3 text-secondary small fw-semibold">STATUS</th>
                      <th className="py-3 text-secondary small fw-semibold text-end">DATE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentBookings.map((b) => (
                      <tr key={b._id}>
                        <td className="py-3">
                          <strong className="text-dark d-block">{b.customer?.name || "Customer"}</strong>
                          <small className="text-muted">{b.customer?.email}</small>
                        </td>
                        <td className="py-3">
                          <span className="text-dark fw-medium d-block">
                            {b.vehicle?.brand} {b.vehicle?.model}
                          </span>
                          <span className="font-monospace text-muted small">{b.vehicle?.vehicleNumber}</span>
                        </td>
                        <td className="py-3">
                          <span className="text-dark fw-medium">{b.service?.name}</span>
                          <span className="text-muted small d-block">
                            {b.service?.price !== undefined ? `₹${b.service.price}` : ""}
                          </span>
                        </td>
                        <td className="py-3">
                          {b.mechanic?.name ? (
                            <span className="badge bg-light text-dark border">
                              <i className="bi bi-person-check text-success me-1"></i>
                              {b.mechanic.name}
                            </span>
                          ) : (
                            <span className="badge bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25">
                              Unassigned
                            </span>
                          )}
                        </td>
                        <td className="py-3">
                          <span className={`badge px-3 py-2 rounded-pill ${statusBadges[b.status] || "bg-secondary"}`}>
                            {b.status}
                          </span>
                        </td>
                        <td className="py-3 text-secondary small text-end">
                          {b.bookingDate ? new Date(b.bookingDate).toLocaleDateString() : "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;