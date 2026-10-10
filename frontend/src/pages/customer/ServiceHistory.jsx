import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { getServiceHistory } from "../../services/bookingService";

function ServiceHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await getServiceHistory();
        setHistory(res.history || []);
      } catch (err) {
        console.error("Fetch service history error:", err);
        setError("Failed to load service history records.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

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
              <h2 className="fw-bold mb-1 text-dark">Service History</h2>
              <p className="text-secondary mb-0">
                Detailed archive of all completed vehicle repairs and maintenance.
              </p>
            </div>
            <Link
              to="/customer/book-service"
              className="btn btn-primary rounded-pill px-4 py-2 fw-semibold shadow-sm"
            >
              <i className="bi bi-calendar-plus me-2"></i>
              Book Another Service
            </Link>
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
              <p className="mt-2 text-muted small">Loading maintenance history...</p>
            </div>
          ) : history.length === 0 ? (
            <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
              <i
                className="bi bi-clock-history text-muted"
                style={{ fontSize: "65px" }}
              ></i>
              <h4 className="fw-bold mt-3 text-dark">No Service History Records</h4>
              <p className="text-secondary small mb-4">
                Completed service appointments and vehicle health logs will automatically be archived here.
              </p>
              <div>
                <Link
                  to="/customer/book-service"
                  className="btn btn-primary rounded-pill px-4 py-2 fw-semibold"
                >
                  Schedule Your First Service
                </Link>
              </div>
            </div>
          ) : (
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="ps-4 py-3 text-secondary small fw-semibold">SERVICE</th>
                      <th className="py-3 text-secondary small fw-semibold">VEHICLE</th>
                      <th className="py-3 text-secondary small fw-semibold">MECHANIC</th>
                      <th className="py-3 text-secondary small fw-semibold">COMPLETED DATE</th>
                      <th className="py-3 text-secondary small fw-semibold">NOTES</th>
                      <th className="pe-4 py-3 text-secondary small fw-semibold">STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((record) => (
                      <tr key={record._id || record.id}>
                        <td className="ps-4 py-3">
                          <div className="d-flex align-items-center">
                            <div
                              className="bg-primary bg-opacity-10 text-primary rounded-circle p-2 me-3 d-flex align-items-center justify-content-center"
                              style={{ width: "38px", height: "38px" }}
                            >
                              <i className="bi bi-tools"></i>
                            </div>
                            <div>
                              <strong className="text-dark d-block">
                                {record.service?.name || "Maintenance Service"}
                              </strong>
                              {record.service?.price !== undefined && (
                                <small className="text-muted">
                                  ₹{record.service.price}
                                </small>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-3">
                          <strong className="text-dark d-block">
                            {record.vehicle?.brand} {record.vehicle?.model}
                          </strong>
                          <span className="font-monospace text-muted small">
                            {record.vehicle?.vehicleNumber}
                          </span>
                        </td>
                        <td className="py-3">
                          {record.mechanic?.name ? (
                            <span className="text-dark fw-medium">
                              {record.mechanic.name}
                            </span>
                          ) : (
                            <span className="text-muted small">MRT Service Center</span>
                          )}
                        </td>
                        <td className="py-3 text-secondary small">
                          {record.serviceDate
                            ? new Date(record.serviceDate).toLocaleDateString(undefined, {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })
                            : "N/A"}
                        </td>
                        <td className="py-3 text-secondary small" style={{ maxWidth: "220px" }}>
                          <span className="d-inline-block text-truncate w-100" title={record.notes || record.description}>
                            {record.notes || record.description || "Service completed normally."}
                          </span>
                        </td>
                        <td className="pe-4 py-3">
                          <span className="badge bg-success px-3 py-2 rounded-pill shadow-sm">
                            <i className="bi bi-check2 me-1"></i>
                            {record.status || "Completed"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default ServiceHistory;