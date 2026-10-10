import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getServices } from "../services/serviceService";

const defaultServices = [
  {
    id: "engine",
    icon: "bi bi-gear-wide-connected",
    title: "Engine Service",
    description:
      "Complete engine inspection, maintenance and performance check.",
  },
  {
    id: "brake",
    icon: "bi bi-disc",
    title: "Brake Service",
    description:
      "Brake inspection, repair and replacement for safe driving.",
  },
  {
    id: "battery",
    icon: "bi bi-battery-charging",
    title: "Battery Service",
    description:
      "Battery testing, replacement and electrical system inspection.",
  },
  {
    id: "oil",
    icon: "bi bi-droplet",
    title: "Oil Change",
    description:
      "Engine oil and filter replacement to keep your car running smoothly.",
  },
  {
    id: "ac",
    icon: "bi bi-wind",
    title: "AC Service",
    description:
      "Air conditioning inspection, cleaning and gas service.",
  },
  {
    id: "general",
    icon: "bi bi-tools",
    title: "General Service",
    description:
      "Complete vehicle checkup and regular maintenance service.",
  },
];

function Services() {
  const [servicesList, setServicesList] = useState(defaultServices);

  useEffect(() => {
    let isMounted = true;
    const loadServices = async () => {
      try {
        const res = await getServices();
        const apiServices = res?.services || res?.data || (Array.isArray(res) ? res : []);
        if (apiServices.length > 0 && isMounted) {
          const mapped = apiServices.map((s) => ({
            id: s._id,
            icon: s.icon ? (s.icon.startsWith("bi ") ? s.icon : `bi ${s.icon}`) : "bi bi-tools",
            title: s.name,
            description: s.description,
            price: s.price,
            duration: s.duration,
          }));
          setServicesList(mapped);
        }
      } catch (err) {
        console.warn("Could not fetch API services:", err.message);
      }
    };

    loadServices();
    return () => {
      isMounted = false;
    };
  }, []);
  return (
    <>
      {/* ================= SERVICES HERO ================= */}
      <section className="bg-dark text-white py-5">
        <div className="container py-5 text-center">
          <span className="badge bg-primary mb-3">
            Our Services
          </span>

          <h1 className="display-4 fw-bold">
            Professional Car Services
          </h1>

          <p className="lead text-light mt-3">
            Quality vehicle maintenance from trusted mechanics.
          </p>
        </div>
      </section>


      {/* ================= WHY OUR SERVICES ================= */}
      <section className="py-5 bg-light">
        <div className="container py-4">

          <div className="text-center mb-5">
            <span
              className="text-primary fw-bold text-uppercase"
              style={{ letterSpacing: "2px" }}
            >
              WHY OUR SERVICES
            </span>

            <h2 className="display-6 fw-bold mt-2 mb-3">
              Quality Care For{" "}
              <span className="text-primary">
                Your Vehicle
              </span>
            </h2>

            <p
              className="text-muted fs-5 mx-auto"
              style={{ maxWidth: "650px" }}
            >
              We focus on professional workmanship, reliable
              maintenance and a better service experience.
            </p>
          </div>


          <div className="row g-4">

            {/* Experienced Mechanics */}
            <div className="col-md-4">
              <div
                className="card border-0 shadow-sm h-100 text-center p-4"
                style={{
                  borderRadius: "16px",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div
                  className="mx-auto mb-4 rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center"
                  style={{
                    width: "80px",
                    height: "80px",
                  }}
                >
                  <i className="bi bi-person-check text-primary fs-1"></i>
                </div>

                <h4 className="fw-bold mb-3">
                  Experienced Mechanics
                </h4>

                <p className="text-muted mb-0">
                  Skilled mechanics who understand your vehicle
                  and provide professional service.
                </p>
              </div>
            </div>


            {/* Quality Parts */}
            <div className="col-md-4">
              <div
                className="card border-0 shadow-sm h-100 text-center p-4"
                style={{
                  borderRadius: "16px",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div
                  className="mx-auto mb-4 rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center"
                  style={{
                    width: "80px",
                    height: "80px",
                  }}
                >
                  <i className="bi bi-award text-primary fs-1"></i>
                </div>

                <h4 className="fw-bold mb-3">
                  Quality Service
                </h4>

                <p className="text-muted mb-0">
                  We follow proper maintenance practices to keep
                  your vehicle performing reliably.
                </p>
              </div>
            </div>


            {/* Transparent Pricing */}
            <div className="col-md-4">
              <div
                className="card border-0 shadow-sm h-100 text-center p-4"
                style={{
                  borderRadius: "16px",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div
                  className="mx-auto mb-4 rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center"
                  style={{
                    width: "80px",
                    height: "80px",
                  }}
                >
                  <i className="bi bi-currency-rupee text-primary fs-1"></i>
                </div>

                <h4 className="fw-bold mb-3">
                  Transparent Pricing
                </h4>

                <p className="text-muted mb-0">
                  Clear service information helps you understand
                  what your vehicle needs.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* ================= SERVICES CARDS ================= */}
      <section className="py-5">
        <div className="container">

          <div className="text-center mb-5">
            <span
              className="text-primary fw-bold text-uppercase"
              style={{ letterSpacing: "2px" }}
            >
              WHAT WE OFFER
            </span>

            <h2 className="display-6 fw-bold mt-2">
              Choose Your{" "}
              <span className="text-primary">
                Service
              </span>
            </h2>

            <p className="text-muted fs-5">
              Select a service to learn more about the work
              required for your vehicle.
            </p>
          </div>


          <div className="row g-4">
            {servicesList.map((service) => (
              <div
                className="col-md-6 col-lg-4"
                key={service.id}
              >
                <div
                  className="card h-100 border-0 shadow-sm p-4"
                  style={{
                    borderRadius: "16px",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-8px)";
                    e.currentTarget.style.boxShadow =
                      "0 15px 35px rgba(0,0,0,0.12)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 .125rem .25rem rgba(0,0,0,.075)";
                  }}
                >

                  <div className="text-center">

                    <div
                      className="mx-auto rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center"
                      style={{
                        width: "85px",
                        height: "85px",
                      }}
                    >
                      <i
                        className={`${service.icon} text-primary`}
                        style={{ fontSize: "45px" }}
                      ></i>
                    </div>

                    <h4 className="fw-bold mt-4">
                      {service.title}
                    </h4>

                  </div>


                  <p className="text-muted text-center mt-2">
                    {service.description}
                  </p>


                  <div className="text-center mt-auto pt-3">
                    <Link
                      to={`/services/${service.id}`}
                      className="btn btn-outline-primary"
                    >
                      <i className="bi bi-info-circle me-2"></i>
                      View Details
                    </Link>
                  </div>

                </div>
              </div>
            ))}
          </div>

        </div>
      </section>


      {/* ================= SERVICE PROCESS ================= */}
      <section className="py-5 bg-light">
        <div className="container py-4">

          <div className="text-center mb-5">
            <span
              className="text-primary fw-bold text-uppercase"
              style={{ letterSpacing: "2px" }}
            >
              SERVICE PROCESS
            </span>

            <h2 className="display-6 fw-bold mt-2 mb-3">
              How Our Service{" "}
              <span className="text-primary">
                Works
              </span>
            </h2>

            <p
              className="text-muted fs-5 mx-auto"
              style={{ maxWidth: "650px" }}
            >
              A simple process designed to make vehicle servicing
              convenient for every customer.
            </p>
          </div>


          <div className="row g-4">

            {/* Step 1 */}
            <div className="col-md-6 col-lg-3">
              <div className="text-center h-100 p-3">

                <div
                  className="mx-auto mb-4 rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                  style={{
                    width: "80px",
                    height: "80px",
                  }}
                >
                  <i className="bi bi-search fs-2"></i>
                </div>

                <span className="badge bg-dark mb-3">
                  STEP 01
                </span>

                <h5 className="fw-bold">
                  Choose Service
                </h5>

                <p className="text-muted">
                  Select the service your vehicle requires.
                </p>

              </div>
            </div>


            {/* Step 2 */}
            <div className="col-md-6 col-lg-3">
              <div className="text-center h-100 p-3">

                <div
                  className="mx-auto mb-4 rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                  style={{
                    width: "80px",
                    height: "80px",
                  }}
                >
                  <i className="bi bi-calendar-check fs-2"></i>
                </div>

                <span className="badge bg-dark mb-3">
                  STEP 02
                </span>

                <h5 className="fw-bold">
                  Book Appointment
                </h5>

                <p className="text-muted">
                  Select a convenient date and time for your service.
                </p>

              </div>
            </div>


            {/* Step 3 */}
            <div className="col-md-6 col-lg-3">
              <div className="text-center h-100 p-3">

                <div
                  className="mx-auto mb-4 rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                  style={{
                    width: "80px",
                    height: "80px",
                  }}
                >
                  <i className="bi bi-tools fs-2"></i>
                </div>

                <span className="badge bg-dark mb-3">
                  STEP 03
                </span>

                <h5 className="fw-bold">
                  Vehicle Inspection
                </h5>

                <p className="text-muted">
                  Our mechanics inspect your vehicle and perform
                  the required service.
                </p>

              </div>
            </div>


            {/* Step 4 */}
            <div className="col-md-6 col-lg-3">
              <div className="text-center h-100 p-3">

                <div
                  className="mx-auto mb-4 rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                  style={{
                    width: "80px",
                    height: "80px",
                  }}
                >
                  <i className="bi bi-check-circle fs-2"></i>
                </div>

                <span className="badge bg-dark mb-3">
                  STEP 04
                </span>

                <h5 className="fw-bold">
                  Get Your Car Back
                </h5>

                <p className="text-muted">
                  Complete the service and get your vehicle ready
                  for the road.
                </p>

              </div>
            </div>

          </div>
        </div>
      </section>


      {/* ================= CALL TO ACTION ================= */}
      <section className="bg-dark text-white py-5">
        <div className="container text-center py-4">

          <i className="bi bi-car-front display-3 text-primary"></i>

          <h2 className="fw-bold mt-3">
            Need a Car Service?
          </h2>

          <p className="text-secondary lead mx-auto">
            Choose a service and get your vehicle checked by a
            professional mechanic.
          </p>

          <Link
            to="/login"
            className="btn btn-primary btn-lg px-5 py-3 mt-3"
          >
            <i className="bi bi-calendar-check me-2"></i>
            Book Your Service
          </Link>

        </div>
      </section>
    </>
  );
}

export default Services;