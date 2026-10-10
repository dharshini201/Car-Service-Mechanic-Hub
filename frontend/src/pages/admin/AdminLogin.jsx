import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { loginUser } from "../../services/authService";
import logo from "../../assets/images/logo.png";

function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      const result = await loginUser({
        email: email.trim(),
        password: password,
      });

      console.log("Login Response:", result);

      const user = result.user || result.data?.user;
      const token = result.token || result.data?.token;

      if (!token) {
        throw new Error(
          "Login successful, but token was not received."
        );
      }

      if (!user) {
        throw new Error(
          "Login successful, but user data was not received."
        );
      }

      if (user.role !== "admin") {
        throw new Error(
          "Access denied. Admin account required."
        );
      }

      login(user, token);

      console.log("Admin Login Successful");

      navigate("/admin/dashboard");

    } catch (err) {
      console.error("Admin Login Error:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to login. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light"
    >
      <div
        className="card border-0 shadow"
        style={{
          width: "100%",
          maxWidth: "450px",
        }}
      >
        <div className="card-body p-4">

          {/* ================= LOGO ================= */}
          <div className="text-center mb-3">
            <img
              src={logo}
              alt="MRT Car Service"
              style={{
                width: "100px",
                height: "100px",
                objectFit: "contain",
              }}
            />
          </div>

          {/* ================= TITLE ================= */}
          <h2 className="text-center fw-bold">
            Admin Login
          </h2>

          <p className="text-center text-muted mb-4">
            Login to manage Car Service Mechanic Hub
          </p>

          {/* ================= ERROR ================= */}
          {error && (
            <div
              className="alert alert-danger"
              role="alert"
            >
              <i className="bi bi-exclamation-triangle me-2"></i>
              {error}
            </div>
          )}

          {/* ================= LOGIN FORM ================= */}
          <form onSubmit={handleSubmit}>

            {/* Email */}
            <div className="mb-3">

              <label
                htmlFor="adminEmail"
                className="form-label fw-semibold"
              >
                Email
              </label>

              <div className="input-group">

                <span className="input-group-text">
                  <i className="bi bi-envelope"></i>
                </span>

                <input
                  id="adminEmail"
                  type="email"
                  className="form-control"
                  placeholder="Enter admin email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  disabled={loading}
                  autoComplete="email"
                />

              </div>
            </div>

            {/* Password */}
            <div className="mb-4">

              <label
                htmlFor="adminPassword"
                className="form-label fw-semibold"
              >
                Password
              </label>

              <div className="input-group">

                <span className="input-group-text">
                  <i className="bi bi-lock"></i>
                </span>

                <input
                  id="adminPassword"
                  type="password"
                  className="form-control"
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  disabled={loading}
                  autoComplete="current-password"
                />

              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="btn btn-dark w-100"
              disabled={loading}
            >

              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>

                  Logging in...
                </>
              ) : (
                <>
                  <i className="bi bi-box-arrow-in-right me-2"></i>
                  Admin Login
                </>
              )}

            </button>

          </form>

          {/* ================= BACK TO HOME ================= */}
          <div className="text-center mt-4">

            <button
              type="button"
              className="btn btn-link text-decoration-none"
              onClick={() => navigate("/")}
              disabled={loading}
            >
              <i className="bi bi-arrow-left me-1"></i>
              Back to Home
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}

export default AdminLogin;