import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { addVehicle } from "../../services/vehicleService";

function AddVehicle() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    vehicleNumber: "",
    year: new Date().getFullYear(),
    fuelType: "Petrol",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "vehicleNumber" ? value.toUpperCase() : value,
    }));
    setError("");
  };

  const handleQuickFill = (brand, model, fuelType) => {
    setFormData((prev) => ({
      ...prev,
      brand,
      model,
      fuelType,
    }));
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
      setError("Please fill in all required vehicle details.");
      return;
    }

    try {
      setLoading(true);
      const res = await addVehicle({
        ...formData,
        year: Number(formData.year),
      });

      if (res.success) {
        setSuccess("Vehicle registered successfully! Redirecting...");
        setTimeout(() => {
          navigate("/customer/vehicles");
        }, 800);
      }
    } catch (err) {
      console.error("Add vehicle error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to add vehicle. Please check your inputs."
      );
    } finally {
      setLoading(false);
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
            <h2 className="fw-bold mb-1 text-dark">Add New Vehicle</h2>
            <p className="text-secondary mb-0">
              Register your car to enable easy service scheduling and track maintenance history.
            </p>
          </div>

          <div className="row justify-content-center">
            <div className="col-lg-8">
              {/* Quick Select Preset Suggestions */}
              <div className="card border-0 shadow-sm rounded-4 p-3 mb-4 bg-white">
                <span className="text-secondary small fw-semibold mb-2">
                  <i className="bi bi-lightning-charge-fill text-warning me-1"></i>
                  Quick Pre-fills (Supported Models):
                </span>
                <div className="d-flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary rounded-pill"
                    onClick={() => handleQuickFill("Toyota", "Land Cruiser", "Diesel")}
                  >
                    Toyota Land Cruiser (Diesel)
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary rounded-pill"
                    onClick={() => handleQuickFill("Mitsubishi", "Pajero", "Diesel")}
                  >
                    Mitsubishi Pajero (Diesel)
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary rounded-pill"
                    onClick={() => handleQuickFill("BMW", "i4", "Electric")}
                  >
                    BMW i4 (Electric)
                  </button>
                </div>
              </div>

              {/* Form Card */}
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

                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    {/* Brand */}
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold text-secondary">
                        Vehicle Brand <span className="text-danger">*</span>
                      </label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">
                          <i className="bi bi-car-front text-muted"></i>
                        </span>
                        <input
                          type="text"
                          name="brand"
                          className="form-control bg-light border-start-0"
                          placeholder="e.g. Toyota, BMW, Mitsubishi"
                          value={formData.brand}
                          onChange={handleChange}
                          required
                        />
                      </div>
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
                        placeholder="e.g. Land Cruiser, i4, Pajero"
                        value={formData.model}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    {/* Vehicle Registration Number */}
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold text-secondary">
                        Vehicle License Number <span className="text-danger">*</span>
                      </label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0 font-monospace">
                          #
                        </span>
                        <input
                          type="text"
                          name="vehicleNumber"
                          className="form-control bg-light border-start-0 text-uppercase font-monospace fw-bold"
                          placeholder="TN01AB1234"
                          value={formData.vehicleNumber}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="form-text small">Automatically capitalized for registration accuracy.</div>
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

                  {/* Buttons */}
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
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                          ></span>
                          Saving...
                        </>
                      ) : (
                        "Save Vehicle"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AddVehicle;