import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { getServiceHistory } from "../../services/bookingService";

function MechanicServiceHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Search, Filter, Sort State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortByDate, setSortByDate] = useState("newest");

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getServiceHistory();
      setHistory(res.history || []);
    } catch (err) {
      console.error("Fetch mechanic service history error:", err);
      setError("Failed to load completed service history from database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // Filter and sort records
  const filteredHistory = history
    .filter((record) => {
      // 1. Status Filter
      if (statusFilter !== "All" && record.status !== statusFilter) {
        return false;
      }

      // 2. Search Query
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();

      const customerName = record.customer?.name?.toLowerCase() || "";
      const customerPhone = record.customer?.phone?.toLowerCase() || "";
      const vehicleBrand = record.vehicle?.brand?.toLowerCase() || "";
      const vehicleModel = record.vehicle?.model?.toLowerCase() || "";
      const vehicleNumber = record.vehicle?.vehicleNumber?.toLowerCase() || "";
      const serviceName = record.service?.name?.toLowerCase() || "";
      const notes = (record.notes || record.description || "").toLowerCase();

      return (
        customerName.includes(q) ||
        customerPhone.includes(q) ||
        vehicleBrand.includes(q) ||
        vehicleModel.includes(q) ||
        vehicleNumber.includes(q) ||
        serviceName.includes(q) ||
        notes.includes(q)
      );
    })
    .sort((a, b) => {
      const timeA = new Date(a.serviceDate || a.createdAt).getTime();
      const timeB = new Date(b.serviceDate || b.createdAt).getTime();
      return sortByDate === "newest" ? timeB - timeA : timeA - timeB;
    });

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
              <h2 className="fw-bold mb-1 text-dark">Mechanic Service History</h2>
              <p className="text-secondary mb-0">
                Permanent records and diagnostic history of vehicle services completed by you.
              </p>
            </div>
            <div className="d-flex align-items-center gap-2">
              <span className="badge bg-white text-dark shadow-sm px-3 py-2 border rounded-pill">
                Total Handled: <strong>{history.length}</strong>
              </span>
              <button
                type="button"
                className="btn btn-outline-primary btn-sm rounded-pill px-3 py-2 fw-semibold"
                onClick={fetchHistory}
              >
                <i className="bi bi-arrow-clockwise me-1"></i>
                Refresh
              </button>
            </div>
          </div>

          {error && (
            <div className="alert alert-danger d-flex align-items-center mb-4">
              <i className="bi bi-exclamation-octagon-fill me-2 fs-5"></i>
              <div>{error}</div>
            </div>
          )}

          {/* Search, Filter, Sort Controls */}
          <div className="card border-0 shadow-sm rounded-4 p-3 mb-4 bg-white">
            <div className="row g-3 align-items-center">
              {/* Search */}
              <div className="col-md-5">
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <i className="bi bi-search text-muted"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control bg-light border-start-0"
                    placeholder="Search by customer, vehicle, service, or notes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button
                      className="btn btn-light border-start-0"
                      type="button"
                      onClick={() => setSearchQuery("")}
                    >
                      <i className="bi bi-x-lg text-muted"></i>
                    </button>
                  )}
                </div>
              </div>

              {/* Status Filter */}
              <div className="col-sm-6 col-md-4">
                <div className="d-flex align-items-center gap-2">
                  <label className="text-secondary small fw-semibold text-nowrap mb-0">
                    Status:
                  </label>
                  <select
                    className="form-select form-select-sm bg-light py-2"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="All">All Statuses ({history.length})</option>
                    <option value="Completed">
                      Completed (
                      {history.filter((h) => h.status === "Completed").length})
                    </option>
                    <option value="Cancelled">
                      Cancelled (
                      {history.filter((h) => h.status === "Cancelled").length})
                    </option>
                  </select>
                </div>
              </div>

              {/* Sort by Date */}
              <div className="col-sm-6 col-md-3">
                <div className="d-flex align-items-center gap-2">
                  <label className="text-secondary small fw-semibold text-nowrap mb-0">
                    Sort:
                  </label>
                  <select
                    className="form-select form-select-sm bg-light py-2"
                    value={sortByDate}
                    onChange={(e) => setSortByDate(e.target.value)}
                  >
                    <option value="newest">Date: Newest First</option>
                    <option value="oldest">Date: Oldest First</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="d-flex justify-content-between align-items-center mb-3 px-1">
            <span className="text-secondary small">
              Showing <strong>{filteredHistory.length}</strong> of <strong>{history.length}</strong> service records
            </span>
            {(searchQuery || statusFilter !== "All") && (
              <button
                className="btn btn-link btn-sm text-primary text-decoration-none p-0"
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("All");
                }}
              >
                Clear all filters
              </button>
            )}
          </div>

          {/* Records Table */}
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
              <p className="mt-2 text-muted small">Loading completed records...</p>
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
              <i className="bi bi-clock-history text-muted" style={{ fontSize: "65px" }}></i>
              <h4 className="fw-bold mt-3 text-dark">
                {history.length === 0
                  ? "No Service History Records Yet"
                  : "No Matching Records Found"}
              </h4>
              <p className="text-secondary small mb-0">
                {history.length === 0
                  ? "When you mark an assigned service job as 'Completed', it will automatically be permanently archived here."
                  : "Try clearing your search query or choosing a different status filter."}
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
                      <th className="py-3 text-secondary small fw-semibold">SERVICE DATE</th>
                      <th className="py-3 text-secondary small fw-semibold">NOTES</th>
                      <th className="pe-4 py-3 text-secondary small fw-semibold text-end">STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredHistory.map((record) => (
                      <tr key={record._id || record.id}>
                        {/* Customer */}
                        <td className="ps-4 py-3">
                          <span className="text-dark fw-bold d-block">
                            {record.customer?.name || "Customer"}
                          </span>
                          <small className="text-muted">
                            <i className="bi bi-telephone me-1"></i>
                            {record.customer?.phone || "N/A"}
                          </small>
                        </td>

                        {/* Vehicle */}
                        <td className="py-3">
                          <strong className="text-dark d-block">
                            {record.vehicle?.brand} {record.vehicle?.model}
                          </strong>
                          <span className="font-monospace text-muted small">
                            {record.vehicle?.vehicleNumber}
                          </span>
                        </td>

                        {/* Service */}
                        <td className="py-3">
                          <strong className="text-dark d-block">
                            {record.service?.name || "Maintenance Service"}
                          </strong>
                          {record.service?.price !== undefined && (
                            <small className="text-muted">
                              ₹{record.service.price}
                            </small>
                          )}
                        </td>

                        {/* Service Date */}
                        <td className="py-3 text-secondary small">
                          <div className="fw-medium text-dark">
                            {record.serviceDate
                              ? new Date(record.serviceDate).toLocaleDateString()
                              : "N/A"}
                          </div>
                          <small className="text-muted">
                            {record.serviceDate
                              ? new Date(record.serviceDate).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : ""}
                          </small>
                        </td>

                        {/* Notes */}
                        <td className="py-3 text-secondary small" style={{ maxWidth: "260px" }}>
                          <span
                            className="d-inline-block text-truncate w-100"
                            title={record.notes || record.description || "Completed successfully."}
                          >
                            {record.notes || record.description || "Completed successfully."}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="pe-4 py-3 text-end">
                          <span
                            className={`badge px-3 py-2 rounded-pill shadow-sm ${
                              record.status === "Completed"
                                ? "bg-success"
                                : "bg-danger"
                            }`}
                          >
                            <i
                              className={`bi ${
                                record.status === "Completed"
                                  ? "bi-check2"
                                  : "bi-x-circle"
                              } me-1`}
                            ></i>
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

export default MechanicServiceHistory;