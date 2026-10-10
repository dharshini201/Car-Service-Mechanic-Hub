import React, { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../../services/authService";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError("Please enter your email address.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);
      const res = await forgotPassword(trimmedEmail);
      setSuccess(
        res.message ||
          "Password reset instructions have been sent to your email. Please check your inbox and spam folder."
      );
      setEmail("");
    } catch (err) {
      console.error("Forgot password request failed:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to request password reset. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container-fluid d-flex align-items-center justify-content-center bg-light"
      style={{ minHeight: "85vh" }}
    >
      <div
        className="card border-0 shadow-lg"
        style={{
          maxWidth: "450px",
          width: "100%",
        }}
      >
        <div className="card-body p-4 p-md-5">

          {/* Header */}
          <div className="text-center mb-4">
            <div
              className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center"
              style={{
                width: "70px",
                height: "70px",
              }}
            >
              <i
                className="bi bi-key"
                style={{ fontSize: "32px" }}
              ></i>
            </div>

            <h2 className="fw-bold mt-3 mb-1">
              Forgot Password?
            </h2>

            <p className="text-muted mb-0">
              Enter your email to reset your password
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="alert alert-danger">
              <i className="bi bi-exclamation-triangle me-2"></i>
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="alert alert-success">
              <i className="bi bi-check-circle me-2"></i>
              {success}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="form-label fw-semibold">
                Email Address
              </label>

              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-envelope"></i>
                </span>

                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                    setSuccess("");
                  }}
                  autoComplete="email"
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 py-2 fw-semibold shadow-sm"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Sending Reset Link...
                </>
              ) : (
                <>
                  <i className="bi bi-send me-2"></i>
                  Send Reset Instructions
                </>
              )}
            </button>
          </form>

          {/* Back to Login */}
          <div className="text-center mt-4">
            <Link
              to="/login"
              className="text-decoration-none"
            >
              <i className="bi bi-arrow-left me-2"></i>
              Back to Login
            </Link>
          </div>

          {/* Back to Website */}
          <div className="text-center mt-3">
            <Link
              to="/"
              className="text-decoration-none"
            >
              <i className="bi bi-house me-2"></i>
              Back to Website
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;