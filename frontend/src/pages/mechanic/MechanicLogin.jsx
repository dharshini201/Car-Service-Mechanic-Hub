import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { mechanicLogin } from "../../services/mechanicService";
import logo from "../../assets/images/logo.png";

function MechanicLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter your mechanic email and password.");
      return;
    }

    try {
      setLoading(true);

      const result = await mechanicLogin({
        email: email.trim(),
        password,
      });

      if (!result.success || !result.token) {
        throw new Error(result.message || "Failed to authenticate mechanic.");
      }

      if (result.user.role !== "mechanic") {
        throw new Error("Access denied. This portal is for registered mechanics only.");
      }

      // Store in auth context and localStorage
      login(result.user, result.token);

      navigate("/mechanic/dashboard");
    } catch (err) {
      console.error("Mechanic Login Error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Invalid email or password. Please verify credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center py-5 px-3"
      style={{
        minHeight: "calc(100vh - 72px)",
        background: "linear-gradient(135deg, #090d16 0%, #111827 50%, #1e293b 100%)",
      }}
    >
      <div
        className="card border-0 shadow-lg rounded-4 overflow-hidden"
        style={{
          maxWidth: "460px",
          width: "100%",
          backgroundColor: "#ffffff",
        }}
      >
        {/* Banner Header */}
        <div
          className="p-4 text-center text-white"
          style={{
            background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)",
          }}
        >
          <div className="d-inline-flex p-3 bg-white bg-opacity-10 rounded-circle mb-3 shadow-sm">
            <img
              src={logo}
              alt="MRT Car Service"
              style={{ width: "48px", height: "48px", objectFit: "contain" }}
            />
          </div>
          <span className="badge bg-warning text-dark px-3 py-1 rounded-pill mb-2 fw-semibold text-uppercase tracking-wider">
            <i className="bi bi-tools me-1"></i> Technician Portal
          </span>
          <h3 className="fw-bold mb-1">Mechanic Sign In</h3>
          <p className="text-white-50 small mb-0">
            Access assigned repairs, vehicle diagnostics &amp; work queues
          </p>
        </div>

        {/* Card Body */}
        <div className="p-4 p-md-5">
          {error && (
            <div className="alert alert-danger d-flex align-items-center py-2 px-3 rounded-3 mb-4 text-sm" role="alert">
              <i className="bi bi-exclamation-triangle-fill me-2 fs-5 flex-shrink-0"></i>
              <div>{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="mb-3">
              <label className="form-label fw-semibold text-dark small">
                Mechanic Email Address
              </label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 text-muted">
                  <i className="bi bi-envelope"></i>
                </span>
                <input
                  type="email"
                  className="form-control bg-light border-start-0 py-2"
                  placeholder="name@mrtcservice.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="mb-4">
              <label className="form-label fw-semibold text-dark small">
                Password
              </label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 text-muted">
                  <i className="bi bi-shield-lock"></i>
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control bg-light border-start-0 border-end-0 py-2"
                  placeholder="Enter your mechanic password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="input-group-text bg-light border-start-0 text-muted"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex="-1"
                >
                  <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary w-100 py-2 fw-semibold rounded-pill shadow-sm"
              disabled={loading}
              style={{
                background: "linear-gradient(90deg, #2563eb 0%, #1d4ed8 100%)",
                border: "none",
              }}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Authenticating...
                </>
              ) : (
                <>
                  <i className="bi bi-box-arrow-in-right me-2"></i>
                  Sign In to Mechanic Hub
                </>
              )}
            </button>
              {/* Demo Helper Button */}
              <div className="mt-3 text-center">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary rounded-pill px-3 py-1"
                  onClick={() => {
                    setEmail("mechanic1@gmail.com");
                    setPassword("123456");
                  }}
                >
                  <i className="bi bi-magic me-1 text-warning"></i>
                  Use Demo Mechanic (kumar / 123456)
                </button>
              </div>
            </form>

            {/* Quick links & switch */}
            <div className="mt-4 pt-3 border-top text-center">
              <div className="mb-2">
                <Link
                  to="/register?role=mechanic"
                  className="text-decoration-none fw-semibold small text-primary"
                >
                  <i className="bi bi-person-plus me-1"></i>
                  New Technician? Register as Mechanic
                </Link>
              </div>
              <div className="d-flex justify-content-center gap-3 text-sm">
                <Link to="/login" className="text-decoration-none text-secondary small">
                  <i className="bi bi-person me-1"></i> Customer Login
                </Link>
                <span className="text-muted">|</span>
                <Link to="/admin/login" className="text-decoration-none text-secondary small">
                  <i className="bi bi-shield-shaded me-1"></i> Admin Portal
                </Link>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}

export default MechanicLogin;
