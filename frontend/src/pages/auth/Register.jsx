import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { registerUser } from "../../services/authService";

function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();

  const initialRole = searchParams.get("role") === "mechanic" ? "mechanic" : "customer";
  const [role, setRole] = useState(initialRole);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    experience: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const {
      name,
      email,
      phone,
      experience,
      password,
      confirmPassword,
    } = formData;

    if (!name.trim() || !email.trim() || !phone.trim() || !password || !confirmPassword) {
      setError("Please fill in all required fields.");
      return;
    }

    if (phone.trim().length < 10) {
      setError("Please enter a valid phone number (at least 10 digits).");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password,
        role,
        ...(role === "mechanic"
          ? { experience: experience ? Number(experience) : 0 }
          : {}),
      };

      const result = await registerUser(payload);

      if (!result.user || !result.token) {
        throw new Error("Registration response was incomplete.");
      }

      login(result.user, result.token);
      setSuccess(`Registration successful! Welcome, ${result.user.name}. Redirecting...`);

      setTimeout(() => {
        if (result.user.role === "mechanic") {
          navigate("/mechanic/dashboard");
        } else {
          navigate("/customer/dashboard");
        }
      }, 700);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to create your account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container-fluid d-flex align-items-center justify-content-center py-5"
      style={{
        minHeight: "85vh",
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
      }}
    >
      <div
        className="card border-0 shadow-lg rounded-4 overflow-hidden"
        style={{
          maxWidth: "520px",
          width: "100%",
          backgroundColor: "#ffffff",
        }}
      >
        <div className="card-body p-4 p-md-5">

          {/* Role Switcher Tabs */}
          <div className="d-flex p-1 bg-light rounded-pill mb-4 border">
            <button
              type="button"
              className={`btn flex-fill rounded-pill py-2 fw-semibold border-0 ${
                role === "customer"
                  ? "btn-primary shadow-sm"
                  : "text-muted"
              }`}
              onClick={() => handleRoleChange("customer")}
              style={{ transition: "all 0.2s ease" }}
            >
              <i className="bi bi-person me-2"></i>
              Customer
            </button>
            <button
              type="button"
              className={`btn flex-fill rounded-pill py-2 fw-semibold border-0 ${
                role === "mechanic"
                  ? "btn-warning text-dark shadow-sm"
                  : "text-muted"
              }`}
              onClick={() => handleRoleChange("mechanic")}
              style={{ transition: "all 0.2s ease" }}
            >
              <i className="bi bi-tools me-2"></i>
              Mechanic
            </button>
          </div>

          {/* Header */}
          <div className="text-center mb-4">
            <div
              className={`${
                role === "mechanic" ? "bg-warning text-dark" : "bg-primary text-white"
              } rounded-circle d-inline-flex align-items-center justify-content-center shadow-sm`}
              style={{
                width: "64px",
                height: "64px",
              }}
            >
              <i
                className={`bi ${role === "mechanic" ? "bi-tools" : "bi-person-plus"}`}
                style={{ fontSize: "28px" }}
              ></i>
            </div>

            <h3 className="fw-bold mt-3 mb-1 text-dark">
              {role === "mechanic" ? "Register as Mechanic" : "Create Customer Account"}
            </h3>

            <p className="text-muted small mb-0">
              {role === "mechanic"
                ? "Join our workshop team to receive auto-assigned repair jobs"
                : "Sign up to book and manage vehicle maintenance and repairs"}
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="alert alert-danger d-flex align-items-center py-2 px-3 rounded-3 mb-3 small">
              <i className="bi bi-exclamation-triangle-fill me-2 fs-5 flex-shrink-0"></i>
              <div>{error}</div>
            </div>
          )}

          {/* Success Alert */}
          {success && (
            <div className="alert alert-success d-flex align-items-center py-2 px-3 rounded-3 mb-3 small">
              <i className="bi bi-check-circle-fill me-2 fs-5 flex-shrink-0"></i>
              <div>{success}</div>
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* Name */}
            <div className="mb-3">
              <label className="form-label fw-semibold small text-dark">
                Full Name <span className="text-danger">*</span>
              </label>
              <div className="input-group">
                <span className="input-group-text bg-light text-muted">
                  <i className="bi bi-person"></i>
                </span>
                <input
                  type="text"
                  name="name"
                  className="form-control bg-light"
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="mb-3">
              <label className="form-label fw-semibold small text-dark">
                Email Address <span className="text-danger">*</span>
              </label>
              <div className="input-group">
                <span className="input-group-text bg-light text-muted">
                  <i className="bi bi-envelope"></i>
                </span>
                <input
                  type="email"
                  name="email"
                  className="form-control bg-light"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div className="mb-3">
              <label className="form-label fw-semibold small text-dark">
                Phone Number <span className="text-danger">*</span>
              </label>
              <div className="input-group">
                <span className="input-group-text bg-light text-muted">
                  <i className="bi bi-telephone"></i>
                </span>
                <input
                  type="tel"
                  name="phone"
                  className="form-control bg-light"
                  placeholder="Enter 10-digit phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Experience (Shown for Mechanic role) */}
            {role === "mechanic" && (
              <div className="mb-3">
                <label className="form-label fw-semibold small text-dark">
                  Years of Experience
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light text-muted">
                    <i className="bi bi-briefcase"></i>
                  </span>
                  <input
                    type="number"
                    name="experience"
                    className="form-control bg-light"
                    placeholder="e.g. 5"
                    min="0"
                    max="50"
                    value={formData.experience}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-text text-muted small">
                  Optional: Number of years working in automotive maintenance.
                </div>
              </div>
            )}

            {/* Password */}
            <div className="mb-3">
              <label className="form-label fw-semibold small text-dark">
                Password <span className="text-danger">*</span>
              </label>
              <div className="input-group">
                <span className="input-group-text bg-light text-muted">
                  <i className="bi bi-lock"></i>
                </span>
                <input
                  type="password"
                  name="password"
                  className="form-control bg-light"
                  placeholder="Create password (min 6 characters)"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="mb-4">
              <label className="form-label fw-semibold small text-dark">
                Confirm Password <span className="text-danger">*</span>
              </label>
              <div className="input-group">
                <span className="input-group-text bg-light text-muted">
                  <i className="bi bi-shield-lock"></i>
                </span>
                <input
                  type="password"
                  name="confirmPassword"
                  className="form-control bg-light"
                  placeholder="Re-enter password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`btn ${
                role === "mechanic" ? "btn-warning text-dark" : "btn-primary"
              } w-100 py-2 fw-semibold rounded-pill shadow-sm`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  ></span>
                  Creating Account...
                </>
              ) : (
                <>
                  <i
                    className={`bi ${
                      role === "mechanic" ? "bi-tools" : "bi-person-plus"
                    } me-2`}
                  ></i>
                  {role === "mechanic"
                    ? "Register as Mechanic"
                    : "Create Customer Account"}
                </>
              )}
            </button>

          </form>

          {/* Links */}
          <div className="text-center mt-4 pt-2 border-top">
            <p className="text-muted small mb-1">
              Already have an account?
            </p>
            {role === "mechanic" ? (
              <Link
                to="/mechanic/login"
                className="text-decoration-none fw-semibold small text-warning text-dark"
              >
                <i className="bi bi-box-arrow-in-right me-1"></i>
                Sign In to Mechanic Portal
              </Link>
            ) : (
              <Link
                to="/login"
                className="text-decoration-none fw-semibold small text-primary"
              >
                <i className="bi bi-box-arrow-in-right me-1"></i>
                Sign In to Customer Account
              </Link>
            )}
          </div>

          {/* Back to Home */}
          <div className="text-center mt-3">
            <Link
              to="/"
              className="text-decoration-none text-muted small"
            >
              <i className="bi bi-arrow-left me-1"></i>
              Back to Website
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Register;