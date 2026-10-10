import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { getUserProfile, updateUserProfile } from "../../services/userService";
import { useAuth } from "../../context/AuthContext";

function EditProfile() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await getUserProfile();
        const u = res.user || res.data;
        if (u) {
          setFormData({
            name: u.name || "",
            email: u.email || "",
            phone: u.phone || "",
            password: "",
          });
        }
      } catch (err) {
        console.error("Fetch profile error:", err);
        const stored = localStorage.getItem("user");
        if (stored) {
          const u = JSON.parse(stored);
          setFormData({
            name: u.name || "",
            email: u.email || "",
            phone: u.phone || "",
            password: "",
          });
        }
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setError("Name, email, and phone number are required.");
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
      };

      if (formData.password) {
        if (formData.password.length < 6) {
          setError("Password must be at least 6 characters.");
          setSubmitting(false);
          return;
        }
        payload.password = formData.password;
      }

      const res = await updateUserProfile(payload);

      if (res.success) {
        // Update user in context and localStorage
        const token = localStorage.getItem("token");
        if (res.user && token) {
          login(res.user, token);
        }

        setSuccess("Profile updated successfully! Redirecting...");
        setTimeout(() => {
          navigate("/customer/profile");
        }, 800);
      }
    } catch (err) {
      console.error("Update profile error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to update profile. Email might already be taken."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-3 col-lg-2 px-0">
          <Sidebar role="customer" />
        </div>

        {/* Main Content */}
        <main className="col-md-9 col-lg-10 py-4 px-4 bg-light min-vh-100">
          <div className="mb-4">
            <Link
              to="/customer/profile"
              className="text-decoration-none small text-secondary fw-semibold mb-2 d-inline-block"
            >
              <i className="bi bi-arrow-left me-1"></i> Back to Profile
            </Link>
            <h2 className="fw-bold mb-1 text-dark">Edit Profile</h2>
            <p className="text-secondary mb-0">
              Modify your personal account details and credentials.
            </p>
          </div>

          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
                {error && (
                  <div className="alert alert-danger d-flex align-items-center mb-4">
                    <i className="bi bi-exclamation-triangle-fill me-2 fs-5"></i>
                    <div>{error}</div>
                  </div>
                )}

                {success && (
                  <div className="alert alert-success d-flex align-items-center mb-4">
                    <i className="bi bi-check-circle-fill me-2 fs-5"></i>
                    <div>{success}</div>
                  </div>
                )}

                {loading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status"></div>
                    <p className="mt-2 text-muted small">Loading user details...</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                      {/* Name */}
                      <div className="col-12">
                        <label className="form-label small fw-semibold text-secondary">
                          Full Name <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          className="form-control bg-light"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      {/* Email */}
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold text-secondary">
                          Email Address <span className="text-danger">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          className="form-control bg-light"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      {/* Phone */}
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold text-secondary">
                          Phone Number <span className="text-danger">*</span>
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          className="form-control bg-light"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      {/* Change Password */}
                      <div className="col-12">
                        <label className="form-label small fw-semibold text-secondary">
                          New Password (Leave blank to keep unchanged)
                        </label>
                        <input
                          type="password"
                          name="password"
                          className="form-control bg-light"
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="d-flex justify-content-end gap-3 mt-4 pt-3 border-top">
                      <Link
                        to="/customer/profile"
                        className="btn btn-outline-secondary rounded-pill px-4"
                      >
                        Cancel
                      </Link>
                      <button
                        type="submit"
                        className="btn btn-primary rounded-pill px-5 fw-semibold shadow-sm"
                        disabled={submitting}
                      >
                        {submitting ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                            ></span>
                            Saving...
                          </>
                        ) : (
                          "Save Changes"
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default EditProfile;