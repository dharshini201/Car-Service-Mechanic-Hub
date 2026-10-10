import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import api from "../../services/api";
import { getBookings } from "../../services/bookingService";
import { getAllVehiclesAdmin } from "../../services/vehicleService";

function Reports() {
  const [reportData, setReportData] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError("");

      const [repRes, bookRes, vehRes] = await Promise.all([
        api.get("/admin/reports").catch(() => ({ data: { reports: null } })),
        getBookings().catch(() => ({ bookings: [] })),
        getAllVehiclesAdmin().catch(() => ({ vehicles: [] })),
      ]);

      setReportData(repRes.data?.reports || null);
      const bList = bookRes?.bookings || (Array.isArray(bookRes) ? bookRes : []);
      setBookings(bList);
      const vList = vehRes?.vehicles || (Array.isArray(vehRes) ? vehRes : []);
      setVehicles(vList);
    } catch (err) {
      console.error("Reports Fetch Error:", err);
      setError(err?.response?.data?.message || err.message || "Failed to load reports.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // Compute metrics
  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter((b) => b.status === "Pending").length;
  const inProgressBookings = bookings.filter((b) => b.status === "In Progress").length;
  const completedBookings = bookings.filter((b) => b.status === "Completed").length;
  const cancelledBookings = bookings.filter((b) => b.status === "Cancelled").length;

  const totalRevenue = bookings
    .filter((b) => b.status === "Completed")
    .reduce((acc, b) => acc + (b.service?.price || 0), 0);

  const potentialRevenue = bookings
    .filter((b) => b.status !== "Cancelled")
    .reduce((acc, b) => acc + (b.service?.price || 0), 0);

  const completionRate =
    totalBookings > 0 ? Math.round((completedBookings / totalBookings) * 100) : 0;

  // Vehicle fuel distribution
  const fuelCounts = {};
  vehicles.forEach((v) => {
    const f = v.fuelType || "Petrol";
    fuelCounts[f] = (fuelCounts[f] || 0) + 1;
  });

  // Top services
  const serviceCounts = {};
  bookings.forEach((b) => {
    const name = b.service?.name || "Standard Maintenance";
    serviceCounts[name] = (serviceCounts[name] || 0) + 1;
  });
  const topServices = Object.entries(serviceCounts).sort((a, b) => b[1] - a[1]);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8f9fc" }}>
      <div className="d-flex" style={{ minHeight: "100vh" }}>
        {/* Sidebar */}
        <aside
          style={{
            width: "280px",
            minWidth: "280px",
            backgroundColor: "#1e293b",
            position: "sticky",
            top: 0,
            height: "100vh",
            overflowY: "auto",
          }}
        >
          <Sidebar role="admin" />
        </aside>

        {/* Main Content */}
        <main className="flex-grow-1 p-4" style={{ minWidth: 0 }}>
          <div style={{ maxWidth: "1600px", margin: "0 auto" }}>
            {/* Header */}
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
              <div>
                <span className="badge bg-danger-subtle text-danger px-3 py-1 mb-1 fw-semibold">
                  Business Intelligence
                </span>
                <h2 className="fw-bold mb-1" style={{ color: "#0f172a" }}>
                  Hub Analytics & Reports
                </h2>
                <p className="text-muted mb-0">
                  Comprehensive performance metrics, revenue realization, and service demand trends.
                </p>
              </div>

              <div className="d-flex gap-2">
                <button
                  className="btn btn-outline-secondary d-flex align-items-center gap-2"
                  onClick={fetchReports}
                >
                  <i className="bi bi-arrow-clockwise"></i> Refresh Analytics
                </button>
                <Link to="/admin/dashboard" className="btn btn-outline-dark">
                  <i className="bi bi-arrow-left me-1"></i> Dashboard
                </Link>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="alert alert-danger shadow-sm">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                {error}
              </div>
            )}

            {loading ? (
              <div className="card border-0 shadow-sm text-center py-5">
                <div className="spinner-border text-danger mx-auto mb-3" role="status"></div>
                <p className="text-muted mb-0">Aggregating database statistics and logs...</p>
              </div>
            ) : (
              <>
                {/* Financial & Completion KPI Cards */}
                <div className="row g-3 mb-4">
                  <div className="col-sm-6 col-xl-3">
                    <div className="card border-0 shadow-sm p-3 bg-white rounded-3">
                      <div className="d-flex align-items-center justify-content-between">
                        <div>
                          <small className="text-muted text-uppercase fw-semibold">Realized Revenue</small>
                          <h3 className="fw-bold mb-0 text-success mt-1">
                            ₹{totalRevenue.toLocaleString()}
                          </h3>
                        </div>
                        <div className="p-3 bg-success-subtle text-success rounded-circle">
                          <i className="bi bi-cash-stack fs-4"></i>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-sm-6 col-xl-3">
                    <div className="card border-0 shadow-sm p-3 bg-white rounded-3">
                      <div className="d-flex align-items-center justify-content-between">
                        <div>
                          <small className="text-muted text-uppercase fw-semibold">Pipeline Value</small>
                          <h3 className="fw-bold mb-0 text-primary mt-1">
                            ₹{potentialRevenue.toLocaleString()}
                          </h3>
                        </div>
                        <div className="p-3 bg-primary-subtle text-primary rounded-circle">
                          <i className="bi bi-graph-up-arrow fs-4"></i>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-sm-6 col-xl-3">
                    <div className="card border-0 shadow-sm p-3 bg-white rounded-3">
                      <div className="d-flex align-items-center justify-content-between">
                        <div>
                          <small className="text-muted text-uppercase fw-semibold">Total Bookings</small>
                          <h3 className="fw-bold mb-0 text-dark mt-1">{totalBookings}</h3>
                        </div>
                        <div className="p-3 bg-secondary-subtle text-secondary rounded-circle">
                          <i className="bi bi-calendar2-range fs-4"></i>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-sm-6 col-xl-3">
                    <div className="card border-0 shadow-sm p-3 bg-white rounded-3">
                      <div className="d-flex align-items-center justify-content-between">
                        <div>
                          <small className="text-muted text-uppercase fw-semibold">Completion Rate</small>
                          <h3 className="fw-bold mb-0 text-danger mt-1">{completionRate}%</h3>
                        </div>
                        <div className="p-3 bg-danger-subtle text-danger rounded-circle">
                          <i className="bi bi-pie-chart-fill fs-4"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Breakdown & Fuel Fleet */}
                <div className="row g-4 mb-4">
                  {/* Service Status Breakdown */}
                  <div className="col-lg-6">
                    <div className="card border-0 shadow-sm h-100">
                      <div className="card-body p-4">
                        <h5 className="fw-bold mb-3 text-dark">
                          <i className="bi bi-clipboard2-pulse text-danger me-2"></i>
                          Booking Status Breakdown
                        </h5>

                        <div className="mb-3">
                          <div className="d-flex justify-content-between mb-1">
                            <span className="fw-semibold">Completed ({completedBookings})</span>
                            <span className="text-muted">
                              {totalBookings ? Math.round((completedBookings / totalBookings) * 100) : 0}%
                            </span>
                          </div>
                          <div className="progress" style={{ height: "10px" }}>
                            <div
                              className="progress-bar bg-success"
                              style={{
                                width: `${totalBookings ? (completedBookings / totalBookings) * 100 : 0}%`,
                              }}
                            ></div>
                          </div>
                        </div>

                        <div className="mb-3">
                          <div className="d-flex justify-content-between mb-1">
                            <span className="fw-semibold">In Progress ({inProgressBookings})</span>
                            <span className="text-muted">
                              {totalBookings ? Math.round((inProgressBookings / totalBookings) * 100) : 0}%
                            </span>
                          </div>
                          <div className="progress" style={{ height: "10px" }}>
                            <div
                              className="progress-bar bg-warning"
                              style={{
                                width: `${totalBookings ? (inProgressBookings / totalBookings) * 100 : 0}%`,
                              }}
                            ></div>
                          </div>
                        </div>

                        <div className="mb-3">
                          <div className="d-flex justify-content-between mb-1">
                            <span className="fw-semibold">Pending ({pendingBookings})</span>
                            <span className="text-muted">
                              {totalBookings ? Math.round((pendingBookings / totalBookings) * 100) : 0}%
                            </span>
                          </div>
                          <div className="progress" style={{ height: "10px" }}>
                            <div
                              className="progress-bar bg-primary"
                              style={{
                                width: `${totalBookings ? (pendingBookings / totalBookings) * 100 : 0}%`,
                              }}
                            ></div>
                          </div>
                        </div>

                        <div className="mb-0">
                          <div className="d-flex justify-content-between mb-1">
                            <span className="fw-semibold">Cancelled ({cancelledBookings})</span>
                            <span className="text-muted">
                              {totalBookings ? Math.round((cancelledBookings / totalBookings) * 100) : 0}%
                            </span>
                          </div>
                          <div className="progress" style={{ height: "10px" }}>
                            <div
                              className="progress-bar bg-danger"
                              style={{
                                width: `${totalBookings ? (cancelledBookings / totalBookings) * 100 : 0}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Registered Vehicle Distribution */}
                  <div className="col-lg-6">
                    <div className="card border-0 shadow-sm h-100">
                      <div className="card-body p-4">
                        <h5 className="fw-bold mb-3 text-dark">
                          <i className="bi bi-car-front-fill text-danger me-2"></i>
                          Fleet Fuel Distribution
                        </h5>

                        {vehicles.length === 0 ? (
                          <p className="text-muted">No vehicles registered yet.</p>
                        ) : (
                          Object.entries(fuelCounts).map(([fuel, count]) => {
                            const pct = Math.round((count / vehicles.length) * 100);
                            return (
                              <div key={fuel} className="mb-3">
                                <div className="d-flex justify-content-between mb-1">
                                  <span className="fw-semibold">
                                    {fuel} ({count} cars)
                                  </span>
                                  <span className="text-muted">{pct}%</span>
                                </div>
                                <div className="progress" style={{ height: "10px" }}>
                                  <div
                                    className="progress-bar bg-dark"
                                    style={{ width: `${pct}%` }}
                                  ></div>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Popular Services Table */}
                <div className="card border-0 shadow-sm mb-4">
                  <div className="card-body p-4">
                    <h5 className="fw-bold mb-3 text-dark">
                      <i className="bi bi-star-fill text-warning me-2"></i>
                      Service Demand & Popularity
                    </h5>

                    {topServices.length === 0 ? (
                      <p className="text-muted">No booking data available yet.</p>
                    ) : (
                      <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                          <thead className="table-dark">
                            <tr>
                              <th style={{ width: "60px" }}>Rank</th>
                              <th>Service Name</th>
                              <th>Bookings Logged</th>
                              <th>Share of Demand</th>
                            </tr>
                          </thead>
                          <tbody>
                            {topServices.map(([sName, count], idx) => {
                              const share = totalBookings ? Math.round((count / totalBookings) * 100) : 0;
                              return (
                                <tr key={sName}>
                                  <td className="fw-bold text-muted">{idx + 1}</td>
                                  <td className="fw-semibold text-dark">{sName}</td>
                                  <td>
                                    <span className="badge bg-primary px-3 py-1">{count}</span>
                                  </td>
                                  <td>
                                    <div className="d-flex align-items-center gap-2">
                                      <div className="progress flex-grow-1" style={{ height: "8px" }}>
                                        <div
                                          className="progress-bar bg-danger"
                                          style={{ width: `${share}%` }}
                                        ></div>
                                      </div>
                                      <small className="text-muted fw-bold">{share}%</small>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Reports;