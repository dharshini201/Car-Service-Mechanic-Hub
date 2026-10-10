import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import {
  getMechanics,
  addMechanic,
  updateMechanic,
  deleteMechanic,
} from "../../services/mechanicService";
import { getBookings, updateBooking } from "../../services/bookingService";

function ManageMechanics() {
  const [mechanics, setMechanics] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Add / Edit Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedMechanicId, setSelectedMechanicId] = useState(null);

  // View Details & Workload Modal State
  const [detailsModalMech, setDetailsModalMech] = useState(null);

  // Assign to Booking Modal State
  const [assignModalMech, setAssignModalMech] = useState(null);
  const [selectedBookingToAssign, setSelectedBookingToAssign] = useState("");
  const [assigningLoading, setAssigningLoading] = useState(false);

  // Reassign Modal State
  const [reassignBooking, setReassignBooking] = useState(null);
  const [newReassignMechanicUser, setNewReassignMechanicUser] = useState("");
  const [reassigningLoading, setReassigningLoading] = useState(false);

  const initialForm = {
    name: "",
    email: "",
    phone: "",
    password: "",
    experience: 3,
    status: "Active",
  };

  const [formData, setFormData] = useState(initialForm);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError("");

      const [mechRes, bookingsRes] = await Promise.all([
        getMechanics(),
        getBookings().catch(() => ({ bookings: [] })),
      ]);

      const list = mechRes?.mechanics || mechRes?.data || (Array.isArray(mechRes) ? mechRes : []);
      setMechanics(list);

      const bList = bookingsRes?.bookings || bookingsRes?.data || (Array.isArray(bookingsRes) ? bookingsRes : []);
      setAllBookings(bList);
    } catch (err) {
      console.error("Fetch Data Error:", err);
      setError(err?.response?.data?.message || err.message || "Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleOpenAddModal = () => {
    setIsEditing(false);
    setSelectedMechanicId(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (mech) => {
    setIsEditing(true);
    setSelectedMechanicId(mech._id);
    const u = mech.user || {};
    setFormData({
      name: u.name || mech.name || "",
      email: u.email || mech.email || "",
      phone: mech.phone || u.phone || "",
      password: "", // blank if not changing
      experience: mech.experience || 0,
      status: mech.status || (u.isActive ? "Active" : "Inactive"),
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMechanicId(null);
    setFormData(initialForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError("");

      if (isEditing) {
        await updateMechanic(selectedMechanicId, {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          experience: Number(formData.experience),
          status: formData.status,
        });
        setSuccessMsg("Mechanic profile updated successfully!");
      } else {
        await addMechanic({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password || "mechanic123",
          experience: Number(formData.experience),
        });
        setSuccessMsg("New mechanic onboarded successfully!");
      }

      setTimeout(() => setSuccessMsg(""), 4000);
      handleCloseModal();
      await fetchAllData();
    } catch (err) {
      console.error("Save Mechanic Error:", err);
      setError(err?.response?.data?.message || err.message || "Failed to save mechanic.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove mechanic "${name}"?`)) return;

    try {
      setError("");
      await deleteMechanic(id);
      setSuccessMsg("Mechanic removed successfully.");
      setTimeout(() => setSuccessMsg(""), 4000);
      await fetchAllData();
    } catch (err) {
      console.error("Delete Mechanic Error:", err);
      setError(err?.response?.data?.message || err.message || "Failed to delete mechanic.");
    }
  };

  const handleToggleStatus = async (mech) => {
    try {
      setError("");
      const currentStatus = mech.status || (mech.user?.isActive ? "Active" : "Inactive");
      const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
      await updateMechanic(mech._id, { status: newStatus });
      setSuccessMsg(`Status updated to ${newStatus}.`);
      setTimeout(() => setSuccessMsg(""), 3000);
      await fetchAllData();
    } catch (err) {
      console.error("Toggle Status Error:", err);
      setError(err?.response?.data?.message || err.message || "Failed to update status.");
    }
  };

  // Assign Mechanic to a Selected Booking
  const handleAssignToBooking = async (e) => {
    e.preventDefault();
    if (!selectedBookingToAssign || !assignModalMech) return;

    try {
      setAssigningLoading(true);
      setError("");

      const mechUserId = assignModalMech.user?._id || assignModalMech.user || assignModalMech._id;

      await updateBooking(selectedBookingToAssign, {
        mechanic: mechUserId,
      });

      setSuccessMsg(
        `Mechanic ${assignModalMech.user?.name || "Technician"} assigned to booking successfully! Customer & mechanic notified.`
      );
      setTimeout(() => setSuccessMsg(""), 4500);

      setAssignModalMech(null);
      setSelectedBookingToAssign("");
      await fetchAllData();
    } catch (err) {
      console.error("Assign Mechanic Error:", err);
      setError(err?.response?.data?.message || "Failed to assign mechanic to booking.");
    } finally {
      setAssigningLoading(false);
    }
  };

  // Reassign Booking to a Different Mechanic
  const handleReassignBooking = async (e) => {
    e.preventDefault();
    if (!reassignBooking) return;

    try {
      setReassigningLoading(true);
      setError("");

      await updateBooking(reassignBooking._id, {
        mechanic: newReassignMechanicUser || null,
      });

      setSuccessMsg("Booking assignment updated successfully.");
      setTimeout(() => setSuccessMsg(""), 4000);

      setReassignBooking(null);
      setNewReassignMechanicUser("");
      await fetchAllData();
    } catch (err) {
      console.error("Reassign Error:", err);
      setError(err?.response?.data?.message || "Failed to update assignment.");
    } finally {
      setReassigningLoading(false);
    }
  };

  const filteredMechanics = mechanics.filter((m) => {
    const name = m.user?.name || m.name || "";
    const email = m.user?.email || m.email || "";
    const q = searchTerm.toLowerCase();
    return (
      name.toLowerCase().includes(q) ||
      email.toLowerCase().includes(q)
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
                  Workforce &amp; Service Dispatch
                </span>
                <h2 className="fw-bold mb-1" style={{ color: "#0f172a" }}>
                  Mechanic Management
                </h2>
                <p className="text-muted mb-0">
                  Onboard mechanics, inspect active workload, view assigned repair jobs, and dispatch bookings.
                </p>
              </div>

              <div className="d-flex gap-2">
                <button
                  type="button"
                  className="btn btn-danger d-flex align-items-center gap-2 rounded-pill px-4 shadow-sm"
                  onClick={handleOpenAddModal}
                >
                  <i className="bi bi-person-plus-fill"></i> Add New Mechanic
                </button>
                <Link to="/admin/bookings" className="btn btn-outline-dark rounded-pill px-4">
                  <i className="bi bi-journal-text me-1"></i> Manage Bookings
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
              <div className="col-md-3">
                <div className="card border-0 shadow-sm p-3 bg-white rounded-3">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <small className="text-muted text-uppercase fw-semibold">Total Mechanics</small>
                      <h3 className="fw-bold mb-0 text-dark mt-1">{mechanics.length}</h3>
                    </div>
                    <div className="p-3 bg-danger-subtle text-danger rounded-circle">
                      <i className="bi bi-people-fill fs-4"></i>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-3">
                <div className="card border-0 shadow-sm p-3 bg-white rounded-3">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <small className="text-muted text-uppercase fw-semibold">Active &amp; Available</small>
                      <h3 className="fw-bold mb-0 text-success mt-1">
                        {
                          mechanics.filter(
                            (m) =>
                              (m.status === "Active" || m.user?.isActive) &&
                              m.isAvailable !== false
                          ).length
                        }
                      </h3>
                    </div>
                    <div className="p-3 bg-success-subtle text-success rounded-circle">
                      <i className="bi bi-check-circle-fill fs-4"></i>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-3">
                <div className="card border-0 shadow-sm p-3 bg-white rounded-3">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <small className="text-muted text-uppercase fw-semibold">Active Workload</small>
                      <h3 className="fw-bold mb-0 text-primary mt-1">
                        {mechanics.reduce((acc, m) => acc + (m.activeWorkload || 0), 0)} Jobs
                      </h3>
                    </div>
                    <div className="p-3 bg-primary-subtle text-primary rounded-circle">
                      <i className="bi bi-tools fs-4"></i>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-3">
                <div className="card border-0 shadow-sm p-3 bg-white rounded-3">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <small className="text-muted text-uppercase fw-semibold">Total Completed</small>
                      <h3 className="fw-bold mb-0 text-dark mt-1">
                        {mechanics.reduce((acc, m) => acc + (m.completedJobs || 0), 0)} Jobs
                      </h3>
                    </div>
                    <div className="p-3 bg-warning-subtle text-warning rounded-circle">
                      <i className="bi bi-award fs-4"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body p-3">
                <div className="input-group">
                  <span className="input-group-text bg-white border-end-0 text-muted">
                    <i className="bi bi-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control border-start-0"
                    placeholder="Search by mechanic name or email..."
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

            {/* Mechanics Table with Workload & Actions */}
            {loading ? (
              <div className="card border-0 shadow-sm text-center py-5">
                <div className="spinner-border text-danger mx-auto mb-3" role="status"></div>
                <p className="text-muted mb-0">Loading mechanic team...</p>
              </div>
            ) : filteredMechanics.length === 0 ? (
              <div className="card border-0 shadow-sm text-center py-5">
                <i className="bi bi-person-x text-muted" style={{ fontSize: "64px" }}></i>
                <h5 className="fw-bold mt-3">No Mechanics Found</h5>
                <p className="text-muted">Click "Add New Mechanic" to onboard your first technician.</p>
              </div>
            ) : (
              <div className="card border-0 shadow-sm">
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-dark">
                      <tr>
                        <th style={{ width: "50px" }}>#</th>
                        <th>Technician</th>
                        <th>Contact</th>
                        <th>Experience</th>
                        <th>Workload</th>
                        <th>Availability</th>
                        <th>Status</th>
                        <th className="text-end" style={{ minWidth: "180px" }}>
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMechanics.map((mech, idx) => {
                        const u = mech.user || {};
                        const name = u.name || mech.name || "Technician";
                        const email = u.email || mech.email || "N/A";
                        const phone = mech.phone || u.phone || "N/A";
                        const isActive = mech.status === "Active" || u.isActive;
                        const workload = mech.activeWorkload || 0;

                        return (
                          <tr key={mech._id || idx}>
                            <td className="text-muted fw-semibold">{idx + 1}</td>

                            {/* Name */}
                            <td>
                              <div className="d-flex align-items-center gap-2">
                                <div
                                  className="rounded-circle bg-danger text-white d-flex align-items-center justify-content-center fw-bold shadow-sm"
                                  style={{ width: "40px", height: "40px", fontSize: "15px" }}
                                >
                                  {name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <div className="fw-bold text-dark">{name}</div>
                                  <small className="text-muted font-monospace">
                                    ID: {mech._id?.slice(-6)}
                                  </small>
                                </div>
                              </div>
                            </td>

                            {/* Contact */}
                            <td>
                              <div>
                                <i className="bi bi-envelope me-1 text-muted"></i>
                                {email}
                              </div>
                              <small className="text-muted">
                                <i className="bi bi-telephone me-1"></i>
                                {phone}
                              </small>
                            </td>

                            {/* Experience */}
                            <td>
                              <span className="badge bg-secondary-subtle text-dark border px-2 py-1">
                                {mech.experience || 0} Years Exp
                              </span>
                            </td>

                            {/* Workload per Requirement 2 */}
                            <td>
                              <span
                                className={`badge px-3 py-1 rounded-pill ${
                                  workload === 0
                                    ? "bg-secondary-subtle text-secondary"
                                    : workload <= 2
                                    ? "bg-success text-white"
                                    : workload <= 5
                                    ? "bg-warning text-dark"
                                    : "bg-danger text-white"
                                }`}
                              >
                                <i className="bi bi-tools me-1"></i>
                                {workload} Active {workload === 1 ? "Job" : "Jobs"}
                              </span>
                              {mech.completedJobs > 0 && (
                                <small className="text-muted d-block mt-1">
                                  {mech.completedJobs} Completed
                                </small>
                              )}
                            </td>

                            {/* Availability */}
                            <td>
                              {mech.isAvailable !== false ? (
                                <span className="badge bg-success-subtle text-success">
                                  <i className="bi bi-circle-fill me-1" style={{ fontSize: "8px" }}></i>
                                  Available
                                </span>
                              ) : (
                                <span className="badge bg-secondary-subtle text-secondary">
                                  <i className="bi bi-circle-fill me-1" style={{ fontSize: "8px" }}></i>
                                  Busy / Off
                                </span>
                              )}
                            </td>

                            {/* Status */}
                            <td>
                              <button
                                type="button"
                                className={`btn btn-sm ${
                                  isActive ? "btn-outline-success" : "btn-outline-secondary"
                                }`}
                                onClick={() => handleToggleStatus(mech)}
                                title="Click to toggle active status"
                              >
                                {isActive ? "Active" : "Inactive"}
                              </button>
                            </td>

                            {/* Actions per Requirement 2 */}
                            <td className="text-end">
                              <div className="d-flex justify-content-end gap-1">
                                {/* View Details & Workload */}
                                <button
                                  type="button"
                                  className="btn btn-outline-info btn-sm"
                                  title="View Details & Workload"
                                  onClick={() => setDetailsModalMech(mech)}
                                >
                                  <i className="bi bi-eye"></i>
                                </button>

                                {/* Assign to Booking */}
                                <button
                                  type="button"
                                  className="btn btn-outline-success btn-sm"
                                  title="Assign to Customer Booking"
                                  onClick={() => {
                                    setAssignModalMech(mech);
                                    setSelectedBookingToAssign("");
                                  }}
                                >
                                  <i className="bi bi-person-plus"></i>
                                </button>

                                {/* Edit */}
                                <button
                                  type="button"
                                  className="btn btn-outline-primary btn-sm"
                                  title="Edit Mechanic"
                                  onClick={() => handleOpenEditModal(mech)}
                                >
                                  <i className="bi bi-pencil"></i>
                                </button>

                                {/* Delete */}
                                <button
                                  type="button"
                                  className="btn btn-outline-danger btn-sm"
                                  title="Remove Mechanic"
                                  onClick={() => handleDelete(mech._id, name)}
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              </div>
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

      {/* ================= VIEW DETAILS & WORKLOAD MODAL ================= */}
      {detailsModalMech && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="modal-header bg-dark text-white py-3">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-person-badge-fill me-2 text-danger"></i>
                  Mechanic Profile &amp; Assigned Services
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setDetailsModalMech(null)}
                ></button>
              </div>

              <div className="modal-body p-4">
                {/* Mechanic Bio Header */}
                <div className="card bg-light border-0 p-3 mb-4 rounded-3">
                  <div className="d-flex align-items-center gap-3">
                    <div
                      className="rounded-circle bg-danger text-white d-flex align-items-center justify-content-center fw-bold fs-4"
                      style={{ width: "60px", height: "60px" }}
                    >
                      {(detailsModalMech.user?.name || detailsModalMech.name || "M")
                        .charAt(0)
                        .toUpperCase()}
                    </div>
                    <div className="flex-grow-1">
                      <h4 className="fw-bold mb-1 text-dark">
                        {detailsModalMech.user?.name || detailsModalMech.name}
                      </h4>
                      <div className="text-secondary small">
                        <i className="bi bi-envelope me-1"></i> {detailsModalMech.user?.email || "N/A"} &nbsp;|&nbsp;
                        <i className="bi bi-telephone me-1"></i> {detailsModalMech.phone || detailsModalMech.user?.phone || "N/A"}
                      </div>
                      <div className="mt-2">
                        <span className="badge bg-secondary me-2">
                          {detailsModalMech.experience || 0} Years Experience
                        </span>
                        <span
                          className={`badge ${
                            detailsModalMech.isAvailable !== false ? "bg-success" : "bg-warning text-dark"
                          }`}
                        >
                          {detailsModalMech.isAvailable !== false ? "Available" : "Busy"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Workload Stats Row */}
                <div className="row g-2 mb-4 text-center">
                  <div className="col-4">
                    <div className="p-3 bg-primary bg-opacity-10 rounded-3">
                      <small className="text-secondary d-block">ACTIVE WORKLOAD</small>
                      <strong className="text-primary fs-4">
                        {detailsModalMech.activeWorkload || 0} Jobs
                      </strong>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="p-3 bg-success bg-opacity-10 rounded-3">
                      <small className="text-secondary d-block">COMPLETED REPAIRS</small>
                      <strong className="text-success fs-4">
                        {detailsModalMech.completedJobs || 0} Jobs
                      </strong>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="p-3 bg-info bg-opacity-10 rounded-3">
                      <small className="text-secondary d-block">TOTAL ASSIGNED</small>
                      <strong className="text-info fs-4">
                        {(detailsModalMech.assignedBookings || []).length} Jobs
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Assigned Services List per Requirement 2 */}
                <h6 className="fw-bold text-dark mb-3">
                  <i className="bi bi-list-task me-2 text-primary"></i>
                  Assigned Services for this Technician
                </h6>

                {(!detailsModalMech.assignedBookings || detailsModalMech.assignedBookings.length === 0) ? (
                  <div className="text-center py-4 bg-light rounded-3">
                    <p className="text-muted mb-0">No services currently assigned to this mechanic.</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-sm table-hover align-middle mb-0">
                      <thead className="table-light small">
                        <tr>
                          <th>Service</th>
                          <th>Vehicle</th>
                          <th>Customer</th>
                          <th>Status</th>
                          <th className="text-end">Reassign</th>
                        </tr>
                      </thead>
                      <tbody>
                        {detailsModalMech.assignedBookings.map((b) => (
                          <tr key={b._id}>
                            <td>
                              <strong className="text-dark small d-block">{b.service?.name || "Service"}</strong>
                              <small className="text-muted font-monospace" style={{ fontSize: "10px" }}>
                                {b.bookingId || b._id?.slice(-6)}
                              </small>
                            </td>
                            <td>
                              <span className="small text-dark">
                                {b.vehicle?.brand} {b.vehicle?.model}
                              </span>
                              <small className="text-muted d-block font-monospace" style={{ fontSize: "10px" }}>
                                {b.vehicle?.vehicleNumber}
                              </small>
                            </td>
                            <td className="small">
                              {b.customer?.name}
                              <small className="text-muted d-block">{b.customer?.phone}</small>
                            </td>
                            <td>
                              <span
                                className={`badge px-2 py-1 rounded-pill ${
                                  b.status === "Completed"
                                    ? "bg-success"
                                    : b.status === "Ready for Pickup"
                                    ? "bg-emerald text-white"
                                    : b.status === "In Service" || b.status === "In Progress"
                                    ? "bg-info text-dark"
                                    : "bg-warning text-dark"
                                }`}
                                style={{
                                  fontSize: "10px",
                                  backgroundColor: b.status === "Ready for Pickup" ? "#059669" : undefined,
                                }}
                              >
                                {b.status}
                              </span>
                            </td>
                            <td className="text-end">
                              <button
                                type="button"
                                className="btn btn-outline-secondary btn-sm py-0 px-2"
                                style={{ fontSize: "11px" }}
                                onClick={() => {
                                  setReassignBooking(b);
                                  setNewReassignMechanicUser(detailsModalMech.user?._id || "");
                                }}
                              >
                                Change
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="modal-footer bg-light py-2">
                <button
                  type="button"
                  className="btn btn-secondary rounded-pill px-4"
                  onClick={() => setDetailsModalMech(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= ASSIGN MECHANIC TO BOOKING MODAL ================= */}
      {assignModalMech && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="modal-header bg-dark text-white py-3">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-person-check-fill me-2 text-success"></i>
                  Assign Booking to {assignModalMech.user?.name || "Mechanic"}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setAssignModalMech(null)}
                ></button>
              </div>

              <form onSubmit={handleAssignToBooking}>
                <div className="modal-body p-4">
                  <p className="text-muted small">
                    Select any customer booking to assign to{" "}
                    <strong>{assignModalMech.user?.name}</strong>. The mechanic and customer will both be notified automatically.
                  </p>

                  <div className="mb-3">
                    <label className="form-label fw-semibold text-dark small">
                      Select Customer Booking <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select py-2"
                      value={selectedBookingToAssign}
                      onChange={(e) => setSelectedBookingToAssign(e.target.value)}
                      required
                    >
                      <option value="">-- Choose a booking to assign --</option>
                      {allBookings
                        .filter((b) => b.status !== "Cancelled" && b.status !== "Completed")
                        .map((b) => (
                          <option key={b._id} value={b._id}>
                            {b.bookingId || b._id.slice(-6)}: {b.customer?.name || "Customer"} —{" "}
                            {b.service?.name || "Service"} ({b.vehicle?.brand} {b.vehicle?.vehicleNumber}) [
                            Current: {b.mechanic?.name ? `Assigned to ${b.mechanic.name}` : "Unassigned"}]
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                <div className="modal-footer bg-light py-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary rounded-pill px-4"
                    onClick={() => setAssignModalMech(null)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-success rounded-pill px-4 fw-semibold"
                    disabled={assigningLoading || !selectedBookingToAssign}
                  >
                    {assigningLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Assigning...
                      </>
                    ) : (
                      "Confirm Assignment"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ================= REASSIGN MECHANIC MODAL ================= */}
      {reassignBooking && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="modal-header bg-dark text-white py-3">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-arrow-left-right me-2 text-warning"></i>
                  Change Mechanic Assignment
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setReassignBooking(null)}
                ></button>
              </div>

              <form onSubmit={handleReassignBooking}>
                <div className="modal-body p-4">
                  <div className="p-3 bg-light rounded-3 mb-3 border">
                    <strong className="text-dark d-block">
                      {reassignBooking.service?.name || "Service"}
                    </strong>
                    <small className="text-muted">
                      Customer: {reassignBooking.customer?.name} ({reassignBooking.customer?.phone})
                    </small>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold text-dark small">
                      Select New Mechanic
                    </label>
                    <select
                      className="form-select py-2"
                      value={newReassignMechanicUser}
                      onChange={(e) => setNewReassignMechanicUser(e.target.value)}
                    >
                      <option value="">-- Remove Mechanic / Unassigned --</option>
                      {mechanics.map((m) => {
                        const uId = m.user?._id || m.user || m._id;
                        const name = m.user?.name || m.name;
                        return (
                          <option key={uId} value={uId}>
                            {name} ({m.activeWorkload || 0} active jobs)
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>

                <div className="modal-footer bg-light py-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary rounded-pill px-4"
                    onClick={() => setReassignBooking(null)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary rounded-pill px-4 fw-semibold"
                    disabled={reassigningLoading}
                  >
                    {reassigningLoading ? "Saving..." : "Update Assignment"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ================= ADD / EDIT MECHANIC MODAL ================= */}
      {isModalOpen && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-3">
              <form onSubmit={handleSubmit}>
                <div className="modal-header bg-dark text-white">
                  <h5 className="modal-title fw-bold">
                    <i className="bi bi-tools me-2 text-danger"></i>
                    {isEditing ? "Edit Mechanic Profile" : "Add New Mechanic"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={handleCloseModal}
                  ></button>
                </div>

                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Full Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Email Address *</label>
                    <input
                      type="email"
                      className="form-control"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Phone Number *</label>
                    <input
                      type="tel"
                      className="form-control"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>

                  {!isEditing && (
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Password *</label>
                      <input
                        type="password"
                        className="form-control"
                        placeholder="Min 6 characters"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                        minLength={6}
                      />
                    </div>
                  )}

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Experience (Years)</label>
                    <input
                      type="number"
                      className="form-control"
                      min="0"
                      value={formData.experience}
                      onChange={(e) =>
                        setFormData({ ...formData, experience: e.target.value })
                      }
                    />
                  </div>

                  {isEditing && (
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Status</label>
                      <select
                        className="form-select"
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  )}
                </div>

                <div className="modal-footer bg-light">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={handleCloseModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-danger px-4"
                    disabled={submitting}
                  >
                    {submitting ? "Saving..." : isEditing ? "Save Changes" : "Create Mechanic"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageMechanics;