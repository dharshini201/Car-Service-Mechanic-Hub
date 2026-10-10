import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";
import logo from "../assets/images/logo.png";

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark shadow-sm sticky-top"
      style={{
        background: "linear-gradient(90deg, #0b1120 0%, #0f172a 100%)",
        minHeight: "72px",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div className="container-fluid px-4">
        {/* ================= BRAND ================= */}
        <Link
          to="/"
          className="navbar-brand d-flex align-items-center text-decoration-none"
        >
          <img
            src={logo}
            alt="MRT Car Service Logo"
            style={{
              width: "48px",
              height: "48px",
              objectFit: "contain",
            }}
          />
          <div className="ms-2">
            <div
              className="fw-bold text-white tracking-wide"
              style={{
                fontSize: "1.25rem",
                letterSpacing: "0.5px",
                lineHeight: "1.1",
              }}
            >
              MRT Car Service
            </div>
            <small
              className="text-secondary"
              style={{
                fontSize: "0.72rem",
                letterSpacing: "0.3px",
              }}
            >
              Mechanic & Service Hub
            </small>
          </div>
        </Link>

        {/* ================= MOBILE TOGGLE ================= */}
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          aria-controls="mainNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* ================= NAVIGATION ================= */}
        <div className="collapse navbar-collapse" id="mainNavbar">
          <ul className="navbar-nav ms-auto align-items-lg-center gap-1">
            {/* Home */}
            <li className="nav-item">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `nav-link px-3 ${isActive ? "text-primary fw-semibold active" : "text-light"}`
                }
              >
                Home
              </NavLink>
            </li>

            {/* About */}
            <li className="nav-item">
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `nav-link px-3 ${isActive ? "text-primary fw-semibold active" : "text-light"}`
                }
              >
                About
              </NavLink>
            </li>

            {/* Services */}
            <li className="nav-item">
              <NavLink
                to="/services"
                className={({ isActive }) =>
                  `nav-link px-3 ${isActive ? "text-primary fw-semibold active" : "text-light"}`
                }
              >
                Services
              </NavLink>
            </li>

            {/* Contact */}
            <li className="nav-item">
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  `nav-link px-3 ${isActive ? "text-primary fw-semibold active" : "text-light"}`
                }
              >
                Contact
              </NavLink>
            </li>

            {/* Direct Dashboard Links for Fast Access */}
            {isAuthenticated && user?.role === "mechanic" && (
              <li className="nav-item">
                <NavLink
                  to="/mechanic/dashboard"
                  className={({ isActive }) =>
                    `nav-link px-3 ${isActive ? "text-warning fw-semibold active" : "text-warning"}`
                  }
                >
                  <i className="bi bi-tools me-1"></i> Mechanic Dashboard
                </NavLink>
              </li>
            )}
            {isAuthenticated && user?.role === "admin" && (
              <li className="nav-item">
                <NavLink
                  to="/admin/dashboard"
                  className={({ isActive }) =>
                    `nav-link px-3 ${isActive ? "text-primary fw-semibold active" : "text-primary"}`
                  }
                >
                  <i className="bi bi-speedometer2 me-1"></i> Admin Dashboard
                </NavLink>
              </li>
            )}

            {/* ================= LOGGED IN USER ================= */}
            {isAuthenticated && user ? (
              <li className="nav-item dropdown ms-lg-3 mt-2 mt-lg-0">
                <button
                  className="btn btn-outline-light btn-sm dropdown-toggle px-3 py-2 d-flex align-items-center rounded-pill"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{ borderColor: "rgba(255,255,255,0.2)" }}
                >
                  <span className="bg-primary text-white rounded-circle me-2 d-inline-flex align-items-center justify-content-center" style={{ width: "24px", height: "24px", fontSize: "12px" }}>
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </span>
                  <span className="me-1">{user.name}</span>
                  <span className="badge bg-secondary ms-1 text-capitalize" style={{ fontSize: "10px" }}>
                    {user.role}
                  </span>
                  {user.role === "customer" && unreadCount > 0 && (
                    <span className="badge rounded-pill bg-danger ms-1" style={{ fontSize: "10px" }}>
                      {unreadCount}
                    </span>
                  )}
                </button>

                <ul
                  className="dropdown-menu dropdown-menu-end shadow-lg border-0 mt-2"
                  style={{
                    borderRadius: "12px",
                    minWidth: "210px",
                    background: "#ffffff",
                  }}
                >
                  {/* Customer Links */}
                  {user.role === "customer" && (
                    <>
                      <li>
                        <Link
                          className="dropdown-item py-2"
                          to="/customer/dashboard"
                        >
                          <i className="bi bi-speedometer2 text-primary me-2"></i>
                          Dashboard
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item py-2"
                          to="/customer/profile"
                        >
                          <i className="bi bi-person text-secondary me-2"></i>
                          Profile
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item py-2"
                          to="/customer/bookings"
                        >
                          <i className="bi bi-calendar-check text-success me-2"></i>
                          My Bookings
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item py-2"
                          to="/customer/vehicles"
                        >
                          <i className="bi bi-car-front text-info me-2"></i>
                          My Vehicles
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item py-2 d-flex justify-content-between align-items-center"
                          to="/customer/notifications"
                        >
                          <span>
                            <i className="bi bi-bell text-warning me-2"></i>
                            Notifications
                          </span>
                          {unreadCount > 0 && (
                            <span className="badge bg-danger rounded-pill">
                              {unreadCount}
                            </span>
                          )}
                        </Link>
                      </li>
                    </>
                  )}

                  {/* Mechanic Links */}
                  {user.role === "mechanic" && (
                    <>
                      <li>
                        <Link
                          className="dropdown-item py-2"
                          to="/mechanic/dashboard"
                        >
                          <i className="bi bi-speedometer2 text-primary me-2"></i>
                          Mechanic Dashboard
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item py-2"
                          to="/mechanic/profile"
                        >
                          <i className="bi bi-person-badge text-secondary me-2"></i>
                          My Profile
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item py-2"
                          to="/mechanic/bookings"
                        >
                          <i className="bi bi-clipboard2-check text-info me-2"></i>
                          Assigned Bookings
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item py-2"
                          to="/mechanic/assigned-services"
                        >
                          <i className="bi bi-tools text-warning me-2"></i>
                          Work Queue
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item py-2"
                          to="/mechanic/service-history"
                        >
                          <i className="bi bi-clock-history text-secondary me-2"></i>
                          Service History
                        </Link>
                      </li>
                    </>
                  )}

                  {/* Admin Links */}
                  {user.role === "admin" && (
                    <>
                      <li>
                        <Link
                          className="dropdown-item py-2"
                          to="/admin/dashboard"
                        >
                          <i className="bi bi-speedometer2 text-primary me-2"></i>
                          Admin Dashboard
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item py-2"
                          to="/admin/bookings"
                        >
                          <i className="bi bi-calendar-check text-success me-2"></i>
                          Manage Bookings
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item py-2"
                          to="/admin/mechanics"
                        >
                          <i className="bi bi-person-gear text-info me-2"></i>
                          Manage Mechanics
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item py-2"
                          to="/admin/services"
                        >
                          <i className="bi bi-tools text-warning me-2"></i>
                          Manage Services
                        </Link>
                      </li>
                    </>
                  )}

                  <li>
                    <hr className="dropdown-divider my-1" />
                  </li>

                  {/* Logout */}
                  <li>
                    <button
                      type="button"
                      className="dropdown-item py-2 text-danger fw-semibold"
                      onClick={handleLogout}
                    >
                      <i className="bi bi-box-arrow-right me-2"></i>
                      Logout
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              /* Public Login & Mechanic Portal Buttons */
              <li className="nav-item ms-lg-3 mt-2 mt-lg-0 d-flex gap-2">
                <Link
                  className="btn btn-outline-light btn-sm px-3 py-2 rounded-pill fw-semibold"
                  to="/mechanic/login"
                >
                  <i className="bi bi-tools me-1 text-warning"></i>
                  Mechanic
                </Link>
                <Link
                  className="btn btn-primary btn-sm px-4 py-2 rounded-pill fw-semibold shadow-sm"
                  to="/login"
                >
                  <i className="bi bi-box-arrow-in-right me-1"></i>
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;