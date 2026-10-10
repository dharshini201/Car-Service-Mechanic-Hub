import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import api from "../../services/api";

function Activity() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchActivities = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/admin/activity");
      const list = res.data?.activities || res.data?.data || [];
      setActivities(list);
    } catch (err) {
      console.error("Fetch Activity Error:", err);
      setError(err?.response?.data?.message || err.message || "Failed to load audit activity.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const getActivityIcon = (status) => {
    switch (status) {
      case "Completed":
        return { icon: "bi-check-circle-fill", color: "text-success", bg: "bg-success-subtle" };
      case "In Progress":
        return { icon: "bi-tools", color: "text-warning", bg: "bg-warning-subtle" };
      case "Cancelled":
        return { icon: "bi-x-circle-fill", color: "text-danger", bg: "bg-danger-subtle" };
      case "Pending":
      default:
        return { icon: "bi-clock-history", color: "text-primary", bg: "bg-primary-subtle" };
    }
  };

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
          <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
            {/* Header */}
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
              <div>
                <span className="badge bg-danger-subtle text-danger px-3 py-1 mb-1 fw-semibold">
                  Audit Logs
                </span>
                <h2 className="fw-bold mb-1" style={{ color: "#0f172a" }}>
                  System Activity & Audit Log
                </h2>
                <p className="text-muted mb-0">
                  Real-time audit trail of customer bookings, mechanic assignments, and status updates.
                </p>
              </div>

              <div className="d-flex gap-2">
                <button
                  className="btn btn-outline-secondary d-flex align-items-center gap-2"
                  onClick={fetchActivities}
                >
                  <i className="bi bi-arrow-clockwise"></i> Refresh Feed
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

            {/* Activities Feed */}
            {loading ? (
              <div className="card border-0 shadow-sm text-center py-5">
                <div className="spinner-border text-danger mx-auto mb-3" role="status"></div>
                <p className="text-muted mb-0">Fetching latest event logs...</p>
              </div>
            ) : activities.length === 0 ? (
              <div className="card border-0 shadow-sm text-center py-5">
                <i className="bi bi-journal-x text-muted" style={{ fontSize: "64px" }}></i>
                <h5 className="fw-bold mt-3">No Recent Activity</h5>
                <p className="text-muted">No system activity events recorded recently.</p>
              </div>
            ) : (
              <div className="card border-0 shadow-sm">
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-4 text-dark">
                    <i className="bi bi-activity text-danger me-2"></i>
                    Recent Service Hub Events ({activities.length})
                  </h5>

                  <div className="timeline">
                    {activities.map((act) => {
                      const custName = act.customer?.name || "Customer";
                      const srvName = act.service?.name || "Service";
                      const mechName = act.mechanic?.name;
                      const status = act.status || "Pending";
                      const meta = getActivityIcon(status);

                      return (
                        <div
                          key={act._id}
                          className="d-flex align-items-start gap-3 p-3 mb-3 rounded-3 bg-light border"
                        >
                          <div
                            className={`rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 ${meta.bg}`}
                            style={{ width: "46px", height: "46px" }}
                          >
                            <i className={`bi ${meta.icon} ${meta.color} fs-5`}></i>
                          </div>

                          <div className="flex-grow-1">
                            <div className="d-flex justify-content-between align-items-center mb-1">
                              <h6 className="fw-bold mb-0 text-dark">
                                {srvName} — <span className="text-muted font-monospace">#{act._id.slice(-6)}</span>
                              </h6>
                              <small className="text-muted">
                                {act.updatedAt
                                  ? new Date(act.updatedAt).toLocaleString()
                                  : "Recently"}
                              </small>
                            </div>

                            <p className="mb-1 text-secondary" style={{ fontSize: "14px" }}>
                              <strong>{custName}</strong> booked <strong>{srvName}</strong>. Current status:{" "}
                              <span className={`badge ${meta.bg} ${meta.color} border ms-1`}>
                                {status}
                              </span>
                              {mechName ? (
                                <span className="ms-2">
                                  | Assigned Technician: <strong>{mechName}</strong>
                                </span>
                              ) : (
                                <span className="ms-2 text-warning fst-italic">
                                  | Awaiting mechanic assignment
                                </span>
                              )}
                            </p>

                            {act.description && (
                              <small className="text-muted d-block fst-italic">
                                Customer Notes: "{act.description}"
                              </small>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Activity;