import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import VehicleCard from "../../components/VehicleCard";
import { getVehicles, deleteVehicle } from "../../services/vehicleService";

function Vehicles() {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadVehicles = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getVehicles();
      setVehicles(res.vehicles || []);
    } catch (err) {
      console.error("Fetch vehicles error:", err);
      setError("Failed to load your vehicles. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  const handleDelete = async (vehicle) => {
    const id = vehicle._id || vehicle.id;
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${vehicle.brand} ${vehicle.model}?`
    );

    if (!confirmDelete) return;

    try {
      await deleteVehicle(id);
      setSuccess("Vehicle deleted successfully.");
      setVehicles((prev) => prev.filter((v) => (v._id || v.id) !== id));
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete vehicle.");
    }
  };

  const handleEdit = (vehicle) => {
    navigate(`/customer/edit-vehicle/${vehicle._id || vehicle.id}`);
  };

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
              <h2 className="fw-bold mb-1 text-dark">My Vehicles</h2>
              <p className="text-secondary mb-0">
                View and manage your registered vehicles for quick service bookings.
              </p>
            </div>
            <Link
              to="/customer/add-vehicle"
              className="btn btn-primary rounded-pill px-4 py-2 fw-semibold shadow-sm"
            >
              <i className="bi bi-plus-circle me-2"></i>
              Add New Vehicle
            </Link>
          </div>

          {/* Feedback Alerts */}
          {error && (
            <div className="alert alert-danger d-flex align-items-center mb-4">
              <i className="bi bi-exclamation-octagon-fill me-2 fs-5"></i>
              <div>{error}</div>
            </div>
          )}

          {success && (
            <div className="alert alert-success d-flex align-items-center mb-4">
              <i className="bi bi-check-circle-fill me-2 fs-5"></i>
              <div>{success}</div>
            </div>
          )}

          {/* Count Badge */}
          {!loading && (
            <div className="mb-4">
              <span className="badge bg-white text-dark shadow-sm px-3 py-2 border rounded-pill">
                <i className="bi bi-car-front-fill text-primary me-2"></i>
                Total Registered: <strong>{vehicles.length}</strong>
              </span>
            </div>
          )}

          {/* Vehicles List */}
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
              <p className="mt-2 text-muted small">Loading vehicles from database...</p>
            </div>
          ) : vehicles.length === 0 ? (
            <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
              <i className="bi bi-car-front text-muted" style={{ fontSize: "65px" }}></i>
              <h4 className="fw-bold mt-3 text-dark">No Vehicles Found</h4>
              <p className="text-secondary small mb-4">
                You haven't added any vehicles to your profile yet. Add your vehicle to schedule maintenance and track its service history.
              </p>
              <div>
                <Link
                  to="/customer/add-vehicle"
                  className="btn btn-primary rounded-pill px-4 py-2 fw-semibold"
                >
                  <i className="bi bi-plus-lg me-2"></i>
                  Add Your First Vehicle
                </Link>
              </div>
            </div>
          ) : (
            <div className="row g-4">
              {vehicles.map((vehicle) => (
                <div className="col-md-6 col-lg-4" key={vehicle._id || vehicle.id}>
                  <VehicleCard
                    vehicle={vehicle}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Vehicles;