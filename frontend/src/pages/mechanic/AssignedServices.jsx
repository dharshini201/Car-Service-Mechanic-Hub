import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { getAssignedServices } from "../../services/mechanicService";

function AssignedServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadServices = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getAssignedServices();
      setServices(res.bookings || []);
    } catch (err) {
      console.error("Fetch assigned services error:", err);
      setError("Failed to fetch assigned services.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const statusClasses = {
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
          <Sidebar role="mechanic" />
        </div>

        {/* Main Content */}
        <main className="col-md-9 col-lg-10 py-4 px-4 bg-light min-vh-100">
          <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
            <div>
              <h2 className="fw-bold mb-1 text-dark">Assigned Services</h2>
              <p className="text-secondary mb-0">
                Jobs assigned exclusively to you by the workshop manager.
              </p>
            </div>
            <button
              type="button"
              className="btn btn-outline-primary rounded-pill px-3 py-2 fw-semibold"
              onClick={loadServices}
            >
              <i className="bi bi-arrow-clockwise me-1"></i>
              Refresh
            </button>
          </div>

          {error && (
            <div className="alert alert-danger d-flex align-items-center mb-4">
              <i className="bi bi-exclamation-octagon-fill me-2 fs-5"></i>
              <div>{error}</div>
            </div>
          )}

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
              <p className="mt-2 text-muted small">Loading assigned jobs...</p>
            </div>
          ) : services.length === 0 ? (
            <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
              <i className="bi bi-tools text-muted" style={{ fontSize: "65px" }}></i>
              <h4 className="fw-bold mt-3 text-dark">No Assigned Services</h4>
              <p className="text-secondary small mb-0">
                You do not have any vehicle maintenance tasks assigned right now. Check back soon.
              </p>
            </div>
          ) : (
            <div className="row g-4">
              {services.map((item) => {
                const id = item._id || item.id;
                return (
                  <div className="col-md-6 col-xl-4" key={id}>
                    <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden bg-white">
                      <div className="card-body p-4 d-flex flex-column">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <div>
                            <span className="badge bg-light text-secondary border small mb-1">
                              JOB REF: #{id.slice(-6).toUpperCase()}
                            </span>
                            <h5 className="fw-bold text-dark mb-0">
                              {item.service?.name || "Maintenance Service"}
                            </h5>
                          </div>
                          <span
                            className={`badge px-3 py-2 rounded-pill shadow-sm ${
                              statusClasses[item.status] || "bg-primary"
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>

                        <div className="p-3 rounded-3 mb-3" style={{ backgroundColor: "#f8fafc" }}>
                          <div className="d-flex align-items-center mb-2">
                            <i className="bi bi-car-front text-primary me-2 fs-6"></i>
                            <strong className="text-dark">
                              {item.vehicle?.brand} {item.vehicle?.model}
                            </strong>
                            <span className="text-muted ms-auto font-monospace small">
                              {item.vehicle?.vehicleNumber}
                            </span>
                          </div>

                          <div className="d-flex align-items-center mb-1 text-secondary small">
                            <i className="bi bi-person me-2 text-primary"></i>
                            <span>{item.customer?.name} ({item.customer?.phone || "No phone"})</span>
                          </div>

                          <div className="d-flex align-items-center text-secondary small">
                            <i className="bi bi-calendar-event me-2 text-primary"></i>
                            <span>
                              {item.bookingDate
                                ? new Date(item.bookingDate).toLocaleDateString()
                                : "N/A"}{" "}
                              at {item.bookingTime}
                            </span>
                          </div>
                        </div>

                        {item.description && (
                          <p className="text-secondary small mb-3 flex-grow-1" style={{ lineHeight: "1.5" }}>
                            <strong>Customer Note:</strong> {item.description}
                          </p>
                        )}

                        {item.mechanicNotes && (
                          <div className="alert alert-warning py-2 px-3 small mb-3">
                            <strong>Technician Notes:</strong> {item.mechanicNotes}
                          </div>
                        )}

                        <div className="d-flex gap-2 mt-auto pt-2 border-top">
                          <Link
                            to={`/mechanic/request/${id}`}
                            className="btn btn-outline-secondary btn-sm rounded-pill flex-grow-1 py-2 fw-semibold"
                          >
                            Job Details
                          </Link>
                          <Link
                            to={`/mechanic/update-status/${id}`}
                            className="btn btn-primary btn-sm rounded-pill px-4 py-2 fw-semibold shadow-sm"
                          >
                            Update
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default AssignedServices;