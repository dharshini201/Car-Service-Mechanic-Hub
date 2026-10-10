import React, { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.png";
import { useNotifications } from "../context/NotificationContext";
import { useAuth } from "../context/AuthContext";

function Sidebar({ role = "customer" }) {
  const { unreadCount } = useNotifications();
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    const currentRole = user?.role || role || "customer";
    logout();
    if (currentRole === "admin") {
      navigate("/admin/login");
    } else if (currentRole === "mechanic") {
      navigate("/mechanic/login");
    } else {
      navigate("/login");
    }
  };

  const closeMobile = () => setMobileOpen(false);

  const customerLinks = [
    {
      path: "/customer/dashboard",
      icon: "bi-speedometer2",
      label: "Dashboard",
    },
    {
      path: "/customer/profile",
      icon: "bi-person",
      label: "My Profile",
    },
    {
      path: "/customer/vehicles",
      icon: "bi-car-front",
      label: "My Vehicles",
    },
    {
      path: "/customer/book-service",
      icon: "bi-calendar-check",
      label: "Book Service",
    },
    {
      path: "/customer/bookings",
      icon: "bi-journal-text",
      label: "My Bookings",
    },
    {
      path: "/customer/service-history",
      icon: "bi-clock-history",
      label: "Service History",
    },
    {
      path: "/customer/notifications",
      icon: "bi-bell",
      label: "Notifications",
      badge: unreadCount,
    },
  ];

  const mechanicLinks = [
    {
      path: "/mechanic/dashboard",
      icon: "bi-speedometer2",
      label: "Dashboard",
    },
    {
      path: "/mechanic/assigned-services",
      icon: "bi-tools",
      label: "Work Queue",
    },
    {
      path: "/mechanic/bookings",
      icon: "bi-clipboard2-check",
      label: "Assigned Bookings",
    },
    {
      path: "/mechanic/service-history",
      icon: "bi-clock-history",
      label: "Service History",
    },
    {
      path: "/mechanic/profile",
      icon: "bi-person-badge",
      label: "Technician Profile",
    },
  ];

  const adminLinks = [
    {
      path: "/admin/dashboard",
      icon: "bi-speedometer2",
      label: "Dashboard",
    },
    {
      path: "/admin/users",
      icon: "bi-people",
      label: "Manage Users",
    },
    {
      path: "/admin/mechanics",
      icon: "bi-person-gear",
      label: "Manage Mechanics",
    },
    {
      path: "/admin/vehicles",
      icon: "bi-car-front",
      label: "Manage Vehicles",
    },
    {
      path: "/admin/services",
      icon: "bi-tools",
      label: "Manage Services",
    },
    {
      path: "/admin/bookings",
      icon: "bi-calendar-check",
      label: "Manage Bookings",
    },
    {
      path: "/admin/categories",
      icon: "bi-tags",
      label: "Service Categories",
    },
    {
      path: "/admin/reports",
      icon: "bi-graph-up-arrow",
      label: "Reports & Analytics",
    },
    {
      path: "/admin/activity",
      icon: "bi-activity",
      label: "System Activity",
    },
    {
      path: "/admin/settings",
      icon: "bi-gear",
      label: "Settings",
    },
  ];

  // Strictly use authenticated user role to prevent cross-portal role leakage
  const activeRole = user?.role || role || "customer";

  let links = customerLinks;
  if (activeRole === "mechanic") {
    links = mechanicLinks;
  } else if (activeRole === "admin") {
    links = adminLinks;
  }

  const roleColors = {
    customer: "#3b82f6",
    mechanic: "#f59e0b",
    admin: "#10b981",
  };

  const portalNames = {
    customer: "Customer Portal",
    mechanic: "Mechanic Portal",
    admin: "Admin Console",
  };

  return (
    <>
      {/* Mobile Top App Bar (< 768px) */}
      <div
        className="d-md-none d-flex align-items-center justify-content-between px-3 py-2 text-white border-bottom border-secondary border-opacity-25 sticky-top shadow-sm"
        style={{
          background: "linear-gradient(90deg, #0b1120 0%, #0f172a 100%)",
          zIndex: 1040,
        }}
      >
        <div className="d-flex align-items-center gap-2">
          <button
            type="button"
            className="btn btn-outline-light btn-sm border-secondary border-opacity-50 px-2 py-1"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation drawer"
          >
            <i className={`bi bi-${mobileOpen ? "x-lg" : "list"} fs-5`}></i>
          </button>
          <img
            src={logo}
            alt="MRT"
            style={{ width: "32px", height: "32px", objectFit: "contain" }}
          />
          <div>
            <div className="fw-bold text-white small leading-none">
              MRT Hub
            </div>
            <span
              className="badge px-1 py-0 text-capitalize"
              style={{
                fontSize: "9px",
                color: roleColors[activeRole] || "#3b82f6",
                border: `1px solid ${roleColors[activeRole] || "#3b82f6"}44`,
              }}
            >
              {activeRole}
            </span>
          </div>
        </div>

        <div className="d-flex align-items-center gap-2">
          {unreadCount > 0 && activeRole === "customer" && (
            <Link
              to="/customer/notifications"
              className="btn btn-sm btn-outline-warning position-relative px-2 py-1 rounded-pill"
            >
              <i className="bi bi-bell"></i>
              <span
                className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                style={{ fontSize: "9px" }}
              >
                {unreadCount}
              </span>
            </Link>
          )}

          <button
            type="button"
            onClick={handleLogout}
            className="btn btn-sm btn-outline-danger px-2 py-1 rounded-pill"
            title="Logout"
          >
            <i className="bi bi-box-arrow-right"></i>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          className="d-md-none position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-75"
          style={{ zIndex: 1045 }}
          onClick={closeMobile}
        ></div>
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`d-flex flex-column p-3 text-white ${
          mobileOpen
            ? "d-flex position-fixed top-0 start-0 h-100 shadow-lg"
            : "d-none d-md-flex"
        }`}
        style={{
          background: "linear-gradient(180deg, #0b1120 0%, #0f172a 100%)",
          borderRight: "1px solid rgba(255,255,255,0.08)",
          width: mobileOpen ? "280px" : "100%",
          maxWidth: mobileOpen ? "280px" : "none",
          position: mobileOpen ? "fixed" : "sticky",
          top: 0,
          height: "100vh",
          overflowY: "auto",
          zIndex: mobileOpen ? 1050 : 1020,
        }}
      >
        {/* Brand Header */}
        <div className="d-flex align-items-center justify-content-between mb-4 pb-3 border-bottom border-secondary border-opacity-25">
          <div className="d-flex align-items-center">
            <img
              src={logo}
              alt="MRT Car Service"
              style={{ width: "42px", height: "42px", objectFit: "contain" }}
            />
            <div className="ms-2">
              <div className="fw-bold fs-6 text-white leading-tight">
                MRT Car Service
              </div>
              <span
                className="badge text-capitalize px-2 py-1 mt-1"
                style={{
                  fontSize: "10px",
                  backgroundColor: "rgba(255,255,255,0.08)",
                  color: roleColors[role] || "#3b82f6",
                  border: `1px solid ${roleColors[role] || "#3b82f6"}33`,
                }}
              >
                {portalNames[role] || `${role} Portal`}
              </span>
            </div>
          </div>

          {/* Close button on mobile */}
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary d-md-none border-0 text-white"
            onClick={closeMobile}
          >
            <i className="bi bi-x-lg fs-5"></i>
          </button>
        </div>

        {/* User Mini Card */}
        {user && (
          <div
            className="d-flex align-items-center p-2 mb-3 rounded-3"
            style={{ backgroundColor: "rgba(255,255,255,0.04)" }}
          >
            <div
              className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold me-2 shadow-sm"
              style={{
                width: "36px",
                height: "36px",
                background: `linear-gradient(135deg, ${roleColors[role] || "#3b82f6"}, #1e293b)`,
                fontSize: "14px",
              }}
            >
              {(user.name || "U").charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <div
                className="text-white fw-semibold text-truncate small"
                style={{ maxWidth: "160px" }}
              >
                {user.name}
              </div>
              <div
                className="text-muted text-truncate"
                style={{ fontSize: "11px", maxWidth: "160px" }}
              >
                {user.email}
              </div>
            </div>
          </div>
        )}

        {/* Nav List */}
        <ul className="nav nav-pills flex-column gap-1 mb-auto">
          {links.map((link) => (
            <li className="nav-item" key={link.path}>
              <NavLink
                to={link.path}
                onClick={closeMobile}
                className={({ isActive }) =>
                  `nav-link d-flex align-items-center justify-content-between px-3 py-2 text-white rounded-3 transition-all ${
                    isActive
                      ? "bg-primary fw-semibold shadow-sm"
                      : "text-opacity-75 hover-bg-dark"
                  }`
                }
                style={({ isActive }) => ({
                  backgroundColor: isActive ? "#2563eb" : "transparent",
                })}
              >
                <div className="d-flex align-items-center">
                  <i className={`bi ${link.icon} me-2 fs-6`}></i>
                  <span style={{ fontSize: "0.92rem" }}>{link.label}</span>
                </div>
                {link.badge && link.badge > 0 ? (
                  <span
                    className="badge bg-danger rounded-pill shadow-sm"
                    style={{ fontSize: "11px" }}
                  >
                    {link.badge}
                  </span>
                ) : null}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Footer / Actions */}
        <div className="pt-3 mt-4 border-top border-secondary border-opacity-25 d-flex flex-column gap-1">
          <Link
            to="/"
            onClick={closeMobile}
            className="nav-link text-white text-opacity-75 d-flex align-items-center px-3 py-2 rounded-3 hover-bg-dark"
            style={{ fontSize: "0.9rem" }}
          >
            <i className="bi bi-house-door me-2 fs-6"></i>
            Back to Website
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="btn text-danger text-opacity-75 text-start d-flex align-items-center px-3 py-2 rounded-3 border-0 bg-transparent hover-bg-dark w-100"
            style={{ fontSize: "0.9rem" }}
          >
            <i className="bi bi-box-arrow-right me-2 fs-6"></i>
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;