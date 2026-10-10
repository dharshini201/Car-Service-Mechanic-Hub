import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { getVehicleById, updateVehicle } from "../../services/vehicleService";

function EditVehicle() {
  const { vehicleId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    vehicleNumber: "",
    year: "",
    fuelType: "Petrol",
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await getVehicleById(vehicleId);
        const v = res.vehicle || res.data;
        if (v) {
          setFormData({
            brand: v.brand || "",
            model: v.model || "",
            vehicleNumber: v.vehicleNumber || "",
            year: v.year || "",
            fuelType: v.fuelType || "Petrol",
          });
        }
      } catch (err) {
        console.error("Fetch vehicle error:", err);
        setError("Vehicle not found or could not be loaded.");
      } finally {
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [vehicleId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "vehicleNumber" ? value.toUpperCase() : value,
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (
      !formData.brand.trim() ||
      !formData.model.trim() ||
      !formData.vehicleNumber.trim() ||
      !formData.year ||
      !formData.fuelType
    ) {
      setError("Please fill in all vehicle fields.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await updateVehicle(vehicleId, {
        ...formData,
        year: Number(formData.year),
      });

      if (res.success) {
        setSuccess("Vehicle details updated successfully! Redirecting...");
        setTimeout(() => {
          navigate("/customer/vehicles");
        }, 800);
      }
    } catch (err) {
      console.error("Update vehicle error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to update vehicle. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
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
          <div className="mb-4">
            <Link
              to="/customer/vehicles"
              className="text-decoration-none small text-secondary fw-semibold mb-2 d-inline-block"
            >
              <i className="bi bi-arrow-left me-1"></i> Back to My Vehicles
            </Link>
            <h2 className="fw-bold mb-1 text-dark">Edit Vehicle</h2>
            <p className="text-secondary mb-0">
              Update registration details and information for your vehicle.
            </p>
          </div>

          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
                {error && (
                  <div className="alert alert-danger d-flex align-items-center mb-4">
                    <i className="bi bi-exclamation-triangle-fill me-2 fs-5"></i>
                    <div>{error}</div>
                  </div>
                )}

                {success && (
                  <div className="alert alert-success d-flex align-items-center mb-4">
                    <i className="bi bi-check-circle-fill me-2 fs-5"></i>
                    <div>{success}</div>
                  </div>
                )}

                {loading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status"></div>
                    <p className="mt-2 text-muted small">Loading vehicle data...</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                      {/* Brand */}
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold text-secondary">
                          Vehicle Brand <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          name="brand"
                          className="form-control bg-light"
                          value={formData.brand}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      {/* Model */}
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold text-secondary">
                          Vehicle Model <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          name="model"
                          className="form-control bg-light"
                          value={formData.model}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      {/* Vehicle Number */}
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold text-secondary">
                          Vehicle Registration Number <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          name="vehicleNumber"
                          className="form-control bg-light text-uppercase font-monospace fw-bold"
                          value={formData.vehicleNumber}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      {/* Manufacturing Year */}
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold text-secondary">
                          Year of Manufacture <span className="text-danger">*</span>
                        </label>
                        <input
                          type="number"
                          name="year"
                          className="form-control bg-light"
                          min="1980"
                          max={new Date().getFullYear() + 1}
                          value={formData.year}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      {/* Fuel Type */}
                      <div className="col-12">
                        <label className="form-label small fw-semibold text-secondary">
                          Fuel Type <span className="text-danger">*</span>
                        </label>
                        <select
                          name="fuelType"
                          className="form-select bg-light"
                          value={formData.fuelType}
                          onChange={handleChange}
                          required
                        >
                          <option value="Petrol">Petrol</option>
                          <option value="Diesel">Diesel</option>
                          <option value="Electric">Electric</option>
                          <option value="Hybrid">Hybrid</option>
                          <option value="CNG">CNG</option>
                        </select>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="d-flex justify-content-end gap-3 mt-4 pt-3 border-top">
                      <Link
                        to="/customer/vehicles"
                        className="btn btn-outline-secondary rounded-pill px-4"
                      >
                        Cancel
                      </Link>
                      <button
                        type="submit"
                        className="btn btn-primary rounded-pill px-5 fw-semibold shadow-sm"
                        disabled={submitting}
                      >
                        {submitting ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                            ></span>
                            Updating...
                          </>
                        ) : (
                          "Update Vehicle"
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default EditVehicle;