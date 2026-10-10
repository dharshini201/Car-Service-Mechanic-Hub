import React, { useState } from "react";
import { Link, useParams, useSearchParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../../services/authService";

function ResetPassword() {
  const { token: paramToken } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const resetToken = paramToken || searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!resetToken) {
      setError("Password reset token is missing from the link. Please check your email URL.");
      return;
    }

    if (!password || !confirmPassword) {
      setError("Please fill in both password fields.");
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
      const res = await resetPassword(resetToken, password, confirmPassword);
      setSuccess(res.message || "Your password has been successfully reset!");
      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        navigate("/login");
      }, 2500);
    } catch (err) {
      console.error("Reset password error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to reset password. The link may have expired or is invalid."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container-fluid d-flex align-items-center justify-content-center bg-light py-5"
      style={{ minHeight: "85vh" }}
    >
      <div
        className="card border-0 shadow-lg"
        style={{
          maxWidth: "460px",
          width: "100%",
          borderRadius: "16px",
        }}
      >
        <div className="card-body p-4 p-md-5">
          {/* Header */}
          <div className="text-center mb-4">
            <div
              className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center shadow-sm"
              style={{
                width: "70px",
                height: "70px",
              }}
            >
              <i className="bi bi-shield-lock" style={{ fontSize: "32px" }}></i>
            </div>

            <h2 className="fw-bold mt-3 mb-1">Set New Password</h2>

            <p className="text-muted mb-0 small">
              Please enter and confirm your new secure password.
            </p>
          </div>

          {/* Token missing alert */}
          {!resetToken && (
            <div className="alert alert-warning d-flex align-items-center gap-2 small">
              <i className="bi bi-exclamation-triangle-fill fs-5 text-warning"></i>
              <div>
                No reset token found in URL. If you received an email, please click the full link in your message.
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="alert alert-danger d-flex align-items-center gap-2 small">
              <i className="bi bi-exclamation-circle-fill fs-5 text-danger"></i>
              <div>{error}</div>
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="alert alert-success d-flex align-items-center gap-2 small">
              <i className="bi bi-check-circle-fill fs-5 text-success"></i>
              <div>
                <strong>{success}</strong>
                <div className="mt-1">Redirecting to login portal in a few seconds...</div>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* New Password */}
            <div className="mb-3">
              <label className="form-label fw-semibold small text-dark">
                New Password
              </label>

              <div className="input-group">
                <span className="input-group-text bg-white">
                  <i className="bi bi-lock text-muted"></i>
                </span>

                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  autoComplete="new-password"
                  disabled={loading || !!success}
                />

                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex="-1"
                >
                  <i className={`bi bi-eye${showPassword ? "-slash" : ""}`}></i>
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="mb-4">
              <label className="form-label fw-semibold small text-dark">
                Confirm New Password
              </label>

              <div className="input-group">
                <span className="input-group-text bg-white">
                  <i className="bi bi-shield-check text-muted"></i>
                </span>

                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  placeholder="Re-enter your new password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setError("");
                  }}
                  autoComplete="new-password"
                  disabled={loading || !!success}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 py-2 fw-semibold shadow-sm"
              disabled={loading || !resetToken || !!success}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Updating Password...
                </>
              ) : (
                <>
                  <i className="bi bi-check2-circle me-2"></i>
                  Reset Password
                </>
              )}
            </button>
          </form>

          {/* Links */}
          <div className="text-center mt-4">
            <Link to="/login" className="text-decoration-none fw-semibold small text-primary">
              <i className="bi bi-arrow-left me-1"></i>
              Back to Login
            </Link>
          </div>

          <div className="text-center mt-2">
            <Link to="/" className="text-decoration-none small text-secondary">
              <i className="bi bi-house me-1"></i>
              Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
