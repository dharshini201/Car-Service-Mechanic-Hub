import React from "react";
import { Link } from "react-router-dom";
import acImg from "../assets/images/services/ac-service.jpg";
import batteryImg from "../assets/images/services/battery-service.jpg";
import brakeImg from "../assets/images/services/brake-service.jpg";
import engineImg from "../assets/images/services/engine-service.jpg";
import generalImg from "../assets/images/services/general-service.jpg";
import oilImg from "../assets/images/services/oil-change.jpg";

function ServiceCard({ service }) {
  if (!service) return null;

  const title = service.name || service.title || "Car Service";
  const desc = service.description || "Professional automotive service";
  const price = service.price !== undefined ? service.price : null;
  const duration = service.duration || "1 - 2 Hours";
  const id = service._id || service.id;

  // Determine service banner image
  const getServiceImage = () => {
    const t = title.toLowerCase();
    if (t.includes("engine")) return engineImg;
    if (t.includes("brake")) return brakeImg;
    if (t.includes("oil")) return oilImg;
    if (t.includes("ac") || t.includes("air")) return acImg;
    if (t.includes("battery")) return batteryImg;
    return generalImg;
  };

  return (
    <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden service-card transition-all">
      {/* Service Image Banner */}
      <div
        className="position-relative bg-dark"
        style={{ height: "180px", overflow: "hidden" }}
      >
        <img
          src={getServiceImage()}
          alt={title}
          className="w-100 h-100"
          style={{ objectFit: "cover", transition: "transform 0.4s ease" }}
        />
        <div
          className="position-absolute bottom-0 start-0 w-100 p-3 text-white d-flex align-items-end justify-content-between"
          style={{
            background: "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.85) 100%)",
          }}
        >
          {price !== null && (
            <span className="badge bg-primary px-3 py-2 rounded-pill fs-6 fw-bold shadow-sm">
              ₹{price}
            </span>
          )}
          <span className="badge bg-dark bg-opacity-75 text-light px-2 py-1 rounded-pill small">
            <i className="bi bi-clock me-1"></i>
            {duration}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="card-body p-4 d-flex flex-column">
        <h5 className="card-title fw-bold text-dark mb-2">{title}</h5>

        <p className="card-text text-muted small mb-4 flex-grow-1" style={{ lineHeight: "1.6" }}>
          {desc}
        </p>

        {/* Buttons */}
        <div className="d-flex gap-2 mt-auto">
          <Link
            to={`/services/${id}`}
            className="btn btn-outline-primary btn-sm rounded-pill flex-grow-1 py-2 fw-semibold"
          >
            <i className="bi bi-info-circle me-1"></i>
            View Details
          </Link>
          <Link
            to={`/customer/book-service?serviceId=${id}`}
            className="btn btn-primary btn-sm rounded-pill px-3 py-2 fw-semibold"
            title="Book This Service"
          >
            <i className="bi bi-calendar-check me-1"></i>
            Book
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ServiceCard;