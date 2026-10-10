import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/images/logo.png";

function Footer() {
  return (
    <footer className="bg-dark text-white pt-5 pb-3">
      <div className="container">
        <div className="row g-4">

          {/* Brand */}
          <div className="col-md-4">
            <h4 className="fw-bold d-flex align-items-center">
              <img
                src={logo}
                alt="MRT Car Service"
                style={{
                  height: "50px",
                  width: "auto",
                  objectFit: "contain",
                }}
              />

              <span className="ms-2">
                MRT Car Service
              </span>
            </h4>

            <p className="text-secondary mt-3">
              Reliable car service and professional mechanic support
              for your vehicle.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-md-2">
            <h5 className="fw-bold mb-3">Quick Links</h5>

            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/" className="text-secondary text-decoration-none">
                  Home
                </Link>
              </li>

              <li className="mb-2">
                <Link
                  to="/about"
                  className="text-secondary text-decoration-none"
                >
                  About
                </Link>
              </li>

              <li className="mb-2">
                <Link
                  to="/services"
                  className="text-secondary text-decoration-none"
                >
                  Services
                </Link>
              </li>

              <li className="mb-2">
                <Link
                  to="/contact"
                  className="text-secondary text-decoration-none"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="col-md-3">
            <h5 className="fw-bold mb-3">Services</h5>

            <ul className="list-unstyled">
              <li className="mb-2">
                <Link
                  to="/services/engine"
                  className="text-secondary text-decoration-none"
                >
                  Engine Service
                </Link>
              </li>

              <li className="mb-2">
                <Link
                  to="/services/brake"
                  className="text-secondary text-decoration-none"
                >
                  Brake Service
                </Link>
              </li>

              <li className="mb-2">
                <Link
                  to="/services/battery"
                  className="text-secondary text-decoration-none"
                >
                  Battery Service
                </Link>
              </li>

              <li className="mb-2">
                <Link
                  to="/services/oil"
                  className="text-secondary text-decoration-none"
                >
                  Oil Change
                </Link>
              </li>

              <li className="mb-2">
                <Link
                  to="/services/ac"
                  className="text-secondary text-decoration-none"
                >
                  AC Service
                </Link>
              </li>

              <li className="mb-2">
                <Link
                  to="/services/general"
                  className="text-secondary text-decoration-none"
                >
                  General Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-md-3">
            <h5 className="fw-bold mb-3">Contact</h5>

            <p className="text-secondary mb-2">
              <i className="bi bi-telephone me-2"></i>
              +91 98765 43210
            </p>

            <p className="text-secondary mb-2">
              <i className="bi bi-envelope me-2"></i>
              info@carservicehub.com
            </p>

            <p className="text-secondary">
              <i className="bi bi-geo-alt me-2"></i>
              Chennai, Tamil Nadu
            </p>

            <div className="mt-3">
              <i className="bi bi-facebook fs-5 me-3"></i>
              <i className="bi bi-instagram fs-5 me-3"></i>
              <i className="bi bi-twitter-x fs-5"></i>
            </div>
          </div>

        </div>

        <hr className="border-secondary mt-4" />

        <div className="text-center text-secondary">
          <small>
            © {new Date().getFullYear()} MRT Car Service. All Rights Reserved.
          </small>
        </div>
      </div>
    </footer>
  );
}

export default Footer;