import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { loginUser } from "../../services/authService";
import logo from "../../assets/images/logo.png";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setError("");
    setSuccess("");
  };

  // ================= LOGIN =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const email = formData.email.trim();
    const password = formData.password;

    // Validation
    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      const result = await loginUser({ email, password });

      const user = result.user || result.data?.user;
      const token = result.token || result.data?.token;

      if (!user || !token) {
        throw new Error("Authentication response was incomplete.");
      }

      // Save real JWT in context & localStorage
      login(user, token);

      setSuccess(`Login successful! Welcome back, ${user.name}.`);

      setTimeout(() => {
        if (user.role === "admin") {
          navigate("/admin/dashboard");
        } else if (user.role === "mechanic") {
          navigate("/mechanic/dashboard");
        } else {
          navigate("/customer/dashboard");
        }
      }, 600);
    } catch (err) {
      console.error("Login Error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Invalid email or password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container-fluid min-vh-100 d-flex align-items-center justify-content-center py-5"
      style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
      }}
    >
      <div
        className="card border-0 shadow-lg"
        style={{
          maxWidth: "460px",
          width: "100%",
          borderRadius: "16px",
          overflow: "hidden",
        }}
      >
        {/* Card Header */}
        <div
          className="p-4 text-center text-white"
          style={{
            background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <img
            src={logo}
            alt="MRT Car Service"
            style={{ width: "64px", height: "64px", objectFit: "contain" }}
          />
          <h3 className="fw-bold mt-2 mb-0">MRT Car Service</h3>
          <p className="text-secondary small mb-0">Customer & Mechanic Portal</p>
        </div>

        {/* Card Body */}
        <div className="card-body p-4 p-sm-5 bg-white">
          <h4 className="fw-bold mb-1 text-dark">Sign In</h4>
          <p className="text-muted small mb-4">
            Enter your credentials to access your account.
          </p>

          {/* Error Message */}
          {error && (
            <div className="alert alert-danger d-flex align-items-center small py-2">
              <i className="bi bi-exclamation-triangle-fill me-2 fs-6"></i>
              <div>
                {error}
                {error.includes("Admin Login Portal") && (
                  <div className="mt-1">
                    <Link to="/admin/login" className="fw-bold text-danger">
                      Go to Admin Login &rarr;
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="alert alert-success d-flex align-items-center small py-2">
              <i className="bi bi-check-circle-fill me-2 fs-6"></i>
              <div>{success}</div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="mb-3">
              <label className="form-label small fw-semibold text-secondary">
                Email Address
              </label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <i className="bi bi-envelope text-muted"></i>
                </span>
                <input
                  type="email"
                  name="email"
                  className="form-control bg-light border-start-0"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-3">
              <div className="d-flex justify-content-between align-items-center">
                <label className="form-label small fw-semibold text-secondary">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-decoration-none small text-primary"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <i className="bi bi-lock text-muted"></i>
                </span>
                <input
                  type="password"
                  name="password"
                  className="form-control bg-light border-start-0"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn btn-primary w-100 py-2 fw-semibold mt-2 shadow-sm"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  ></span>
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Register Prompt */}
          <div className="text-center mt-4 pt-3 border-top">
            <p className="text-muted small mb-2">
              Don't have an account yet?{" "}
              <Link
                to="/register"
                className="fw-bold text-primary text-decoration-none"
              >
                Register
              </Link>
            </p>
            <div className="d-flex justify-content-center align-items-center gap-2 small mb-2">
              <Link
                to="/register?role=mechanic"
                className="fw-semibold text-primary text-decoration-none"
              >
                <i className="bi bi-tools me-1 text-warning"></i>
                Join as Mechanic
              </Link>
              <span className="text-muted">|</span>
              <Link
                to="/mechanic/login"
                className="fw-semibold text-secondary text-decoration-none"
              >
                Mechanic Portal
              </Link>
            </div>
            <div>
              <Link
                to="/admin/login"
                className="fw-semibold text-muted text-decoration-none small"
              >
                <i className="bi bi-shield-shaded me-1"></i> Admin Portal
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;