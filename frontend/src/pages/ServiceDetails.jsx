import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getServiceById } from "../services/serviceService";

const serviceData = {
  engine: {
    title: "Engine Service",
    icon: "bi bi-gear-wide-connected",
    description:
      "Complete engine inspection and maintenance to keep your vehicle running smoothly.",
    features: [
      "Engine performance inspection",
      "Engine oil and filter check",
      "Spark plug inspection",
      "Engine diagnostic check",
      "Complete engine health report",
    ],
  },

  brake: {
    title: "Brake Service",
    icon: "bi bi-disc",
    description:
      "Professional brake inspection and maintenance for a safer driving experience.",
    features: [
      "Brake pad inspection",
      "Brake disc inspection",
      "Brake fluid check",
      "Brake system inspection",
      "Brake performance testing",
    ],
  },

  battery: {
    title: "Battery Service",
    icon: "bi bi-battery-charging",
    description:
      "Battery testing and electrical system inspection to prevent unexpected breakdowns.",
    features: [
      "Battery health check",
      "Battery voltage testing",
      "Battery terminal cleaning",
      "Charging system inspection",
      "Battery replacement support",
    ],
  },

  oil: {
    title: "Oil Change",
    icon: "bi bi-droplet",
    description:
      "Regular engine oil and filter replacement for better engine performance.",
    features: [
      "Engine oil replacement",
      "Oil filter replacement",
      "Engine oil level check",
      "Leak inspection",
      "Engine performance check",
    ],
  },

  ac: {
    title: "AC Service",
    icon: "bi bi-wind",
    description:
      "Complete air conditioning inspection and maintenance for a comfortable drive.",
    features: [
      "AC cooling performance check",
      "AC filter inspection",
      "Gas level inspection",
      "AC component inspection",
      "Airflow testing",
    ],
  },

  general: {
    title: "General Service",
    icon: "bi bi-tools",
    description:
      "Complete vehicle inspection and regular maintenance by skilled mechanics.",
    features: [
      "Complete vehicle inspection",
      "Engine check",
      "Brake check",
      "Tyre inspection",
      "Fluid level inspection",
    ],
  },
};

function ServiceDetails() {
  const { serviceId } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [service, setService] = useState(serviceData[serviceId] || null);
  const [loading, setLoading] = useState(!serviceData[serviceId]);

  useEffect(() => {
    if (serviceData[serviceId]) {
      setService(serviceData[serviceId]);
      setLoading(false);
      return;
    }

    let isMounted = true;
    const fetchFromApi = async () => {
      try {
        setLoading(true);
        const res = await getServiceById(serviceId);
        const s = res?.service || res?.data;
        if (s && isMounted) {
          setService({
            _id: s._id,
            title: s.name,
            icon: s.icon ? (s.icon.startsWith("bi ") ? s.icon : `bi ${s.icon}`) : "bi bi-tools",
            description: s.description,
            price: s.price,
            duration: s.duration,
            features: [
              "Certified mechanic inspection",
              "Precision workshop equipment",
              "Genuine replacement parts",
              "Standard service warranty",
              "Complete vehicle health summary",
            ],
          });
        }
      } catch (err) {
        console.warn("Could not fetch service by ID:", err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchFromApi();
    return () => {
      isMounted = false;
    };
  }, [serviceId]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary mb-3" role="status"></div>
        <p className="text-muted">Loading service specifications...</p>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="container py-5 text-center">
        <h2 className="fw-bold">Service Not Found</h2>

        <p className="text-muted">
          The service you are looking for does not exist.
        </p>

        <Link to="/services" className="btn btn-primary">
          Back to Services
        </Link>
      </div>
    );
  }

  const bookUrl =
    isAuthenticated && user?.role === "customer"
      ? `/customer/book-service${service._id ? `?serviceId=${service._id}` : ""}`
      : "/login";

  return (
    <>
      {/* Hero */}
      <section className="bg-dark text-white py-5">
        <div className="container py-5 text-center">
          <i
            className={`${service.icon} text-primary`}
            style={{ fontSize: "80px" }}
          ></i>

          <h1 className="display-5 fw-bold mt-3">
            {service.title}
          </h1>

          <p className="lead text-light mt-3">
            Professional service from trusted mechanics.
          </p>

          {(service.price !== undefined || service.duration) && (
            <div className="d-flex justify-content-center gap-3 mt-3">
              {service.price !== undefined && (
                <span className="badge bg-primary fs-6 px-3 py-2">
                  ₹{service.price}
                </span>
              )}
              {service.duration && (
                <span className="badge bg-secondary fs-6 px-3 py-2">
                  <i className="bi bi-clock me-1"></i> {service.duration}
                </span>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Details */}
      <section className="py-5">
        <div className="container">

          <div className="row justify-content-center">
            <div className="col-lg-8">

              <div className="card border-0 shadow-sm p-4 p-md-5">

                <h2 className="fw-bold mb-3">
                  About {service.title}
                </h2>

                <p className="text-muted">
                  {service.description}
                </p>

                <hr />

                <h4 className="fw-bold mb-3">
                  What's Included?
                </h4>

                <ul className="list-group list-group-flush mb-4">
                  {service.features.map((feature, index) => (
                    <li
                      key={index}
                      className="list-group-item px-0"
                    >
                      <i className="bi bi-check-circle-fill text-primary me-2"></i>
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="d-flex gap-2 flex-wrap">
                  <Link
                    to={bookUrl}
                    className="btn btn-primary"
                  >
                    <i className="bi bi-calendar-check me-2"></i>
                    Book This Service
                  </Link>

                  <Link
                    to="/services"
                    className="btn btn-outline-secondary"
                  >
                    Back to Services
                  </Link>
                </div>

              </div>

            </div>
          </div>

        </div>
      </section>
    </>
  );
}

export default ServiceDetails;