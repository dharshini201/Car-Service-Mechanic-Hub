import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { getAssignedServices } from "../../services/mechanicService";

function ServiceRequests() {
  const [searchParams] = useSearchParams();
  const [requests, setRequests] = useState([]);
  const [activeTab, setActiveTab] = useState(
    searchParams.get("status") || "All"
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const statusFromUrl = searchParams.get("status");
    if (statusFromUrl) {
      setActiveTab(statusFromUrl);
    }
  }, [searchParams]);

  const loadRequests = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getAssignedServices();
      setRequests(res.bookings || []);
    } catch (err) {
      console.error("Fetch service requests error:", err);
      setError("Failed to fetch service requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const filteredRequests = requests.filter((r) => {
    if (activeTab === "All") return true;
    if (activeTab === "In Progress") {
      return ["In Progress", "In Service", "Confirmed"].includes(r.status);
    }
    if (activeTab === "Completed") {
      return ["Completed", "Ready for Pickup"].includes(r.status);
    }
    return r.status === activeTab;
  });

  const statusClasses = {
    Completed: "bg-success text-white",
    "Ready for Pickup": "bg-success text-white",
    Cancelled: "bg-danger text-white",
    Pending: "bg-warning text-dark",
    Confirmed: "bg-primary text-white",
    "In Progress": "bg-info text-dark",
    "In Service": "bg-info text-dark",
  };

  const tabs = ["All", "Pending", "In Progress", "Completed"];

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-3 col-lg-2 px-0">
          <Sidebar role="mechanic" />
        </div>

        {/* Main Content */}
        <main className="col-md-9 col-lg-10 py-4 px-4 bg-light min-vh-100">
          {/* Header */}
          <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
            <div>
              <h2 className="fw-bold mb-1 text-dark">Service Requests</h2>
              <p className="text-secondary mb-0">
                Review assigned customer repair jobs and maintenance requests.
              </p>
            </div>
            <button
              type="button"
              className="btn btn-outline-primary rounded-pill px-3 py-2 fw-semibold"
              onClick={loadRequests}
            >
              <i className="bi bi-arrow-clockwise me-1"></i>
              Refresh List
            </button>
          </div>

          {error && (
            <div className="alert alert-danger d-flex align-items-center mb-4">
              <i className="bi bi-exclamation-octagon-fill me-2 fs-5"></i>
              <div>{error}</div>
            </div>
          )}

          {/* Filter Tabs */}
          <div className="d-flex flex-wrap gap-2 mb-4">
            {tabs.map((tab) => {
              const count =
                tab === "All"
                  ? requests.length
                  : tab === "In Progress"
                  ? requests.filter((r) => ["In Progress", "In Service", "Confirmed"].includes(r.status)).length
                  : tab === "Completed"
                  ? requests.filter((r) => ["Completed", "Ready for Pickup"].includes(r.status)).length
                  : requests.filter((r) => r.status === tab).length;

              return (
                <button
                  key={tab}
                  type="button"
                  className={`btn btn-sm rounded-pill px-3 py-2 fw-semibold transition-all ${
                    activeTab === tab
                      ? "btn-primary shadow-sm"
                      : "btn-white bg-white text-secondary border"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                  <span
                    className={`badge ms-2 rounded-pill ${
                      activeTab === tab ? "bg-white text-primary" : "bg-light text-secondary"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Content Table / Cards */}
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
              <p className="mt-2 text-muted small">Loading requests...</p>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
              <i className="bi bi-clipboard-x text-muted" style={{ fontSize: "65px" }}></i>
              <h4 className="fw-bold mt-3 text-dark">No Service Requests Found</h4>
              <p className="text-secondary small mb-0">
                There are no assigned requests matching the selected filter.
              </p>
            </div>
          ) : (
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="ps-4 py-3 text-secondary small fw-semibold">CUSTOMER</th>
                      <th className="py-3 text-secondary small fw-semibold">VEHICLE</th>
                      <th className="py-3 text-secondary small fw-semibold">SERVICE</th>
                      <th className="py-3 text-secondary small fw-semibold">BOOKING DATE & TIME</th>
                      <th className="py-3 text-secondary small fw-semibold">DESCRIPTION</th>
                      <th className="py-3 text-secondary small fw-semibold">STATUS</th>
                      <th className="pe-4 py-3 text-secondary small fw-semibold text-end">ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRequests.map((req) => {
                      const id = req._id || req.id;
                      return (
                        <tr key={id}>
                          <td className="ps-4 py-3">
                            <span className="text-dark fw-bold d-block">
                              {req.customer?.name || "Customer"}
                            </span>
                            <small className="text-muted">
                              <i className="bi bi-telephone me-1"></i>
                              {req.customer?.phone || "N/A"}
                            </small>
                          </td>
                          <td className="py-3">
                            <strong className="text-dark d-block">
                              {req.vehicle?.brand} {req.vehicle?.model}
                            </strong>
                            <span className="font-monospace text-muted small">
                              {req.vehicle?.vehicleNumber}
                            </span>
                          </td>
                          <td className="py-3">
                            <strong className="text-dark d-block">
                              {req.service?.name || "Service Package"}
                            </strong>
                            {req.service?.price !== undefined && (
                              <small className="text-muted">
                                ₹{req.service.price}
                              </small>
                            )}
                          </td>
                          <td className="py-3 text-secondary small">
                            <div className="fw-medium text-dark">
                              {req.bookingDate
                                ? new Date(req.bookingDate).toLocaleDateString()
                                : "N/A"}
                            </div>
                            <small className="text-muted">
                              <i className="bi bi-clock me-1"></i>
                              {req.bookingTime}
                            </small>
                          </td>
                          <td className="py-3 text-secondary small" style={{ maxWidth: "220px" }}>
                            <span
                              className="d-inline-block text-truncate w-100"
                              title={req.description || "No specific customer notes provided."}
                            >
                              {req.description || <em className="text-muted">No description</em>}
                            </span>
                          </td>
                          <td className="py-3">
                            <span
                              className={`badge px-3 py-2 rounded-pill shadow-sm ${
                                statusClasses[req.status] || "bg-primary"
                              }`}
                            >
                              {req.status}
                            </span>
                          </td>
                          <td className="pe-4 py-3 text-end">
                            <div className="d-flex gap-2 justify-content-end">
                              <Link
                                to={`/mechanic/request/${id}`}
                                className="btn btn-sm btn-outline-secondary rounded-pill px-3"
                              >
                                View Details
                              </Link>
                              <Link
                                to={`/mechanic/update-status/${id}`}
                                className="btn btn-sm btn-primary rounded-pill px-3 fw-semibold shadow-sm"
                              >
                                Update Status
                              </Link>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
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

export default ServiceRequests;