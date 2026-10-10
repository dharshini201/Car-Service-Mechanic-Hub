import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { getAllVehiclesAdmin, deleteVehicle } from "../../services/vehicleService";

function ManageVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [fuelFilter, setFuelFilter] = useState("All");

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getAllVehiclesAdmin();
      const list = res?.vehicles || res?.data || (Array.isArray(res) ? res : []);
      setVehicles(list);
    } catch (err) {
      console.error("Fetch Vehicles Error:", err);
      setError(err?.response?.data?.message || err.message || "Failed to load vehicles.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleDelete = async (vehicleId, name) => {
    if (!window.confirm(`Are you sure you want to remove ${name}?`)) return;

    try {
      setError("");
      await deleteVehicle(vehicleId);
      setSuccessMsg("Vehicle removed from registry successfully.");
      setTimeout(() => setSuccessMsg(""), 4000);
      await fetchVehicles();
    } catch (err) {
      console.error("Delete Vehicle Error:", err);
      setError(err?.response?.data?.message || err.message || "Failed to delete vehicle.");
    }
  };

  const filteredVehicles = vehicles.filter((v) => {
    const brandModel = `${v.brand || ""} ${v.model || ""}`.toLowerCase();
    const plate = (v.vehicleNumber || "").toLowerCase();
    const customer = (v.user?.name || "").toLowerCase();
    const q = searchTerm.toLowerCase();

    const matchesSearch =
      brandModel.includes(q) || plate.includes(q) || customer.includes(q);

    const matchesFuel =
      fuelFilter === "All" ||
      (v.fuelType && v.fuelType.toLowerCase() === fuelFilter.toLowerCase());

    return matchesSearch && matchesFuel;
  });

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
                  Fleet Registry
                </span>
                <h2 className="fw-bold mb-1" style={{ color: "#0f172a" }}>
                  Manage Vehicles
                </h2>
                <p className="text-muted mb-0">
                  View and manage all registered customer vehicles in the system.
                </p>
              </div>

              <div className="d-flex gap-2">
                <button
                  className="btn btn-outline-secondary d-flex align-items-center gap-2"
                  onClick={fetchVehicles}
                >
                  <i className="bi bi-arrow-clockwise"></i> Refresh
                </button>
                <Link to="/admin/dashboard" className="btn btn-outline-dark">
                  <i className="bi bi-arrow-left me-1"></i> Dashboard
                </Link>
              </div>
            </div>

            {/* Alerts */}
            {error && (
              <div className="alert alert-danger alert-dismissible fade show shadow-sm" role="alert">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                {error}
                <button type="button" className="btn-close" onClick={() => setError("")}></button>
              </div>
            )}

            {successMsg && (
              <div className="alert alert-success alert-dismissible fade show shadow-sm" role="alert">
                <i className="bi bi-check-circle-fill me-2"></i>
                {successMsg}
                <button type="button" className="btn-close" onClick={() => setSuccessMsg("")}></button>
              </div>
            )}

            {/* Statistics */}
            <div className="row g-3 mb-4">
              <div className="col-md-4">
                <div className="card border-0 shadow-sm p-3 bg-white rounded-3">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <small className="text-muted text-uppercase fw-semibold">Total Vehicles</small>
                      <h3 className="fw-bold mb-0 text-dark mt-1">{vehicles.length}</h3>
                    </div>
                    <div className="p-3 bg-primary-subtle text-primary rounded-circle">
                      <i className="bi bi-car-front-fill fs-4"></i>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card border-0 shadow-sm p-3 bg-white rounded-3">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <small className="text-muted text-uppercase fw-semibold">Petrol Vehicles</small>
                      <h3 className="fw-bold mb-0 text-danger mt-1">
                        {vehicles.filter((v) => v.fuelType?.toLowerCase() === "petrol").length}
                      </h3>
                    </div>
                    <div className="p-3 bg-danger-subtle text-danger rounded-circle">
                      <i className="bi bi-fuel-pump-fill fs-4"></i>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card border-0 shadow-sm p-3 bg-white rounded-3">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <small className="text-muted text-uppercase fw-semibold">Diesel & Electric</small>
                      <h3 className="fw-bold mb-0 text-success mt-1">
                        {
                          vehicles.filter(
                            (v) =>
                              v.fuelType?.toLowerCase() === "diesel" ||
                              v.fuelType?.toLowerCase() === "electric"
                          ).length
                        }
                      </h3>
                    </div>
                    <div className="p-3 bg-success-subtle text-success rounded-circle">
                      <i className="bi bi-lightning-charge-fill fs-4"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Filter & Search */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body p-3">
                <div className="row g-3 align-items-center">
                  <div className="col-md-6 col-lg-5">
                    <div className="input-group">
                      <span className="input-group-text bg-white border-end-0 text-muted">
                        <i className="bi bi-search"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control border-start-0"
                        placeholder="Search by brand, model, license plate, or customer..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      {searchTerm && (
                        <button
                          className="btn btn-outline-secondary border-start-0"
                          onClick={() => setSearchTerm("")}
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="col-md-6 col-lg-7 d-flex flex-wrap gap-2 justify-content-md-end">
                    {["All", "Petrol", "Diesel", "Electric", "Hybrid"].map((fuel) => (
                      <button
                        key={fuel}
                        className={`btn btn-sm ${
                          fuelFilter === fuel ? "btn-danger fw-semibold" : "btn-outline-secondary"
                        }`}
                        onClick={() => setFuelFilter(fuel)}
                      >
                        {fuel}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Vehicles Table */}
            {loading ? (
              <div className="card border-0 shadow-sm text-center py-5">
                <div className="spinner-border text-danger mx-auto mb-3" role="status"></div>
                <p className="text-muted mb-0">Loading registered fleet...</p>
              </div>
            ) : filteredVehicles.length === 0 ? (
              <div className="card border-0 shadow-sm text-center py-5">
                <i className="bi bi-car-front text-muted" style={{ fontSize: "64px" }}></i>
                <h5 className="fw-bold mt-3">No Vehicles Found</h5>
                <p className="text-muted">No vehicles match your search or filter.</p>
              </div>
            ) : (
              <div className="card border-0 shadow-sm">
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-dark">
                      <tr>
                        <th style={{ width: "60px" }}>#</th>
                        <th>Vehicle</th>
                        <th>License Plate</th>
                        <th>Owner / Customer</th>
                        <th>Year</th>
                        <th>Fuel Type</th>
                        <th className="text-end" style={{ minWidth: "100px" }}>
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredVehicles.map((vehicle, idx) => {
                        const owner = vehicle.user || {};
                        const vName = `${vehicle.brand || ""} ${vehicle.model || ""}`.trim();
                        return (
                          <tr key={vehicle._id || idx}>
                            <td className="text-muted fw-semibold">{idx + 1}</td>

                            {/* Vehicle Details */}
                            <td>
                              <div className="d-flex align-items-center gap-3">
                                <div
                                  className="bg-danger text-white rounded-circle d-flex align-items-center justify-content-center"
                                  style={{ width: "42px", height: "42px" }}
                                >
                                  <i className="bi bi-car-front-fill fs-5"></i>
                                </div>
                                <div>
                                  <div className="fw-bold text-dark">{vName}</div>
                                  <small className="text-muted">ID: {vehicle._id?.slice(-6)}</small>
                                </div>
                              </div>
                            </td>

                            {/* Plate */}
                            <td>
                              <span className="badge bg-light text-dark border px-2 py-1 fs-6 font-monospace">
                                {vehicle.vehicleNumber}
                              </span>
                            </td>

                            {/* Owner */}
                            <td>
                              <div className="fw-semibold text-dark">{owner.name || "Customer"}</div>
                              {owner.email && (
                                <small className="text-muted d-block">
                                  <i className="bi bi-envelope me-1"></i>
                                  {owner.email}
                                </small>
                              )}
                              {owner.phone && (
                                <small className="text-muted d-block">
                                  <i className="bi bi-telephone me-1"></i>
                                  {owner.phone}
                                </small>
                              )}
                            </td>

                            {/* Year */}
                            <td>
                              <span className="fw-semibold">{vehicle.year || "N/A"}</span>
                            </td>

                            {/* Fuel */}
                            <td>
                              <span
                                className={`badge ${
                                  vehicle.fuelType?.toLowerCase() === "electric"
                                    ? "bg-success"
                                    : vehicle.fuelType?.toLowerCase() === "diesel"
                                    ? "bg-secondary"
                                    : "bg-info text-dark"
                                }`}
                              >
                                {vehicle.fuelType || "Petrol"}
                              </span>
                            </td>

                            {/* Action */}
                            <td className="text-end">
                              <button
                                className="btn btn-sm btn-outline-danger"
                                title="Remove Vehicle"
                                onClick={() => handleDelete(vehicle._id, vName)}
                              >
                                <i className="bi bi-trash me-1"></i> Delete
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default ManageVehicles;