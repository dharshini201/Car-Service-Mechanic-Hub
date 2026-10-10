import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { getUserProfile, updateUserProfile } from "../../services/userService";
import api from "../../services/api";

function Settings() {
  const [adminData, setAdminData] = useState({
    name: "Admin",
    email: "admin@carservice.com",
  });

  const [settings, setSettings] = useState({
    websiteName: "Car Service & Mechanic Hub",
    phone: "9876543210",
    email: "support@carservice.com",
    address: "Chennai, Tamil Nadu",
    emailNotifications: true,
    bookingNotifications: true,
    maintenanceNotifications: true,
    autoConfirmBookings: false,
  });

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Gmail Diagnostics State
  const [emailStatus, setEmailStatus] = useState(null);
  const [testEmailAddress, setTestEmailAddress] = useState("");
  const [sendingTestEmail, setSendingTestEmail] = useState(false);
  const [testEmailResult, setTestEmailResult] = useState(null);

  const fetchEmailStatus = async () => {
    try {
      const res = await api.get("/admin/email-status");
      setEmailStatus(res.data);
    } catch (e) {
      console.warn("Could not fetch email status:", e.message);
    }
  };

  const handleSendTestEmail = async (e) => {
    e.preventDefault();
    if (!testEmailAddress) return;
    try {
      setSendingTestEmail(true);
      setTestEmailResult(null);
      const res = await api.post("/admin/test-email", { email: testEmailAddress });
      setTestEmailResult({ success: true, message: res.data.message });
    } catch (err) {
      setTestEmailResult({
        success: false,
        message: err.response?.data?.message || err.message || "Failed to dispatch email",
      });
    } finally {
      setSendingTestEmail(false);
    }
  };

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const profileRes = await getUserProfile();
        if (profileRes?.user) {
          setAdminData({
            name: profileRes.user.name || "Admin",
            email: profileRes.user.email || "admin@carservice.com",
            phone: profileRes.user.phone || "",
          });
          setTestEmailAddress(profileRes.user.email || "admin@carservice.com");
        }
      } catch (err) {
        console.error("Admin Profile Fetch Error:", err);
      }
    };

    fetchAdminProfile();
    fetchEmailStatus();

    const savedSettings =
      JSON.parse(localStorage.getItem("adminSettings")) || null;

    if (savedSettings) {
      setSettings((prev) => ({
        ...prev,
        ...savedSettings,
      }));
    }
  }, []);

  // ================= INPUT CHANGE =================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setSettings({
      ...settings,
      [name]: type === "checkbox" ? checked : value,
    });

    setSuccess("");
    setError("");
  };

  // ================= ADMIN PROFILE =================

  const handleAdminChange = (e) => {
    setAdminData({
      ...adminData,
      [e.target.name]: e.target.value,
    });

    setSuccess("");
    setError("");
  };

  // ================= SAVE SETTINGS =================

  const handleSave = async (e) => {
    e.preventDefault();

    setSuccess("");
    setError("");

    if (
      !settings.websiteName ||
      !settings.phone ||
      !settings.email ||
      !settings.address
    ) {
      setError("Please fill all website information fields.");
      return;
    }

    try {
      if (adminData.name) {
        await updateUserProfile({
          name: adminData.name,
          phone: adminData.phone || "",
        });
      }

      localStorage.setItem(
        "adminSettings",
        JSON.stringify(settings)
      );

      const currentUser =
        JSON.parse(localStorage.getItem("user")) || {};

      const updatedUser = {
        ...currentUser,
        name: adminData.name,
        role: "admin",
      };

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      setSuccess("Settings and admin profile updated successfully!");

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      console.error("Save Settings Error:", err);
      setError(err?.response?.data?.message || err.message || "Failed to save settings.");
    }
  };

  // ================= RESET SETTINGS =================

  const handleReset = () => {
    const confirmReset = window.confirm(
      "Are you sure you want to reset all settings?"
    );

    if (!confirmReset) return;

    const defaultSettings = {
      websiteName: "Car Service & Mechanic Hub",
      phone: "9876543210",
      email: "support@carservice.com",
      address: "Chennai, Tamil Nadu",
      emailNotifications: true,
      bookingNotifications: true,
      maintenanceNotifications: true,
      autoConfirmBookings: false,
    };

    setSettings(defaultSettings);

    localStorage.setItem(
      "adminSettings",
      JSON.stringify(defaultSettings)
    );

    setSuccess("Settings have been reset.");
  };

  return (
    <div className="container-fluid">
      <div className="row">

        {/* ================= SIDEBAR ================= */}

        <div className="col-md-3 col-lg-2 px-0">
          <Sidebar role="admin" />
        </div>

        {/* ================= MAIN CONTENT ================= */}

        <div className="col-md-9 col-lg-10 py-4">

          {/* ================= HEADER ================= */}

          <div className="d-flex justify-content-between align-items-center mb-4">

            <div>
              <h2 className="fw-bold mb-1">
                Settings
              </h2>

              <p className="text-muted mb-0">
                Manage admin and website settings.
              </p>
            </div>

            <Link
              to="/admin/dashboard"
              className="btn btn-outline-dark"
            >
              <i className="bi bi-arrow-left me-2"></i>
              Dashboard
            </Link>

          </div>

          {/* ================= ALERTS ================= */}

          {success && (
            <div className="alert alert-success">
              <i className="bi bi-check-circle-fill me-2"></i>
              {success}
            </div>
          )}

          {error && (
            <div className="alert alert-danger">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {error}
            </div>
          )}

          <form onSubmit={handleSave}>

            {/* ================= ADMIN PROFILE ================= */}

            <div className="card border-0 shadow-sm mb-4">

              <div className="card-body p-4">

                <div className="d-flex align-items-center mb-4">

                  <div
                    className="bg-dark text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                    style={{
                      width: "55px",
                      height: "55px",
                    }}
                  >
                    <i
                      className="bi bi-person-fill"
                      style={{ fontSize: "25px" }}
                    ></i>
                  </div>

                  <div>
                    <h4 className="fw-bold mb-1">
                      Admin Profile
                    </h4>

                    <p className="text-muted mb-0">
                      Manage administrator account information.
                    </p>
                  </div>

                </div>

                <div className="row g-3">

                  <div className="col-md-6">

                    <label className="form-label fw-semibold">
                      Admin Name
                    </label>

                    <div className="input-group">

                      <span className="input-group-text">
                        <i className="bi bi-person"></i>
                      </span>

                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        value={adminData.name}
                        onChange={handleAdminChange}
                      />

                    </div>

                  </div>

                  <div className="col-md-6">

                    <label className="form-label fw-semibold">
                      Admin Email
                    </label>

                    <div className="input-group">

                      <span className="input-group-text">
                        <i className="bi bi-envelope"></i>
                      </span>

                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        value={adminData.email}
                        onChange={handleAdminChange}
                      />

                    </div>

                  </div>

                </div>

              </div>

            </div>

            {/* ================= WEBSITE INFORMATION ================= */}

            <div className="card border-0 shadow-sm mb-4">

              <div className="card-body p-4">

                <div className="d-flex align-items-center mb-4">

                  <div
                    className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center me-3"
                    style={{
                      width: "55px",
                      height: "55px",
                    }}
                  >
                    <i
                      className="bi bi-globe2"
                      style={{ fontSize: "25px" }}
                    ></i>
                  </div>

                  <div>
                    <h4 className="fw-bold mb-1">
                      Website Information
                    </h4>

                    <p className="text-muted mb-0">
                      Update basic website contact information.
                    </p>
                  </div>

                </div>

                <div className="row g-3">

                  <div className="col-md-6">

                    <label className="form-label fw-semibold">
                      Website Name
                    </label>

                    <input
                      type="text"
                      name="websiteName"
                      className="form-control"
                      value={settings.websiteName}
                      onChange={handleChange}
                    />

                  </div>

                  <div className="col-md-6">

                    <label className="form-label fw-semibold">
                      Contact Phone
                    </label>

                    <input
                      type="text"
                      name="phone"
                      className="form-control"
                      value={settings.phone}
                      onChange={handleChange}
                    />

                  </div>

                  <div className="col-md-6">

                    <label className="form-label fw-semibold">
                      Support Email
                    </label>

                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      value={settings.email}
                      onChange={handleChange}
                    />

                  </div>

                  <div className="col-md-6">

                    <label className="form-label fw-semibold">
                      Address
                    </label>

                    <input
                      type="text"
                      name="address"
                      className="form-control"
                      value={settings.address}
                      onChange={handleChange}
                    />

                  </div>

                </div>

              </div>

            </div>

            {/* ================= NOTIFICATION SETTINGS ================= */}

            <div className="card border-0 shadow-sm mb-4">

              <div className="card-body p-4">

                <div className="d-flex align-items-center mb-4">

                  <div
                    className="bg-warning bg-opacity-10 text-warning rounded-circle d-flex align-items-center justify-content-center me-3"
                    style={{
                      width: "55px",
                      height: "55px",
                    }}
                  >
                    <i
                      className="bi bi-bell-fill"
                      style={{ fontSize: "25px" }}
                    ></i>
                  </div>

                  <div>
                    <h4 className="fw-bold mb-1">
                      Notification Settings
                    </h4>

                    <p className="text-muted mb-0">
                      Control system notification preferences.
                    </p>
                  </div>

                </div>

                {/* Email Notifications */}

                <div className="form-check form-switch border-bottom py-3">

                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    name="emailNotifications"
                    checked={settings.emailNotifications}
                    onChange={handleChange}
                    id="emailNotifications"
                  />

                  <label
                    className="form-check-label"
                    htmlFor="emailNotifications"
                  >
                    <span className="fw-semibold d-block">
                      Email Notifications
                    </span>

                    <small className="text-muted">
                      Receive important system notifications by
                      email.
                    </small>
                  </label>

                </div>

                {/* Booking Notifications */}

                <div className="form-check form-switch border-bottom py-3">

                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    name="bookingNotifications"
                    checked={settings.bookingNotifications}
                    onChange={handleChange}
                    id="bookingNotifications"
                  />

                  <label
                    className="form-check-label"
                    htmlFor="bookingNotifications"
                  >
                    <span className="fw-semibold d-block">
                      Booking Notifications
                    </span>

                    <small className="text-muted">
                      Get notified when customers create new
                      bookings.
                    </small>
                  </label>

                </div>

                {/* Maintenance Notifications */}

                <div className="form-check form-switch py-3">

                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    name="maintenanceNotifications"
                    checked={
                      settings.maintenanceNotifications
                    }
                    onChange={handleChange}
                    id="maintenanceNotifications"
                  />

                  <label
                    className="form-check-label"
                    htmlFor="maintenanceNotifications"
                  >
                    <span className="fw-semibold d-block">
                      Maintenance Notifications
                    </span>

                    <small className="text-muted">
                      Receive reminders for vehicle service
                      maintenance.
                    </small>
                  </label>

                </div>

              </div>

            </div>

            {/* ================= GMAIL & SMTP CONFIGURATION ================= */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body p-4">
                <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
                  <div className="d-flex align-items-center">
                    <div
                      className="bg-danger bg-opacity-10 text-danger rounded-circle d-flex align-items-center justify-content-center me-3"
                      style={{ width: "55px", height: "55px" }}
                    >
                      <i className="bi bi-envelope-at-fill" style={{ fontSize: "25px" }}></i>
                    </div>
                    <div>
                      <h4 className="fw-bold mb-1">Gmail &amp; Email Delivery Hub</h4>
                      <p className="text-muted mb-0">
                        Live Nodemailer SMTP status and dispatch verification.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm rounded-pill px-3"
                    onClick={fetchEmailStatus}
                  >
                    <i className="bi bi-arrow-repeat me-1"></i> Refresh Status
                  </button>
                </div>

                <div className="p-3 bg-light rounded-3 mb-4 border">
                  <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-2">
                    <span className="fw-semibold">Current SMTP Provider:</span>
                    <span className="badge bg-primary px-3 py-2">
                      <i className="bi bi-google me-1"></i> Gmail (smtp.gmail.com)
                    </span>
                  </div>
                  <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-2">
                    <span className="fw-semibold">Sender Account:</span>
                    <span className="text-dark fw-bold font-monospace">
                      {emailStatus?.emailUser || "Checking..."}
                    </span>
                  </div>
                  <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                    <span className="fw-semibold">Status:</span>
                    {emailStatus?.isConfigured ? (
                      <span className="badge bg-success px-3 py-2">
                        <i className="bi bi-check-circle-fill me-1"></i> Connected &amp; Verified
                      </span>
                    ) : (
                      <span className="badge bg-warning text-dark px-3 py-2">
                        <i className="bi bi-info-circle-fill me-1"></i> Simulated Mode (Needs App Password in backend/.env)
                      </span>
                    )}
                  </div>
                  {emailStatus?.message && (
                    <small className="text-muted d-block mt-2">
                      {emailStatus.message}
                    </small>
                  )}
                </div>

                <div className="border rounded-3 p-3 mb-2 bg-white">
                  <h6 className="fw-bold mb-2">Send a Test Email</h6>
                  <p className="text-muted small mb-3">
                    Verify that your Gmail account can deliver real emails to customers and mechanics.
                  </p>
                  <form onSubmit={handleSendTestEmail} className="d-flex gap-2 flex-wrap">
                    <input
                      type="email"
                      className="form-control"
                      style={{ maxWidth: "350px" }}
                      placeholder="Enter recipient email"
                      value={testEmailAddress}
                      onChange={(e) => setTestEmailAddress(e.target.value)}
                      required
                    />
                    <button
                      type="submit"
                      className="btn btn-danger fw-semibold rounded-pill px-4"
                      disabled={sendingTestEmail}
                    >
                      {sendingTestEmail ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Sending...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-send-fill me-1"></i> Send Test Email
                        </>
                      )}
                    </button>
                  </form>

                  {testEmailResult && (
                    <div className={`alert ${testEmailResult.success ? "alert-success" : "alert-danger"} mt-3 py-2 px-3 mb-0 small`}>
                      <i className={`bi ${testEmailResult.success ? "bi-check-circle-fill" : "bi-exclamation-triangle-fill"} me-2`}></i>
                      {testEmailResult.message}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ================= SERVICE SETTINGS ================= */}

            <div className="card border-0 shadow-sm mb-4">

              <div className="card-body p-4">

                <div className="d-flex align-items-center mb-4">

                  <div
                    className="bg-success bg-opacity-10 text-success rounded-circle d-flex align-items-center justify-content-center me-3"
                    style={{
                      width: "55px",
                      height: "55px",
                    }}
                  >
                    <i
                      className="bi bi-gear-fill"
                      style={{ fontSize: "25px" }}
                    ></i>
                  </div>

                  <div>
                    <h4 className="fw-bold mb-1">
                      Service Settings
                    </h4>

                    <p className="text-muted mb-0">
                      Configure booking behavior.
                    </p>
                  </div>

                </div>

                <div className="form-check form-switch">

                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    name="autoConfirmBookings"
                    checked={settings.autoConfirmBookings}
                    onChange={handleChange}
                    id="autoConfirmBookings"
                  />

                  <label
                    className="form-check-label"
                    htmlFor="autoConfirmBookings"
                  >
                    <span className="fw-semibold d-block">
                      Auto Confirm Bookings
                    </span>

                    <small className="text-muted">
                      Automatically confirm newly created service
                      bookings.
                    </small>
                  </label>

                </div>

              </div>

            </div>

            {/* ================= ACTION BUTTONS ================= */}

            <div className="card border-0 shadow-sm">

              <div className="card-body p-4">

                <div className="d-flex justify-content-between align-items-center">

                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={handleReset}
                  >
                    <i className="bi bi-arrow-counterclockwise me-2"></i>
                    Reset Settings
                  </button>

                  <button
                    type="submit"
                    className="btn btn-primary px-4"
                  >
                    <i className="bi bi-save me-2"></i>
                    Save Settings
                  </button>

                </div>

              </div>

            </div>

          </form>

        </div>
      </div>
    </div>
  );
}

export default Settings;