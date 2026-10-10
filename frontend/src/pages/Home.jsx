import React from "react";
import { Link } from "react-router-dom";
import heroImage from "../assets/hero.png";

function Home() {
  return (
    <>
      {/* ================= HERO SECTION ================= */}
      <section
        className="position-relative text-white"
        style={{
          minHeight: "600px",
          backgroundImage: `linear-gradient(
            90deg,
            rgba(0, 0, 0, 0.92) 0%,
            rgba(0, 0, 0, 0.72) 42%,
            rgba(0, 0, 0, 0.15) 100%
          ), url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container py-5">
          <div
            className="row align-items-center"
            style={{ minHeight: "500px" }}
          >
            <div className="col-lg-7">

              {/* Trusted Badge */}
              <span className="badge bg-primary rounded-pill px-3 py-2 mb-4 fs-6">
                <i className="bi bi-shield-check me-2"></i>
                Trusted Car Service
              </span>

              {/* Main Heading */}
              <h1
                className="display-3 fw-bold mb-3"
                style={{ lineHeight: "1.1" }}
              >
                Your Car Deserves
                <br />
                <span className="text-primary">
                  The Best Care
                </span>
              </h1>

              {/* Description */}
              <p
                className="lead text-light mb-4"
                style={{ maxWidth: "560px" }}
              >
                Find trusted mechanics and book professional
                car services quickly and easily.
              </p>

              {/* Buttons */}
              <div className="d-flex flex-wrap gap-3">

                <Link
                  to="/services"
                  className="btn btn-primary btn-lg px-4 py-3 fw-semibold"
                >
                  <i className="bi bi-tools me-2"></i>
                  Explore Services
                </Link>

                <Link
                  to="/customer/book-service"
                  className="btn btn-outline-light btn-lg px-4 py-3 fw-semibold"
                >
                  <i className="bi bi-calendar-check me-2"></i>
                  Book a Service
                </Link>

              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ================= WHY CHOOSE US ================= */}
      <section className="py-5 bg-white">
        <div className="container py-4">

          <div className="text-center mb-5">

            <span
              className="text-primary fw-bold text-uppercase"
              style={{ letterSpacing: "2px" }}
            >
              WHY CHOOSE US
            </span>

            <h2 className="display-5 fw-bold mt-2 mb-3">
              Your Car Is In{" "}
              <span className="text-primary">
                Safe Hands
              </span>
            </h2>

            <p
              className="text-muted fs-5 mx-auto"
              style={{ maxWidth: "650px" }}
            >
              We provide professional, reliable and affordable
              car services to keep your vehicle running at its best.
            </p>

          </div>


          <div className="row g-4">

            {/* Expert Mechanics */}
            <div className="col-md-6 col-lg-3">
              <div
                className="card h-100 border-0 shadow-sm text-center p-4"
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
                <div
                  className="mx-auto mb-4 rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center"
                  style={{
                    width: "80px",
                    height: "80px",
                  }}
                >
                  <i className="bi bi-tools text-primary fs-1"></i>
                </div>

                <h4 className="fw-bold mb-3">
                  Expert Mechanics
                </h4>

                <p className="text-muted mb-0">
                  Skilled and experienced mechanics who take
                  complete care of your vehicle.
                </p>
              </div>
            </div>


            {/* Quality Service */}
            <div className="col-md-6 col-lg-3">
              <div
                className="card h-100 border-0 shadow-sm text-center p-4"
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
                <div
                  className="mx-auto mb-4 rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center"
                  style={{
                    width: "80px",
                    height: "80px",
                  }}
                >
                  <i className="bi bi-check-circle-fill text-primary fs-1"></i>
                </div>

                <h4 className="fw-bold mb-3">
                  Quality Service
                </h4>

                <p className="text-muted mb-0">
                  Reliable service using proper tools and
                  professional maintenance practices.
                </p>
              </div>
            </div>


            {/* Easy Booking */}
            <div className="col-md-6 col-lg-3">
              <div
                className="card h-100 border-0 shadow-sm text-center p-4"
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
                <div
                  className="mx-auto mb-4 rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center"
                  style={{
                    width: "80px",
                    height: "80px",
                  }}
                >
                  <i className="bi bi-lightning-charge-fill text-primary fs-1"></i>
                </div>

                <h4 className="fw-bold mb-3">
                  Easy Booking
                </h4>

                <p className="text-muted mb-0">
                  Book your preferred car service quickly with
                  just a few simple clicks.
                </p>
              </div>
            </div>


            {/* Trusted & Reliable */}
            <div className="col-md-6 col-lg-3">
              <div
                className="card h-100 border-0 shadow-sm text-center p-4"
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
                <div
                  className="mx-auto mb-4 rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center"
                  style={{
                    width: "80px",
                    height: "80px",
                  }}
                >
                  <i className="bi bi-shield-check text-primary fs-1"></i>
                </div>

                <h4 className="fw-bold mb-3">
                  Trusted & Reliable
                </h4>

                <p className="text-muted mb-0">
                  Transparent service and dependable support
                  you can trust for your car.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* ================= OUR SERVICES ================= */}
      <section className="py-5 bg-light">
        <div className="container py-4">

          <div className="text-center mb-5">

            <span
              className="text-primary fw-bold text-uppercase"
              style={{ letterSpacing: "2px" }}
            >
              OUR SERVICES
            </span>

            <h2 className="display-5 fw-bold mt-2 mb-3">
              Complete Care For{" "}
              <span className="text-primary">
                Your Car
              </span>
            </h2>

            <p
              className="text-muted fs-5 mx-auto"
              style={{ maxWidth: "650px" }}
            >
              From regular maintenance to major repairs,
              we provide everything your vehicle needs.
            </p>

          </div>


          <div className="row g-4">

            {/* Oil Change */}
            <div className="col-md-6 col-lg-4">
              <div
                className="card h-100 border-0 shadow-sm p-4"
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
                  className="rounded-3 bg-primary bg-opacity-10 d-flex align-items-center justify-content-center mb-4"
                  style={{
                    width: "65px",
                    height: "65px",
                  }}
                >
                  <i className="bi bi-droplet-fill text-primary fs-2"></i>
                </div>

                <h4 className="fw-bold">
                  Oil Change
                </h4>

                <p className="text-muted">
                  Keep your engine running smoothly with
                  regular oil and filter changes.
                </p>

                <Link
                  to="/services/oil"
                  className="text-primary fw-semibold text-decoration-none mt-auto"
                >
                  Learn More
                  <i className="bi bi-arrow-right ms-2"></i>
                </Link>
              </div>
            </div>


            {/* Engine Repair */}
            <div className="col-md-6 col-lg-4">
              <div
                className="card h-100 border-0 shadow-sm p-4"
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
                  className="rounded-3 bg-primary bg-opacity-10 d-flex align-items-center justify-content-center mb-4"
                  style={{
                    width: "65px",
                    height: "65px",
                  }}
                >
                  <i className="bi bi-gear-fill text-primary fs-2"></i>
                </div>

                <h4 className="fw-bold">
                  Engine Repair
                </h4>

                <p className="text-muted">
                  Professional engine diagnostics and repair
                  for reliable performance.
                </p>

                <Link
                  to="/services/engine"
                  className="text-primary fw-semibold text-decoration-none mt-auto"
                >
                  Learn More
                  <i className="bi bi-arrow-right ms-2"></i>
                </Link>
              </div>
            </div>


            {/* Tyre & Wheel */}
            <div className="col-md-6 col-lg-4">
              <div
                className="card h-100 border-0 shadow-sm p-4"
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
                  className="rounded-3 bg-primary bg-opacity-10 d-flex align-items-center justify-content-center mb-4"
                  style={{
                    width: "65px",
                    height: "65px",
                  }}
                >
                  <i className="bi bi-circle text-primary fs-2"></i>
                </div>

                <h4 className="fw-bold">
                  Tyre & Wheel Service
                </h4>

                <p className="text-muted">
                  Wheel alignment, balancing and tyre care
                  for a safer driving experience.
                </p>

                <Link
                  to="/services"
                  className="text-primary fw-semibold text-decoration-none mt-auto"
                >
                  Learn More
                  <i className="bi bi-arrow-right ms-2"></i>
                </Link>
              </div>
            </div>


            {/* Battery Service */}
            <div className="col-md-6 col-lg-4">
              <div
                className="card h-100 border-0 shadow-sm p-4"
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
                  className="rounded-3 bg-primary bg-opacity-10 d-flex align-items-center justify-content-center mb-4"
                  style={{
                    width: "65px",
                    height: "65px",
                  }}
                >
                  <i className="bi bi-battery-charging text-primary fs-2"></i>
                </div>

                <h4 className="fw-bold">
                  Battery Service
                </h4>

                <p className="text-muted">
                  Battery testing, replacement and electrical
                  support for your vehicle.
                </p>

                <Link
                  to="/services/battery"
                  className="text-primary fw-semibold text-decoration-none mt-auto"
                >
                  Learn More
                  <i className="bi bi-arrow-right ms-2"></i>
                </Link>
              </div>
            </div>


            {/* AC Service */}
            <div className="col-md-6 col-lg-4">
              <div
                className="card h-100 border-0 shadow-sm p-4"
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
                  className="rounded-3 bg-primary bg-opacity-10 d-flex align-items-center justify-content-center mb-4"
                  style={{
                    width: "65px",
                    height: "65px",
                  }}
                >
                  <i className="bi bi-snow2 text-primary fs-2"></i>
                </div>

                <h4 className="fw-bold">
                  AC Service
                </h4>

                <p className="text-muted">
                  Complete AC inspection, cleaning and repair
                  for a comfortable drive.
                </p>

                <Link
                  to="/services/ac"
                  className="text-primary fw-semibold text-decoration-none mt-auto"
                >
                  Learn More
                  <i className="bi bi-arrow-right ms-2"></i>
                </Link>
              </div>
            </div>


            {/* General Service */}
            <div className="col-md-6 col-lg-4">
              <div
                className="card h-100 border-0 shadow-sm p-4"
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
                  className="rounded-3 bg-primary bg-opacity-10 d-flex align-items-center justify-content-center mb-4"
                  style={{
                    width: "65px",
                    height: "65px",
                  }}
                >
                  <i className="bi bi-car-front-fill text-primary fs-2"></i>
                </div>

                <h4 className="fw-bold">
                  General Car Service
                </h4>

                <p className="text-muted">
                  Complete vehicle inspection and routine
                  maintenance to keep your car healthy.
                </p>

                <Link
                  to="/services/general"
                  className="text-primary fw-semibold text-decoration-none mt-auto"
                >
                  Learn More
                  <i className="bi bi-arrow-right ms-2"></i>
                </Link>
              </div>
            </div>

          </div>


          <div className="text-center mt-5">
            <Link
              to="/services"
              className="btn btn-primary btn-lg px-5 py-3 fw-semibold"
            >
              View All Services
              <i className="bi bi-arrow-right ms-2"></i>
            </Link>
          </div>

        </div>
      </section>


      {/* ================= HOW IT WORKS ================= */}
      <section className="py-5 bg-white">
        <div className="container py-4">

          <div className="text-center mb-5">
            <span
              className="text-primary fw-bold text-uppercase"
              style={{ letterSpacing: "2px" }}
            >
              HOW IT WORKS
            </span>

            <h2 className="display-5 fw-bold mt-2 mb-3">
              Service Your Car In{" "}
              <span className="text-primary">
                4 Easy Steps
              </span>
            </h2>

            <p
              className="text-muted fs-5 mx-auto"
              style={{ maxWidth: "650px" }}
            >
              Getting your car serviced is simple and convenient
              with MRT Car Service.
            </p>
          </div>


          <div className="row g-4">

            {/* Step 1 */}
            <div className="col-md-6 col-lg-3">
              <div className="text-center h-100 p-4">
                <div
                  className="mx-auto mb-4 rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                  style={{
                    width: "85px",
                    height: "85px",
                  }}
                >
                  <i className="bi bi-calendar-check fs-2"></i>
                </div>

                <span className="badge bg-dark mb-3">
                  STEP 01
                </span>

                <h4 className="fw-bold">
                  Book a Service
                </h4>

                <p className="text-muted">
                  Choose the service you need and select a
                  convenient date and time.
                </p>
              </div>
            </div>


            {/* Step 2 */}
            <div className="col-md-6 col-lg-3">
              <div className="text-center h-100 p-4">
                <div
                  className="mx-auto mb-4 rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                  style={{
                    width: "85px",
                    height: "85px",
                  }}
                >
                  <i className="bi bi-car-front fs-2"></i>
                </div>

                <span className="badge bg-dark mb-3">
                  STEP 02
                </span>

                <h4 className="fw-bold">
                  Bring Your Car
                </h4>

                <p className="text-muted">
                  Bring your vehicle to our service center at
                  your selected appointment time.
                </p>
              </div>
            </div>


            {/* Step 3 */}
            <div className="col-md-6 col-lg-3">
              <div className="text-center h-100 p-4">
                <div
                  className="mx-auto mb-4 rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                  style={{
                    width: "85px",
                    height: "85px",
                  }}
                >
                  <i className="bi bi-tools fs-2"></i>
                </div>

                <span className="badge bg-dark mb-3">
                  STEP 03
                </span>

                <h4 className="fw-bold">
                  Expert Service
                </h4>

                <p className="text-muted">
                  Our experienced mechanics inspect and service
                  your vehicle professionally.
                </p>
              </div>
            </div>


            {/* Step 4 */}
            <div className="col-md-6 col-lg-3">
              <div className="text-center h-100 p-4">
                <div
                  className="mx-auto mb-4 rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                  style={{
                    width: "85px",
                    height: "85px",
                  }}
                >
                  <i className="bi bi-check-circle fs-2"></i>
                </div>

                <span className="badge bg-dark mb-3">
                  STEP 04
                </span>

                <h4 className="fw-bold">
                  Drive Safely
                </h4>

                <p className="text-muted">
                  Get your vehicle back in great condition and
                  enjoy a smooth and safe drive.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* ================= WHY MRT CAR SERVICE / STATS ================= */}
      <section className="py-5 bg-dark text-white">
        <div className="container py-4">

          <div className="text-center mb-5">

            <span
              className="text-primary fw-bold text-uppercase"
              style={{ letterSpacing: "2px" }}
            >
              WHY MRT CAR SERVICE?
            </span>

            <h2 className="display-5 fw-bold mt-2 mb-3">
              Trusted By{" "}
              <span className="text-primary">
                Car Owners
              </span>
            </h2>

            <p
              className="text-secondary fs-5 mx-auto"
              style={{ maxWidth: "650px" }}
            >
              We focus on quality workmanship, reliable service
              and complete customer satisfaction.
            </p>

          </div>


          <div className="row g-4 text-center">

            {/* Cars Serviced */}
            <div className="col-6 col-lg-3">
              <div className="p-3">
                <i className="bi bi-car-front display-4 text-primary"></i>

                <h2 className="fw-bold mt-3">
                  500+
                </h2>

                <p className="text-secondary mb-0">
                  Cars Serviced
                </p>
              </div>
            </div>


            {/* Happy Customers */}
            <div className="col-6 col-lg-3">
              <div className="p-3">
                <i className="bi bi-people display-4 text-primary"></i>

                <h2 className="fw-bold mt-3">
                  350+
                </h2>

                <p className="text-secondary mb-0">
                  Happy Customers
                </p>
              </div>
            </div>


            {/* Expert Mechanics */}
            <div className="col-6 col-lg-3">
              <div className="p-3">
                <i className="bi bi-tools display-4 text-primary"></i>

                <h2 className="fw-bold mt-3">
                  10+
                </h2>

                <p className="text-secondary mb-0">
                  Expert Mechanics
                </p>
              </div>
            </div>


            {/* Rating */}
            <div className="col-6 col-lg-3">
              <div className="p-3">
                <i className="bi bi-star-fill display-4 text-primary"></i>

                <h2 className="fw-bold mt-3">
                  4.9/5
                </h2>

                <p className="text-secondary mb-0">
                  Customer Rating
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* ================= CUSTOMER TESTIMONIALS ================= */}
      <section className="py-5 bg-light">
        <div className="container py-4">

          <div className="text-center mb-5">

            <span
              className="text-primary fw-bold text-uppercase"
              style={{ letterSpacing: "2px" }}
            >
              TESTIMONIALS
            </span>

            <h2 className="display-5 fw-bold mt-2 mb-3">
              What Our{" "}
              <span className="text-primary">
                Customers Say
              </span>
            </h2>

            <p
              className="text-muted fs-5 mx-auto"
              style={{ maxWidth: "650px" }}
            >
              Hear what our customers have to say about their
              MRT Car Service experience.
            </p>

          </div>


          <div className="row g-4">

            {/* Testimonial 1 */}
            <div className="col-md-4">
              <div
                className="card border-0 shadow-sm h-100 p-4"
                style={{ borderRadius: "16px" }}
              >
                <div className="mb-3">
                  <i className="bi bi-star-fill text-warning me-1"></i>
                  <i className="bi bi-star-fill text-warning me-1"></i>
                  <i className="bi bi-star-fill text-warning me-1"></i>
                  <i className="bi bi-star-fill text-warning me-1"></i>
                  <i className="bi bi-star-fill text-warning"></i>
                </div>

                <p className="text-muted">
                  "Excellent service and very professional mechanics.
                  My car is running smoothly now."
                </p>

                <div className="d-flex align-items-center mt-auto pt-3">

                  <div
                    className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                    style={{
                      width: "50px",
                      height: "50px",
                    }}
                  >
                    <i className="bi bi-person-fill fs-4"></i>
                  </div>

                  <div>
                    <h6 className="fw-bold mb-0">
                      Arun Kumar
                    </h6>

                    <small className="text-muted">
                      Car Owner
                    </small>
                  </div>

                </div>
              </div>
            </div>


            {/* Testimonial 2 */}
            <div className="col-md-4">
              <div
                className="card border-0 shadow-sm h-100 p-4"
                style={{ borderRadius: "16px" }}
              >
                <div className="mb-3">
                  <i className="bi bi-star-fill text-warning me-1"></i>
                  <i className="bi bi-star-fill text-warning me-1"></i>
                  <i className="bi bi-star-fill text-warning me-1"></i>
                  <i className="bi bi-star-fill text-warning me-1"></i>
                  <i className="bi bi-star-fill text-warning"></i>
                </div>

                <p className="text-muted">
                  "The booking process was simple and the service
                  was completed on time. Highly recommended!"
                </p>

                <div className="d-flex align-items-center mt-auto pt-3">

                  <div
                    className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                    style={{
                      width: "50px",
                      height: "50px",
                    }}
                  >
                    <i className="bi bi-person-fill fs-4"></i>
                  </div>

                  <div>
                    <h6 className="fw-bold mb-0">
                      Priya S
                    </h6>

                    <small className="text-muted">
                      Customer
                    </small>
                  </div>

                </div>
              </div>
            </div>


            {/* Testimonial 3 */}
            <div className="col-md-4">
              <div
                className="card border-0 shadow-sm h-100 p-4"
                style={{ borderRadius: "16px" }}
              >
                <div className="mb-3">
                  <i className="bi bi-star-fill text-warning me-1"></i>
                  <i className="bi bi-star-fill text-warning me-1"></i>
                  <i className="bi bi-star-fill text-warning me-1"></i>
                  <i className="bi bi-star-fill text-warning me-1"></i>
                  <i className="bi bi-star-fill text-warning"></i>
                </div>

                <p className="text-muted">
                  "Good quality service at a reasonable price.
                  The team explained everything clearly."
                </p>

                <div className="d-flex align-items-center mt-auto pt-3">

                  <div
                    className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                    style={{
                      width: "50px",
                      height: "50px",
                    }}
                  >
                    <i className="bi bi-person-fill fs-4"></i>
                  </div>

                  <div>
                    <h6 className="fw-bold mb-0">
                      Vijay Raj
                    </h6>

                    <small className="text-muted">
                      Car Owner
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

            <i className="bi bi-car-front display-3"></i>

            <h2 className="fw-bold mt-3">
              Ready To Give Your Car
              <br />
              The Care It Deserves?
            </h2>

            <p
              className="lead mx-auto mb-4"
              style={{ maxWidth: "650px" }}
            >
              Book your car service today and let our experienced
              mechanics take care of your vehicle.
            </p>

            <Link
              to="/customer/book-service"
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

export default Home;