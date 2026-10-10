import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { getUserProfile } from "../../services/userService";

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await getUserProfile();
        setUser(res.user || res.data);
      } catch (err) {
        console.error("Fetch profile error:", err);
        const stored = localStorage.getItem("user");
        if (stored) {
          setUser(JSON.parse(stored));
        } else {
          setError("Failed to load profile data.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

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
            <h2 className="fw-bold mb-1 text-dark">My Profile</h2>
            <p className="text-secondary mb-0">
              View and verify your registered personal and contact details.
            </p>
          </div>

          {error && (
            <div className="alert alert-danger d-flex align-items-center mb-4">
              <i className="bi bi-exclamation-octagon-fill me-2 fs-5"></i>
              <div>{error}</div>
            </div>
          )}

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
              <p className="mt-2 text-muted small">Loading profile...</p>
            </div>
          ) : !user ? (
            <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
              <p className="text-muted mb-0">No profile data available.</p>
            </div>
          ) : (
            <div className="row g-4">
              {/* Profile Card */}
              <div className="col-lg-4">
                <div className="card border-0 shadow-sm rounded-4 p-4 text-center bg-white h-100">
                  <div
                    className="rounded-circle bg-primary bg-opacity-10 text-primary mx-auto mb-3 d-flex align-items-center justify-content-center"
                    style={{ width: "90px", height: "90px" }}
                  >
                    <i className="bi bi-person-fill" style={{ fontSize: "45px" }}></i>
                  </div>

                  <h4 className="fw-bold text-dark mb-1">{user.name}</h4>
                  <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3 py-1 mb-3 text-capitalize">
                    {user.role || "Customer"}
                  </span>

                  <p className="text-secondary small mb-4">
                    Member since {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "2026"}
                  </p>

                  <Link
                    to="/customer/edit-profile"
                    className="btn btn-outline-primary rounded-pill w-100 py-2 fw-semibold"
                  >
                    <i className="bi bi-pencil-square me-2"></i>
                    Edit Profile
                  </Link>
                </div>
              </div>

              {/* Details Column */}
              <div className="col-lg-8">
                <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white h-100">
                  <h5 className="fw-bold text-dark mb-4 pb-2 border-bottom">
                    Personal Information
                  </h5>

                  <div className="row g-4">
                    <div className="col-sm-6">
                      <span className="text-secondary small d-block mb-1">Full Name</span>
                      <strong className="text-dark fs-6">{user.name}</strong>
                    </div>

                    <div className="col-sm-6">
                      <span className="text-secondary small d-block mb-1">Email Address</span>
                      <strong className="text-dark fs-6">{user.email}</strong>
                    </div>

                    <div className="col-sm-6">
                      <span className="text-secondary small d-block mb-1">Phone Number</span>
                      <strong className="text-dark fs-6">{user.phone || "Not provided"}</strong>
                    </div>

                    <div className="col-sm-6">
                      <span className="text-secondary small d-block mb-1">Account Status</span>
                      <span className="badge bg-success rounded-pill px-3 py-2">
                        <i className="bi bi-check-circle me-1"></i> Active
                      </span>
                    </div>
                  </div>

                  <div className="alert alert-light border mt-4 mb-0 rounded-3 small text-secondary">
                    <i className="bi bi-shield-lock text-primary me-2"></i>
                    Your personal information is securely encrypted and used strictly for car service dispatching.
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Profile;