import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function MechanicProtectedRoute() {
  const { user, token, loading } = useAuth();

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
            Loading Mechanic Workspace...
          </p>
        </div>
      </div>
    );
  }

  // Not logged in -> send to Mechanic Login
  if (!token || !user) {
    return <Navigate to="/mechanic/login" replace />;
  }

  // Logged in as another role -> redirect away from mechanic workspace
  if (user.role !== "mechanic") {
    if (user.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/customer/dashboard" replace />;
  }

  return <Outlet />;
}

export default MechanicProtectedRoute;
