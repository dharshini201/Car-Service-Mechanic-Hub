import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ allowedRoles }) {
  const { user, token, loading } = useAuth();

  // Wait for localStorage authentication check
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="text-center">
          <div
            className="spinner-border text-primary"
            style={{ width: "3rem", height: "3rem" }}
            role="status"
          ></div>
          <p className="mt-3 text-muted fw-semibold">
            Loading MRT Car Service...
          </p>
        </div>
      </div>
    );
  }

  // Not logged in
  if (!token || !user) {
    if (allowedRoles && allowedRoles.includes("admin")) {
      return <Navigate to="/admin/login" replace />;
    }
    if (allowedRoles && allowedRoles.includes("mechanic")) {
      return <Navigate to="/mechanic/login" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  // Check user role authorization
  const currentRole = user.role || "customer";
  if (allowedRoles && !allowedRoles.includes(currentRole)) {
    if (currentRole === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (currentRole === "mechanic") {
      return <Navigate to="/mechanic/dashboard" replace />;
    } else {
      return <Navigate to="/customer/dashboard" replace />;
    }
  }

  // User authenticated and authorized
  return <Outlet />;
}

export default ProtectedRoute;