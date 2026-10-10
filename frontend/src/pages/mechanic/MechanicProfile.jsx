import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import {
  getMechanicProfile,
  updateMechanicProfile,
} from "../../services/mechanicService";
import { useAuth } from "../../context/AuthContext";

function MechanicProfile() {
  const { user: authUser } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    experience: 0,
    isAvailable: true,
    password: "",
    confirmPassword: "",
  });

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getMechanicProfile();
      if (res.profile) {
        setProfile(res.profile);
        setFormData({
          name: res.profile.name || "",
          phone: res.profile.phone || "",
          experience: res.profile.experience || 0,
          isAvailable: res.profile.isAvailable !== false,
          password: "",
          confirmPassword: "",
        });
      }
    } catch (err) {
      console.error("Profile Fetch Error:", err);
      setError(err?.response?.data?.message || "Failed to load mechanic profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password && formData.password.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      setError("Password confirmation does not match.");
      return;
    }

    try {
      setSaving(true);
      const payload = {
        name: formData.name,
        phone: formData.phone,
        experience: Number(formData.experience),
        isAvailable: formData.isAvailable,
      };

      if (formData.password) {
        payload.password = formData.password;
      }

      const res = await updateMechanicProfile(payload);
      if (res.success) {
        setSuccess("Profile information updated successfully!");
        setFormData((prev) => ({ ...prev, password: "", confirmPassword: "" }));
        await fetchProfile();
        setTimeout(() => setSuccess(""), 4000);
      }
    } catch (err) {
      console.error("Update Profile Error:", err);
      setError(err?.response?.data?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-3 col-lg-2 px-0">
          <Sidebar role="mechanic" />
        </div>

        {/* Main Content */}
        <main className="col-md-9 col-lg-10 py-4 px-4 bg-light min-vh-100">
          <div className="mb-4">
            <h2 className="fw-bold mb-1 text-dark">Mechanic Profile</h2>
            <p className="text-secondary mb-0">
              Manage your technical credentials, experience, contact details, and availability.
            </p>
          </div>

          {error && (
            <div className="alert alert-danger d-flex align-items-center mb-4">
              <i className="bi bi-exclamation-octagon-fill me-2 fs-5"></i>
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
              <p className="mt-2 text-muted small">Loading profile...</p>
            </div>
          ) : (
            <div className="row g-4">
              {/* Profile Card Summary */}
              <div className="col-lg-4">
                <div className="card border-0 shadow-sm rounded-4 p-4 text-center bg-white mb-4">
                  <div
                    className="mx-auto rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center fw-bold mb-3 shadow-sm"
                    style={{ width: "90px", height: "90px", fontSize: "36px" }}
                  >
                    {profile?.name?.charAt(0).toUpperCase() || "M"}
                  </div>
                  <h4 className="fw-bold text-dark mb-1">{profile?.name}</h4>
                  <span className="badge bg-primary-subtle text-primary border px-3 py-1 rounded-pill mb-2">
                    Certified Technician
                  </span>
                  <p className="text-secondary small mb-3">
                    <i className="bi bi-envelope me-1"></i> {profile?.email}
                  </p>

                  <div className="d-flex justify-content-center gap-2 mb-3">
                    <span
                      className={`badge px-3 py-2 rounded-pill ${
                        profile?.isAvailable ? "bg-success" : "bg-secondary"
                      }`}
                    >
                      <i className="bi bi-circle-fill me-1" style={{ fontSize: "8px" }}></i>
                      {profile?.isAvailable ? "Active & Available" : "On Leave / Busy"}
                    </span>
                    <span className="badge bg-dark px-3 py-2 rounded-pill">
                      Role: Mechanic
                    </span>
                  </div>

                  <hr className="my-3 border-light-subtle" />

                  {/* Quick stats */}
                  <div className="row g-2 text-center">
                    <div className="col-6">
                      <div className="p-2 bg-light rounded-3">
                        <small className="text-muted d-block" style={{ fontSize: "11px" }}>
                          ACTIVE JOBS
                        </small>
                        <strong className="text-primary fs-5">
                          {profile?.stats?.totalAssigned || 0}
                        </strong>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="p-2 bg-light rounded-3">
                        <small className="text-muted d-block" style={{ fontSize: "11px" }}>
                          COMPLETED
                        </small>
                        <strong className="text-success fs-5">
                          {profile?.stats?.completed || 0}
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Edit Details Form */}
              <div className="col-lg-8">
                <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
                  <h5 className="fw-bold text-dark mb-4">
                    <i className="bi bi-pencil-square me-2 text-primary"></i>
                    Update Mechanic Information
                  </h5>

                  <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                      {/* Name */}
                      <div className="col-md-6">
                        <label className="form-label fw-semibold text-dark small">Full Name</label>
                        <input
                          type="text"
                          className="form-control bg-light"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      {/* Email (Readonly) */}
                      <div className="col-md-6">
                        <label className="form-label fw-semibold text-dark small">
                          Email Address <span className="text-muted fw-normal">(Managed by Admin)</span>
                        </label>
                        <input
                          type="email"
                          className="form-control bg-light-subtle text-muted"
                          value={profile?.email || ""}
                          disabled
                        />
                      </div>

                      {/* Phone */}
                      <div className="col-md-6">
                        <label className="form-label fw-semibold text-dark small">Phone Number</label>
                        <input
                          type="tel"
                          className="form-control bg-light"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                        />
                      </div>



                      {/* Experience */}
                      <div className="col-md-6">
                        <label className="form-label fw-semibold text-dark small">
                          Experience (Years)
                        </label>
                        <input
                          type="number"
                          className="form-control bg-light"
                          name="experience"
                          min="0"
                          max="50"
                          value={formData.experience}
                          onChange={handleChange}
                        />
                      </div>

                      {/* Availability Checkbox */}
                      <div className="col-md-6 d-flex align-items-center">
                        <div className="form-check form-switch mt-4">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            id="isAvailableSwitch"
                            name="isAvailable"
                            checked={formData.isAvailable}
                            onChange={handleChange}
                          />
                          <label className="form-check-label fw-semibold text-dark" htmlFor="isAvailableSwitch">
                            Available for new service jobs
                          </label>
                        </div>
                      </div>

                      <hr className="my-4 border-light-subtle" />

                      <h6 className="fw-bold text-dark mb-2">Change Password (Optional)</h6>

                      {/* Password */}
                      <div className="col-md-6">
                        <label className="form-label fw-semibold text-dark small">New Password</label>
                        <input
                          type="password"
                          className="form-control bg-light"
                          name="password"
                          placeholder="Leave blank to keep unchanged"
                          value={formData.password}
                          onChange={handleChange}
                        />
                      </div>

                      {/* Confirm Password */}
                      <div className="col-md-6">
                        <label className="form-label fw-semibold text-dark small">Confirm New Password</label>
                        <input
                          type="password"
                          className="form-control bg-light"
                          name="confirmPassword"
                          placeholder="Re-enter new password"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="mt-4 pt-2">
                      <button
                        type="submit"
                        className="btn btn-primary px-4 py-2 rounded-pill fw-semibold shadow-sm"
                        disabled={saving}
                      >
                        {saving ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Saving Changes...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-check2-circle me-2"></i>
                            Save Profile Changes
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default MechanicProfile;
