import React from "react";
import toyotaImg from "../assets/images/toyota land cruiser.webp";
import pajeroImg from "../assets/images/mitsubishi pajero.jpg";
import bmwImg from "../assets/images/bmw i4.jpg";
import defaultCarImg from "../assets/images/cars/car6.jpg";

function VehicleCard({ vehicle, onEdit, onDelete }) {
  if (!vehicle) {
    return (
      <div className="card shadow-sm border-0 rounded-4">
        <div className="card-body text-center py-4">
          <p className="text-muted mb-0">Vehicle data not available</p>
        </div>
      </div>
    );
  }

  // Determine car image based on brand/model
  const getVehicleImage = () => {
    const brand = (vehicle.brand || "").toLowerCase();
    const model = (vehicle.model || "").toLowerCase();

    if (brand.includes("toyota") || model.includes("land cruiser")) {
      return toyotaImg;
    }
    if (brand.includes("mitsubishi") || model.includes("pajero")) {
      return pajeroImg;
    }
    if (brand.includes("bmw") || model.includes("i4")) {
      return bmwImg;
    }
    return defaultCarImg;
  };

  const fuelBadges = {
    Petrol: "bg-danger",
    Diesel: "bg-warning text-dark",
    Electric: "bg-success",
    Hybrid: "bg-info text-dark",
    CNG: "bg-primary",
  };

  return (
    <div className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden vehicle-card transition-all">
      {/* Vehicle Image */}
      <div
        className="position-relative bg-dark d-flex align-items-center justify-content-center"
        style={{ height: "190px", overflow: "hidden" }}
      >
        <img
          src={getVehicleImage()}
          alt={`${vehicle.brand} ${vehicle.model}`}
          className="w-100 h-100"
          style={{
            objectFit: "cover",
            transition: "transform 0.4s ease",
          }}
          onError={(e) => {
            e.target.src = defaultCarImg;
          }}
        />
        {/* Fuel Badge */}
        <span
          className={`badge position-absolute top-0 end-0 m-3 px-3 py-2 rounded-pill shadow-sm ${
            fuelBadges[vehicle.fuelType] || "bg-secondary"
          }`}
          style={{ fontSize: "11px", letterSpacing: "0.5px" }}
        >
          {vehicle.fuelType || "Petrol"}
        </span>
      </div>

      {/* Card Body */}
      <div className="card-body p-4 d-flex flex-column">
        {/* Car Name */}
        <h5 className="card-title fw-bold text-dark mb-1">
          {vehicle.brand || "Unknown"} {vehicle.model || "Vehicle"}
        </h5>
        <p className="text-secondary small mb-3">
          Manufacturing Year: <strong className="text-dark">{vehicle.year || "N/A"}</strong>
        </p>

        {/* License Plate Banner */}
        <div
          className="p-2 mb-3 rounded-3 text-center d-flex align-items-center justify-content-center"
          style={{
            backgroundColor: "#f8fafc",
            border: "1px dashed #cbd5e1",
          }}
        >
          <i className="bi bi-card-text text-muted me-2"></i>
          <span className="font-monospace fw-bold text-dark tracking-wider" style={{ letterSpacing: "1px" }}>
            {vehicle.vehicleNumber || "N/A"}
          </span>
        </div>

        {/* Actions */}
        <div className="d-flex gap-2 mt-auto pt-2">
          {onEdit && (
            <button
              type="button"
              className="btn btn-outline-primary btn-sm flex-grow-1 rounded-pill py-2 fw-semibold"
              onClick={() => onEdit(vehicle)}
            >
              <i className="bi bi-pencil-square me-1"></i>
              Edit
            </button>
          )}

          {onDelete && (
            <button
              type="button"
              className="btn btn-outline-danger btn-sm rounded-pill px-3 py-2"
              onClick={() => onDelete(vehicle)}
              title="Delete Vehicle"
            >
              <i className="bi bi-trash3"></i>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default VehicleCard;