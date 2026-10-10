import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { getAllUsers, deleteUser } from "../../services/userService";

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUserList = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getAllUsers();
      const list = res?.users || res?.data || (Array.isArray(res) ? res : []);
      setUsers(list);
    } catch (err) {
      console.error("Fetch Users Error:", err);
      setError(err?.response?.data?.message || err.message || "Failed to load customer users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserList();
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete customer account for "${name}"?`)) return;

    try {
      setError("");
      await deleteUser(id);
      setSuccessMsg(`User "${name}" deleted successfully.`);
      setTimeout(() => setSuccessMsg(""), 4000);
      await fetchUserList();
    } catch (err) {
      console.error("Delete User Error:", err);
      setError(err?.response?.data?.message || err.message || "Failed to delete user.");
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = searchTerm.toLowerCase();
    return (
      (u.name || "").toLowerCase().includes(q) ||
      (u.email || "").toLowerCase().includes(q) ||
      (u.phone || "").toLowerCase().includes(q)
    );
  });

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8f9fc" }}>
      <div className="d-flex" style={{ minHeight: "100vh" }}>
        {/* Sidebar */}
        <aside
          style={{
            width: "280px",
            minWidth: "280px",
            backgroundColor: "#1e293b",
            position: "sticky",
            top: 0,
            height: "100vh",
            overflowY: "auto",
          }}
        >
          <Sidebar role="admin" />
        </aside>

        {/* Main Content */}
        <main className="flex-grow-1 p-4" style={{ minWidth: 0 }}>
          <div style={{ maxWidth: "1600px", margin: "0 auto" }}>
            {/* Header */}
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
              <div>
                <span className="badge bg-danger-subtle text-danger px-3 py-1 mb-1 fw-semibold">
                  Customer Directory
                </span>
                <h2 className="fw-bold mb-1" style={{ color: "#0f172a" }}>
                  Manage Users
                </h2>
                <p className="text-muted mb-0">
                  View and manage registered customers, their contact profiles, and account standing.
                </p>
              </div>

              <div className="d-flex gap-2">
                <button
                  className="btn btn-outline-secondary d-flex align-items-center gap-2"
                  onClick={fetchUserList}
                >
                  <i className="bi bi-arrow-clockwise"></i> Refresh
                </button>
                <Link to="/admin/dashboard" className="btn btn-outline-dark">
                  <i className="bi bi-arrow-left me-1"></i> Dashboard
                </Link>
              </div>
            </div>

            {/* Alerts */}
            {error && (
              <div className="alert alert-danger alert-dismissible fade show shadow-sm" role="alert">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                {error}
                <button type="button" className="btn-close" onClick={() => setError("")}></button>
              </div>
            )}

            {successMsg && (
              <div className="alert alert-success alert-dismissible fade show shadow-sm" role="alert">
                <i className="bi bi-check-circle-fill me-2"></i>
                {successMsg}
                <button type="button" className="btn-close" onClick={() => setSuccessMsg("")}></button>
              </div>
            )}

            {/* Statistics */}
            <div className="row g-3 mb-4">
              <div className="col-md-4">
                <div className="card border-0 shadow-sm p-3 bg-white rounded-3">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <small className="text-muted text-uppercase fw-semibold">Total Customers</small>
                      <h3 className="fw-bold mb-0 text-dark mt-1">{users.length}</h3>
                    </div>
                    <div className="p-3 bg-primary-subtle text-primary rounded-circle">
                      <i className="bi bi-people-fill fs-4"></i>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card border-0 shadow-sm p-3 bg-white rounded-3">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <small className="text-muted text-uppercase fw-semibold">Active Accounts</small>
                      <h3 className="fw-bold mb-0 text-success mt-1">
                        {users.filter((u) => u.isActive !== false).length}
                      </h3>
                    </div>
                    <div className="p-3 bg-success-subtle text-success rounded-circle">
                      <i className="bi bi-person-check-fill fs-4"></i>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card border-0 shadow-sm p-3 bg-white rounded-3">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <small className="text-muted text-uppercase fw-semibold">Verified Phones</small>
                      <h3 className="fw-bold mb-0 text-info mt-1">
                        {users.filter((u) => Boolean(u.phone)).length}
                      </h3>
                    </div>
                    <div className="p-3 bg-info-subtle text-info rounded-circle">
                      <i className="bi bi-telephone-fill fs-4"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Search */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body p-3">
                <div className="input-group">
                  <span className="input-group-text bg-white border-end-0 text-muted">
                    <i className="bi bi-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control border-start-0"
                    placeholder="Search by customer name, email, or phone number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <button
                      className="btn btn-outline-secondary border-start-0"
                      onClick={() => setSearchTerm("")}
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Table */}
            {loading ? (
              <div className="card border-0 shadow-sm text-center py-5">
                <div className="spinner-border text-danger mx-auto mb-3" role="status"></div>
                <p className="text-muted mb-0">Loading customer directory...</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="card border-0 shadow-sm text-center py-5">
                <i className="bi bi-people text-muted" style={{ fontSize: "64px" }}></i>
                <h5 className="fw-bold mt-3">No Customers Found</h5>
                <p className="text-muted">No customer accounts match your search filter.</p>
              </div>
            ) : (
              <div className="card border-0 shadow-sm">
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-dark">
                      <tr>
                        <th style={{ width: "60px" }}>#</th>
                        <th>Customer</th>
                        <th>Contact</th>
                        <th>Role</th>
                        <th>Registered Date</th>
                        <th>Status</th>
                        <th className="text-end" style={{ minWidth: "100px" }}>
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user, idx) => {
                        const isActive = user.isActive !== false;
                        return (
                          <tr key={user._id || idx}>
                            <td className="text-muted fw-semibold">{idx + 1}</td>

                            {/* Name */}
                            <td>
                              <div className="d-flex align-items-center gap-2">
                                <div
                                  className="bg-danger text-white rounded-circle d-flex align-items-center justify-content-center fw-bold"
                                  style={{ width: "38px", height: "38px" }}
                                >
                                  {(user.name || "C").charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <div className="fw-bold text-dark">{user.name}</div>
                                  <small className="text-muted">ID: {user._id?.slice(-6)}</small>
                                </div>
                              </div>
                            </td>

                            {/* Contact */}
                            <td>
                              <div>
                                <i className="bi bi-envelope me-1 text-muted"></i>
                                {user.email}
                              </div>
                              {user.phone ? (
                                <small className="text-muted">
                                  <i className="bi bi-telephone me-1"></i>
                                  {user.phone}
                                </small>
                              ) : (
                                <small className="text-muted fst-italic">No phone listed</small>
                              )}
                            </td>

                            {/* Role */}
                            <td>
                              <span className="badge bg-secondary-subtle text-secondary border text-capitalize">
                                {user.role || "customer"}
                              </span>
                            </td>

                            {/* Date */}
                            <td>
                              <small className="text-muted">
                                {user.createdAt
                                  ? new Date(user.createdAt).toLocaleDateString()
                                  : "N/A"}
                              </small>
                            </td>

                            {/* Status */}
                            <td>
                              <span
                                className={`badge ${
                                  isActive ? "bg-success-subtle text-success" : "bg-danger-subtle text-danger"
                                }`}
                              >
                                {isActive ? "Active" : "Inactive"}
                              </span>
                            </td>

                            {/* Action */}
                            <td className="text-end">
                              <button
                                className="btn btn-sm btn-outline-danger"
                                title="Delete Customer Account"
                                onClick={() => handleDelete(user._id, user.name)}
                              >
                                <i className="bi bi-trash me-1"></i> Delete
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default ManageUsers;