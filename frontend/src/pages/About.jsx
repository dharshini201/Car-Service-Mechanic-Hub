import React from "react";
import { Link } from "react-router-dom";
import carImage from "../assets/images/toyota land cruiser.webp";

function About() {
  return (
    <>
      {/* ================= ABOUT HERO ================= */}
      <section className="bg-dark text-white py-5">
        <div className="container py-5 text-center">
          <span className="badge bg-primary mb-3">
            About Us
          </span>

          <h1 className="display-4 fw-bold">
            Your Trusted Car Service Partner
          </h1>

          <p className="lead text-light mt-3">
            We make car servicing simple, reliable and convenient.
          </p>
        </div>
      </section>

      {/* ================= ABOUT CONTENT ================= */}
      <section className="py-5 bg-light">
        <div className="container py-5">
          <div className="row align-items-center g-5">

            {/* Image */}
            <div className="col-lg-6 text-center">
              <img
                src={carImage}
                alt="MRT Car Service Vehicle"
                className="img-fluid rounded shadow-sm"
                style={{
                  maxHeight: "500px",
                  width: "100%",
                  objectFit: "contain",
                }}
              />
            </div>

            {/* Content */}
            <div className="col-lg-6">
              <span
                className="text-primary fw-bold text-uppercase"
                style={{ letterSpacing: "2px" }}
              >
                ABOUT MRT
              </span>

              <h2 className="fw-bold display-6 mt-2 mb-4">
                About MRT Car Service
              </h2>

              <p className="text-muted fs-5">
                MRT Car Service is a platform designed to connect
                vehicle owners with trusted and skilled mechanics.
              </p>

              <p className="text-muted fs-5">
                Customers can manage their vehicles, explore
                available services, book appointments and track
                their service requests from one convenient platform.
              </p>

              <p className="text-muted fs-5">
                Our goal is to make vehicle maintenance easier,
                transparent and accessible for everyone.
              </p>

              <Link
                to="/services"
                className="btn btn-primary btn-lg mt-3"
              >
                <i className="bi bi-tools me-2"></i>
                Explore Our Services
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ================= MISSION & VISION ================= */}
      <section className="py-5">
        <div className="container">

          <div className="text-center mb-5">
            <span
              className="text-primary fw-bold text-uppercase"
              style={{ letterSpacing: "2px" }}
            >
              OUR PURPOSE
            </span>

            <h2 className="display-6 fw-bold mt-2">
              Mission & Vision
            </h2>
          </div>

          <div className="row g-4">

            {/* Mission */}
            <div className="col-md-6">
              <div
                className="card h-100 border-0 shadow-sm p-4"
                style={{ borderRadius: "16px" }}
              >
                <div className="mb-3">
                  <div
                    className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center"
                    style={{
                      width: "70px",
                      height: "70px",
                    }}
                  >
                    <i className="bi bi-bullseye text-primary fs-2"></i>
                  </div>
                </div>

                <h3 className="fw-bold">
                  Our Mission
                </h3>

                <p className="text-muted mb-0">
                  To provide vehicle owners with a simple and
                  reliable platform to find professional mechanics,
                  book services and manage their vehicle maintenance.
                </p>
              </div>
            </div>

            {/* Vision */}
            <div className="col-md-6">
              <div
                className="card h-100 border-0 shadow-sm p-4"
                style={{ borderRadius: "16px" }}
              >
                <div className="mb-3">
                  <div
                    className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center"
                    style={{
                      width: "70px",
                      height: "70px",
                    }}
                  >
                    <i className="bi bi-eye text-primary fs-2"></i>
                  </div>
                </div>

                <h3 className="fw-bold">
                  Our Vision
                </h3>

                <p className="text-muted mb-0">
                  To build a trusted digital car service ecosystem
                  where customers and mechanics can connect easily
                  and maintain vehicles with confidence.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= OUR VALUES ================= */}
      <section className="py-5 bg-light">
        <div className="container py-4">

          <div className="text-center mb-5">
            <span
              className="text-primary fw-bold text-uppercase"
              style={{ letterSpacing: "2px" }}
            >
              WHAT WE STAND FOR
            </span>

            <h2 className="display-6 fw-bold mt-2 mb-3">
              Our Core{" "}
              <span className="text-primary">
                Values
              </span>
            </h2>

            <p
              className="text-muted fs-5 mx-auto"
              style={{ maxWidth: "650px" }}
            >
              The principles that guide the way we serve our
              customers and take care of their vehicles.
            </p>
          </div>

          <div className="row g-4">

            {/* Quality */}
            <div className="col-md-6 col-lg-3">
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
                    width: "75px",
                    height: "75px",
                  }}
                >
                  <i className="bi bi-award text-primary fs-2"></i>
                </div>

                <h4 className="fw-bold">
                  Quality
                </h4>

                <p className="text-muted mb-0">
                  We focus on delivering dependable and
                  professional vehicle service.
                </p>
              </div>
            </div>

            {/* Transparency */}
            <div className="col-md-6 col-lg-3">
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
                    width: "75px",
                    height: "75px",
                  }}
                >
                  <i className="bi bi-eye text-primary fs-2"></i>
                </div>

                <h4 className="fw-bold">
                  Transparency
                </h4>

                <p className="text-muted mb-0">
                  We believe in clear communication and
                  transparent service.
                </p>
              </div>
            </div>

            {/* Customer First */}
            <div className="col-md-6 col-lg-3">
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
                    width: "75px",
                    height: "75px",
                  }}
                >
                  <i className="bi bi-heart text-primary fs-2"></i>
                </div>

                <h4 className="fw-bold">
                  Customer First
                </h4>

                <p className="text-muted mb-0">
                  Customer satisfaction is always at the heart
                  of our service.
                </p>
              </div>
            </div>

            {/* Reliability */}
            <div className="col-md-6 col-lg-3">
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
                    width: "75px",
                    height: "75px",
                  }}
                >
                  <i className="bi bi-shield-check text-primary fs-2"></i>
                </div>

                <h4 className="fw-bold">
                  Reliability
                </h4>

                <p className="text-muted mb-0">
                  We aim to provide dependable support whenever
                  your vehicle needs attention.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= WHY CUSTOMERS TRUST MRT ================= */}
      <section className="py-5 bg-white">
        <div className="container py-4">

          <div className="row align-items-center g-5">

            {/* Left Content */}
            <div className="col-lg-6">

              <span
                className="text-primary fw-bold text-uppercase"
                style={{ letterSpacing: "2px" }}
              >
                CUSTOMER TRUST
              </span>

              <h2 className="display-6 fw-bold mt-2 mb-4">
                Why Customers Trust{" "}
                <span className="text-primary">
                  MRT
                </span>
              </h2>

              <p className="text-muted fs-5 mb-4">
                We combine professional service with a simple
                digital experience so customers can manage their
                vehicle maintenance with confidence.
              </p>

              <div className="d-flex mb-4">
                <div className="text-primary me-3">
                  <i className="bi bi-person-check-fill fs-3"></i>
                </div>

                <div>
                  <h5 className="fw-bold mb-1">
                    Professional Mechanics
                  </h5>

                  <p className="text-muted mb-0">
                    Connect with skilled mechanics who understand
                    your vehicle's service requirements.
                  </p>
                </div>
              </div>

              <div className="d-flex mb-4">
                <div className="text-primary me-3">
                  <i className="bi bi-calendar-check-fill fs-3"></i>
                </div>

                <div>
                  <h5 className="fw-bold mb-1">
                    Easy Service Booking
                  </h5>

                  <p className="text-muted mb-0">
                    Book and manage your vehicle service
                    appointments conveniently.
                  </p>
                </div>
              </div>

              <div className="d-flex">
                <div className="text-primary me-3">
                  <i className="bi bi-headset fs-3"></i>
                </div>

                <div>
                  <h5 className="fw-bold mb-1">
                    Reliable Support
                  </h5>

                  <p className="text-muted mb-0">
                    Get dependable service support throughout
                    your vehicle maintenance journey.
                  </p>
                </div>
              </div>

            </div>

            {/* Right Highlight Card */}
            <div className="col-lg-6">

              <div
                className="bg-dark text-white rounded-4 shadow-lg p-5"
              >
                <div className="text-center mb-4">
                  <img
                    src={carImage}
                    alt="MRT Car Service Vehicle"
                    className="img-fluid"
                    style={{
                      width: "260px",
                      height: "160px",
                      objectFit: "contain",
                    }}
                  />
                </div>

                <h3 className="fw-bold mb-3">
                  Your Vehicle,
                  <br />
                  Our Responsibility
                </h3>

                <p className="text-secondary fs-5">
                  From routine maintenance to essential repairs,
                  we are committed to making your car service
                  experience simple and trustworthy.
                </p>

                <div className="row mt-4">

                  <div className="col-6">
                    <h3 className="fw-bold text-primary">
                      100%
                    </h3>

                    <small className="text-secondary">
                      Customer Focus
                    </small>
                  </div>

                  <div className="col-6">
                    <h3 className="fw-bold text-primary">
                      24/7
                    </h3>

                    <small className="text-secondary">
                      Online Access
                    </small>
                  </div>

                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ================= BOOK YOUR SERVICE CTA ================= */}
      <section className="py-5">
        <div className="container py-3">

          <div
            className="bg-primary text-white rounded-4 shadow-lg p-5 text-center"
          >

            {/* Original Car Image */}
            <img
              src={carImage}
              alt="MRT Car Service Vehicle"
              className="img-fluid mb-3"
              style={{
                width: "280px",
                height: "170px",
                objectFit: "contain",
              }}
            />

            <h2 className="fw-bold mt-3">
              Take Better Care Of
              <br />
              Your Car Today
            </h2>

            <p
              className="lead mx-auto mb-4"
              style={{ maxWidth: "650px" }}
            >
              Explore our professional car services and give
              your vehicle the care it deserves.
            </p>

            <Link
              to="/login"
              className="btn btn-light btn-lg px-5 py-3 fw-semibold"
            >
              <i className="bi bi-calendar-check me-2"></i>
              Book Your Service
            </Link>

          </div>

        </div>
      </section>
    </>
  );
}

export default About;