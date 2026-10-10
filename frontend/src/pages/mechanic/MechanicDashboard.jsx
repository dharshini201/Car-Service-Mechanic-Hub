import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import {
  getAssignedServices,
  getMechanicDashboard,
  updateServiceStatus,
  getPendingOffers,
  acceptOffer,
  rejectOffer,
} from "../../services/mechanicService";
import { useAuth } from "../../context/AuthContext";

function MechanicDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [assigned, setAssigned] = useState([]);
  const [pendingOffers, setPendingOffers] = useState([]);
  const [stats, setStats] = useState({
    totalAssignedServices: 0,
    pendingServices: 0,
    inServiceServices: 0,
    completedServices: 0,
    readyForPickupServices: 0,
    pendingOffers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Accept / Reject Offer State
  const [rejectModalBooking, setRejectModalBooking] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [processingOfferId, setProcessingOfferId] = useState(null);

  // Quick Status Update Modal State
  const [quickUpdateBooking, setQuickUpdateBooking] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [mechanicNotes, setMechanicNotes] = useState("");
  const [updating, setUpdating] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [statsRes, assignedRes, offersRes] = await Promise.all([
        getMechanicDashboard().catch((err) => {
          console.error("Dashboard stats error:", err);
          return null;
        }),
        getAssignedServices().catch((err) => {
          console.error("Assigned services error:", err);
          return null;
        }),
        getPendingOffers().catch((err) => {
          console.error("Pending offers error:", err);
          return null;
        }),
      ]);

      const bookingsList = assignedRes?.bookings || [];
      setAssigned(bookingsList);

      const offersList = offersRes?.offers || [];
      setPendingOffers(offersList);

      if (statsRes) {
        setStats({
          totalAssignedServices:
            statsRes.totalAssignedServices !== undefined
              ? statsRes.totalAssignedServices
              : bookingsList.length,
          pendingServices:
            statsRes.pendingServices !== undefined
              ? statsRes.pendingServices
              : bookingsList.filter((b) => b.status === "Pending").length,
          inServiceServices:
            statsRes.inServiceServices !== undefined
              ? statsRes.inServiceServices
              : bookingsList.filter((b) =>
                  ["In Service", "In Progress"].includes(b.status)
                ).length,
          completedServices:
            statsRes.completedServices !== undefined
              ? statsRes.completedServices
              : bookingsList.filter((b) => b.status === "Completed").length,
          readyForPickupServices:
            statsRes.readyForPickupServices !== undefined
              ? statsRes.readyForPickupServices
              : bookingsList.filter((b) => b.status === "Ready for Pickup").length,
          pendingOffers:
            statsRes.pendingOffers !== undefined
              ? statsRes.pendingOffers
              : offersList.length,
        });
      } else {
        // Fallback calculations
        setStats({
          totalAssignedServices: bookingsList.length,
          pendingServices: bookingsList.filter((b) => b.status === "Pending").length,
          inServiceServices: bookingsList.filter((b) =>
            ["In Service", "In Progress"].includes(b.status)
          ).length,
          completedServices: bookingsList.filter((b) => b.status === "Completed").length,
          readyForPickupServices: bookingsList.filter((b) => b.status === "Ready for Pickup").length,
          pendingOffers: offersList.length,
        });
      }
    } catch (err) {
      console.error("Mechanic dashboard error:", err);
      setError("Failed to fetch assigned service requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAcceptOffer = async (bookingId) => {
    try {
      setProcessingOfferId(bookingId);
      setError("");
      const res = await acceptOffer(bookingId);
      setSuccess(res?.message || "Job offer accepted successfully! Added to your active tasks.");
      setTimeout(() => setSuccess(""), 4500);
      await loadData();
    } catch (err) {
      console.error("Accept offer error:", err);
      setError(err?.response?.data?.message || err.message || "Failed to accept offer.");
    } finally {
      setProcessingOfferId(null);
    }
  };

  const handleOpenRejectModal = (booking) => {
    setRejectModalBooking(booking);
    setRejectReason("");
  };

  const handleConfirmReject = async (e) => {
    e.preventDefault();
    if (!rejectModalBooking) return;
    try {
      setProcessingOfferId(rejectModalBooking._id);
      setError("");
      const res = await rejectOffer(rejectModalBooking._id, rejectReason.trim());
      setSuccess(res?.message || "Job offer declined. Reassigned to the next available mechanic.");
      setTimeout(() => setSuccess(""), 4500);
      setRejectModalBooking(null);
      setRejectReason("");
      await loadData();
    } catch (err) {
      console.error("Reject offer error:", err);
      setError(err?.response?.data?.message || err.message || "Failed to decline offer.");
    } finally {
      setProcessingOfferId(null);
    }
  };

  const handleOpenQuickUpdate = (booking) => {
    setQuickUpdateBooking(booking);
    setNewStatus(booking.status || "Pending");
    setMechanicNotes(booking.mechanicNotes || "");
  };

  const handleSaveQuickUpdate = async (e) => {
    e.preventDefault();
    if (!quickUpdateBooking) return;

    try {
      setUpdating(true);
      setError("");

      const res = await updateServiceStatus(
        quickUpdateBooking._id || quickUpdateBooking.id,
        {
          status: newStatus,
          mechanicNotes: mechanicNotes.trim(),
        }
      );

      if (res.success) {
        setSuccess(
          `Service status updated to "${newStatus}". Customer has been notified.`
        );
        setTimeout(() => setSuccess(""), 4500);
        setQuickUpdateBooking(null);
        await loadData();
      }
    } catch (err) {
      console.error("Quick update status error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to update status. Please verify permissions."
      );
    } finally {
      setUpdating(false);
    }
  };

  const statusBadges = {
    Pending: "bg-warning text-dark",
    Confirmed: "bg-primary text-white",
    "In Service": "bg-info text-dark",
    "In Progress": "bg-info text-dark",
    Completed: "bg-success text-white",
    "Ready for Pickup": "bg-emerald text-white",
    Cancelled: "bg-danger text-white",
  };

  const filteredBookings = assigned.filter((b) => {
    const custName = b.customer?.name || "";
    const custEmail = b.customer?.email || "";
    const custPhone = b.customer?.phone || "";
    const vehNum = b.vehicle?.vehicleNumber || b.vehicleNumber || "";
    const vehModel = `${b.vehicle?.brand || ""} ${b.vehicle?.model || ""}`.trim();
    const serviceName = b.service?.name || b.serviceType || "";

    const matchesSearch =
      custName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      custEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      custPhone.includes(searchTerm) ||
      vehNum.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      serviceName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All"
        ? true
        : statusFilter === "In Service"
        ? ["In Service", "In Progress"].includes(b.status)
        : b.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-3 col-lg-2 px-0">
          <Sidebar role="mechanic" />
        </div>

        {/* Main Content */}
        <main className="col-md-9 col-lg-10 py-4 px-4 bg-light min-vh-100">
          {/* Header */}
          <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
            <div>
              <div className="d-flex align-items-center gap-2 mb-1">
                <span className="badge bg-primary-subtle text-primary border px-3 py-1 rounded-pill fw-semibold">
                  <i className="bi bi-tools me-1"></i> Technician Workspace
                </span>
                <span className="badge bg-success-subtle text-success border px-2 py-1 rounded-pill">
                  Live
                </span>
              </div>
              <h2 className="fw-bold mb-1 text-dark">Mechanic Dashboard</h2>
              <p className="text-secondary mb-0">
                Welcome, <strong>{user?.name || "Technician"}</strong>! Inspect assigned service jobs and update repair milestones.
              </p>
            </div>

            <div className="d-flex gap-2">
              <Link
                to="/mechanic/assigned-services"
                className="btn btn-outline-primary rounded-pill px-3 py-2 fw-semibold"
              >
                <i className="bi bi-list-check me-2"></i>
                Full Work Queue
              </Link>
              <Link
                to="/mechanic/profile"
                className="btn btn-primary rounded-pill px-4 py-2 fw-semibold shadow-sm"
              >
                <i className="bi bi-person-circle me-2"></i>
                My Profile
              </Link>
            </div>
          </div>

          {error && (
            <div className="alert alert-danger d-flex align-items-center mb-4 shadow-sm" role="alert">
              <i className="bi bi-exclamation-octagon-fill me-2 fs-5"></i>
              <div>{error}</div>
              <button
                type="button"
                className="btn-close ms-auto"
                onClick={() => setError("")}
              ></button>
            </div>
          )}

          {success && (
            <div className="alert alert-success d-flex align-items-center mb-4 shadow-sm" role="alert">
              <i className="bi bi-check-circle-fill me-2 fs-5"></i>
              <div>{success}</div>
              <button
                type="button"
                className="btn-close ms-auto"
                onClick={() => setSuccess("")}
              ></button>
            </div>
          )}

          {/* Requirement 3: PENDING ASSIGNMENT OFFERS SECTION */}
          {pendingOffers.length > 0 && (
            <div className="card border-0 shadow-sm rounded-4 mb-4 bg-white border-start border-4 border-warning">
              <div className="card-header bg-white border-0 py-3 px-4 d-flex flex-wrap justify-content-between align-items-center gap-2">
                <div className="d-flex align-items-center gap-2">
                  <span className="spinner-grow spinner-grow-sm text-warning" role="status"></span>
                  <h5 className="fw-bold text-dark mb-0">
                    New Assignment Offers ({pendingOffers.length})
                  </h5>
                  <span className="badge bg-warning text-dark px-2 py-1 rounded-pill fw-semibold">
                    Action Required
                  </span>
                </div>
                <small className="text-secondary">
                  Review booking information and accept to begin work or decline to offer to next mechanic
                </small>
              </div>

              <div className="card-body p-4 pt-1">
                <div className="row g-3">
                  {pendingOffers.map((offer) => {
                    const bookingRef = offer.bookingId || offer._id?.slice(-8);
                    const cust = offer.customer || {};
                    const veh = offer.vehicle || {};
                    const srv = offer.service || {};
                    const isProcessing = processingOfferId === offer._id;

                    return (
                      <div key={offer._id} className="col-12 col-lg-6">
                        <div className="border rounded-4 p-3 bg-light shadow-sm h-100 d-flex flex-column justify-content-between">
                          <div>
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <div>
                                <span className="badge bg-dark font-monospace mb-1">
                                  REF: #{bookingRef}
                                </span>
                                <h5 className="fw-bold text-primary mb-0">
                                  {srv.name || "Vehicle Service"}
                                </h5>
                              </div>
                              <span className="badge bg-success-subtle text-success border px-2 py-1 fs-6">
                                ₹{srv.price?.toLocaleString() || "0"}
                              </span>
                            </div>

                            <div className="row g-2 mb-3 small">
                              <div className="col-6">
                                <span className="text-muted d-block">Vehicle</span>
                                <strong className="text-dark">
                                  {veh.brand} {veh.model}
                                </strong>
                                <div className="text-secondary font-monospace">{veh.vehicleNumber}</div>
                              </div>
                              <div className="col-6">
                                <span className="text-muted d-block">Customer</span>
                                <strong className="text-dark">{cust.name || "Customer"}</strong>
                                <div className="text-secondary">{cust.phone || "N/A"}</div>
                              </div>
                              <div className="col-12">
                                <span className="text-muted d-block">Scheduled Slot</span>
                                <span className="text-dark">
                                  <i className="bi bi-calendar3 me-1 text-primary"></i>
                                  {offer.bookingDate ? new Date(offer.bookingDate).toLocaleDateString() : "Flexible"}
                                  {offer.bookingTime && ` at ${offer.bookingTime}`}
                                </span>
                              </div>
                              {offer.notes && (
                                <div className="col-12">
                                  <span className="text-muted d-block">Customer Service Notes:</span>
                                  <div className="p-2 bg-white rounded border text-secondary font-monospace small">
                                    {offer.notes}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="d-flex gap-2 pt-2 border-top">
                            <button
                              type="button"
                              className="btn btn-success flex-grow-1 rounded-pill fw-semibold shadow-sm d-flex align-items-center justify-content-center gap-2"
                              disabled={isProcessing}
                              onClick={() => handleAcceptOffer(offer._id)}
                            >
                              {isProcessing ? (
                                <span className="spinner-border spinner-border-sm" role="status"></span>
                              ) : (
                                <i className="bi bi-check-circle-fill"></i>
                              )}
                              Accept Offer
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline-danger flex-grow-1 rounded-pill fw-semibold d-flex align-items-center justify-content-center gap-2"
                              disabled={isProcessing}
                              onClick={() => handleOpenRejectModal(offer)}
                            >
                              <i className="bi bi-x-circle"></i>
                              Decline
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* 4 Dashboard Cards per Specification */}
          <div className="row g-3 mb-4">
            {/* 1. Total Assigned Services */}
            <div className="col-12 col-sm-6 col-xl-3">
              <Link
                to="/mechanic/assigned-services"
                className="text-decoration-none"
              >
                <div className="card border-0 shadow-sm rounded-4 p-3 h-100 bg-white hover-shadow transition-all">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <span className="text-secondary small fw-semibold text-uppercase d-block mb-1">
                        Assigned Services
                      </span>
                      <h3 className="fw-bold text-dark mb-0">
                        {stats.totalAssignedServices}
                      </h3>
                      <small className="text-primary fw-medium mt-1 d-inline-block">
                        View queue <i className="bi bi-arrow-right ms-1"></i>
                      </small>
                    </div>
                    <div
                      className="rounded-4 p-3 text-primary d-flex align-items-center justify-content-center"
                      style={{ backgroundColor: "rgba(37, 99, 235, 0.1)" }}
                    >
                      <i className="bi bi-tools fs-3"></i>
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            {/* 2. Pending Requests */}
            <div className="col-12 col-sm-6 col-xl-3">
              <Link
                to="/mechanic/service-requests?status=Pending"
                className="text-decoration-none"
              >
                <div className="card border-0 shadow-sm rounded-4 p-3 h-100 bg-white hover-shadow transition-all">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <span className="text-secondary small fw-semibold text-uppercase d-block mb-1">
                        Pending
                      </span>
                      <h3 className="fw-bold text-warning mb-0">
                        {stats.pendingServices}
                      </h3>
                      <small className="text-warning fw-medium mt-1 d-inline-block">
                        Review requests <i className="bi bi-arrow-right ms-1"></i>
                      </small>
                    </div>
                    <div
                      className="rounded-4 p-3 text-warning d-flex align-items-center justify-content-center"
                      style={{ backgroundColor: "rgba(245, 158, 11, 0.1)" }}
                    >
                      <i className="bi bi-hourglass-split fs-3"></i>
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            {/* 3. In Progress Services */}
            <div className="col-12 col-sm-6 col-xl-3">
              <Link
                to="/mechanic/service-requests?status=In Progress"
                className="text-decoration-none"
              >
                <div className="card border-0 shadow-sm rounded-4 p-3 h-100 bg-white hover-shadow transition-all">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <span className="text-secondary small fw-semibold text-uppercase d-block mb-1">
                        In Progress
                      </span>
                      <h3 className="fw-bold text-info mb-0">
                        {stats.inServiceServices}
                      </h3>
                      <small className="text-info fw-medium mt-1 d-inline-block">
                        Active repairs <i className="bi bi-arrow-right ms-1"></i>
                      </small>
                    </div>
                    <div
                      className="rounded-4 p-3 text-info d-flex align-items-center justify-content-center"
                      style={{ backgroundColor: "rgba(6, 182, 212, 0.1)" }}
                    >
                      <i className="bi bi-gear-wide-connected fs-3"></i>
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            {/* 4. Completed Services */}
            <div className="col-12 col-sm-6 col-xl-3">
              <Link
                to="/mechanic/service-history"
                className="text-decoration-none"
              >
                <div className="card border-0 shadow-sm rounded-4 p-3 h-100 bg-white hover-shadow transition-all">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <span className="text-secondary small fw-semibold text-uppercase d-block mb-1">
                        Completed
                      </span>
                      <h3 className="fw-bold text-success mb-0">
                        {stats.completedServices}
                      </h3>
                      <small className="text-success fw-medium mt-1 d-inline-block">
                        View history <i className="bi bi-arrow-right ms-1"></i>
                      </small>
                    </div>
                    <div
                      className="rounded-4 p-3 text-success d-flex align-items-center justify-content-center"
                      style={{ backgroundColor: "rgba(16, 185, 129, 0.1)" }}
                    >
                      <i className="bi bi-check2-circle fs-3"></i>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="card border-0 shadow-sm rounded-4 p-3 mb-4 bg-white">
            <div className="row g-2 align-items-center">
              <div className="col-md-7">
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0 text-muted">
                    <i className="bi bi-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control bg-light border-start-0 py-2"
                    placeholder="Search by customer, vehicle number, phone, or service type..."
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

              <div className="col-md-5 d-flex gap-2">
                <select
                  className="form-select bg-light py-2"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="All">All Statuses ({assigned.length})</option>
                  <option value="Pending">Pending ({stats.pendingServices})</option>
                  <option value="In Service">In Service ({stats.inServiceServices})</option>
                  <option value="Completed">Completed ({stats.completedServices})</option>
                  <option value="Ready for Pickup">Ready for Pickup ({stats.readyForPickupServices})</option>
                </select>

                <button
                  type="button"
                  className="btn btn-outline-secondary px-3"
                  onClick={loadData}
                  title="Refresh Queue"
                >
                  <i className="bi bi-arrow-clockwise"></i>
                </button>
              </div>
            </div>
          </div>

          {/* Comprehensive Assigned Services Table */}
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
            <div className="card-header bg-white border-0 py-3 px-4 d-flex justify-content-between align-items-center">
              <div>
                <h5 className="fw-bold text-dark mb-0">Assigned Services Queue</h5>
                <small className="text-secondary">
                  Showing {filteredBookings.length} of {assigned.length} assigned repair jobs
                </small>
              </div>
              <span className="badge bg-light text-dark border px-3 py-2 rounded-pill font-monospace small">
                Mechanic: {user?.name || "Assigned"}
              </span>
            </div>

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status"></div>
                <p className="mt-2 text-muted small">Loading repair queue...</p>
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-clipboard2-check text-muted" style={{ fontSize: "56px" }}></i>
                <h5 className="fw-bold mt-3 text-dark">No Service Bookings Found</h5>
                <p className="text-secondary small mb-0">
                  {searchTerm || statusFilter !== "All"
                    ? "Try clearing your search query or status filter."
                    : "You do not have any vehicle service tasks assigned to your queue at this moment."}
                </p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="py-3 px-4 text-secondary small fw-semibold">CUSTOMER</th>
                      <th className="py-3 text-secondary small fw-semibold">VEHICLE</th>
                      <th className="py-3 text-secondary small fw-semibold">SERVICE &amp; ISSUE</th>
                      <th className="py-3 text-secondary small fw-semibold">SCHEDULED DATE</th>
                      <th className="py-3 text-secondary small fw-semibold">SERVICE STATUS</th>
                      <th className="py-3 text-secondary small fw-semibold">ASSIGNED</th>
                      <th className="py-3 pe-4 text-secondary small fw-semibold text-end">ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map((b) => {
                      const id = b._id || b.id;
                      const bookingRef = b.bookingId || `BK-${id.slice(-6).toUpperCase()}`;
                      const vehicle = b.vehicle || {};
                      const customer = b.customer || {};
                      const service = b.service || {};
                      const status = b.status || b.serviceStatus || "Pending";

                      return (
                        <tr key={id}>
                          {/* Customer Name, Email, Phone */}
                          <td className="py-3 px-4">
                            <span className="fw-bold text-dark d-block">
                              {customer.name || "Customer"}
                            </span>
                            <small className="text-muted d-block">
                              <i className="bi bi-envelope me-1"></i>
                              {customer.email || "N/A"}
                            </small>
                            <small className="text-muted d-block">
                              <i className="bi bi-telephone me-1"></i>
                              {customer.phone || "N/A"}
                            </small>
                          </td>

                          {/* Vehicle Number, Brand/Model, Fuel/Type */}
                          <td className="py-3">
                            <strong className="text-dark d-block">
                              {vehicle.brand || "Vehicle"} {vehicle.model || ""}
                            </strong>
                            <span className="badge bg-dark bg-opacity-10 text-dark font-monospace px-2 py-1 rounded small">
                              {vehicle.vehicleNumber || b.vehicleNumber || "N/A"}
                            </span>
                            <div className="text-muted small mt-1">
                              Type: {vehicle.fuelType || "Automobile"}
                            </div>
                          </td>

                          {/* Service Type, Duration, Description/Problem */}
                          <td className="py-3" style={{ maxWidth: "260px" }}>
                            <strong className="text-primary d-block">
                              {service.name || b.serviceType || "Car Service"}
                            </strong>
                            <small className="text-muted d-block">
                              Duration: {service.duration || "1-2 Hours"}
                            </small>
                            {b.description && (
                              <div
                                className="text-secondary small mt-1 p-1 bg-light rounded text-truncate"
                                title={b.description}
                                style={{ maxWidth: "240px" }}
                              >
                                <i className="bi bi-chat-left-text me-1 text-muted"></i>
                                {b.description}
                              </div>
                            )}
                          </td>

                          {/* Booking Date & Time */}
                          <td className="py-3 text-secondary small">
                            <div className="fw-semibold text-dark">
                              <i className="bi bi-calendar3 me-1 text-primary"></i>
                              {b.bookingDate
                                ? new Date(b.bookingDate).toLocaleDateString()
                                : "N/A"}
                            </div>
                            <div className="text-muted">
                              <i className="bi bi-clock me-1"></i>
                              {b.bookingTime || "Anytime"}
                            </div>
                            <small className="text-muted font-monospace" style={{ fontSize: "11px" }}>
                              REF: #{bookingRef}
                            </small>
                          </td>

                          {/* Status */}
                          <td className="py-3">
                            <span
                              className={`badge px-3 py-2 rounded-pill shadow-sm ${
                                statusBadges[status] || "bg-primary"
                              }`}
                              style={{
                                backgroundColor:
                                  status === "Ready for Pickup" ? "#059669" : undefined,
                              }}
                            >
                              {status}
                            </span>
                            {b.mechanicNotes && (
                              <small
                                className="text-muted d-block mt-1 text-truncate"
                                style={{ maxWidth: "160px" }}
                                title={b.mechanicNotes}
                              >
                                Notes: {b.mechanicNotes}
                              </small>
                            )}
                          </td>

                          {/* Assigned Mechanic */}
                          <td className="py-3">
                            <span className="badge bg-light text-dark border px-2 py-1 rounded">
                              <i className="bi bi-person-gear me-1 text-info"></i>
                              {b.mechanic?.name || user?.name || "Assigned"}
                            </span>
                          </td>

                          {/* Action */}
                          <td className="py-3 pe-4 text-end">
                            <div className="d-flex gap-1 justify-content-end">
                              <Link
                                to={`/mechanic/request/${id}`}
                                className="btn btn-sm btn-outline-secondary rounded-pill px-3"
                                title="View Complete Details"
                              >
                                Details
                              </Link>
                              <button
                                type="button"
                                className="btn btn-sm btn-primary rounded-pill px-3 fw-semibold shadow-sm"
                                onClick={() => handleOpenQuickUpdate(b)}
                                title="Update Service Status"
                              >
                                <i className="bi bi-gear-wide me-1"></i> Status
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Quick Status Update Modal */}
          {quickUpdateBooking && (
            <div
              className="modal fade show d-block"
              style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
              tabIndex="-1"
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content rounded-4 border-0 shadow">
                  <div className="modal-header bg-dark text-white border-0 py-3">
                    <h5 className="modal-title fw-bold">
                      <i className="bi bi-wrench-adjustable me-2 text-warning"></i>
                      Update Service Milestone
                    </h5>
                    <button
                      type="button"
                      className="btn-close btn-close-white"
                      onClick={() => setQuickUpdateBooking(null)}
                    ></button>
                  </div>

                  <form onSubmit={handleSaveQuickUpdate}>
                    <div className="modal-body p-4">
                      {/* Summary Box */}
                      <div className="p-3 bg-light rounded-3 mb-3 border">
                        <div className="fw-bold text-dark">
                          {quickUpdateBooking.service?.name || quickUpdateBooking.serviceType}
                        </div>
                        <div className="text-secondary small mt-1">
                          Vehicle:{" "}
                          <strong>
                            {quickUpdateBooking.vehicle?.brand} {quickUpdateBooking.vehicle?.model}
                          </strong>{" "}
                          (
                          <span className="font-monospace text-primary">
                            {quickUpdateBooking.vehicle?.vehicleNumber || quickUpdateBooking.vehicleNumber}
                          </span>
                          )
                        </div>
                        <div className="text-secondary small">
                          Customer: <strong>{quickUpdateBooking.customer?.name}</strong> (
                          {quickUpdateBooking.customer?.phone})
                        </div>
                      </div>

                      {/* Status Selector */}
                      <div className="mb-3">
                        <label className="form-label fw-semibold text-dark small">
                          New Service Status <span className="text-danger">*</span>
                        </label>
                        <select
                          className="form-select py-2"
                          value={newStatus}
                          onChange={(e) => setNewStatus(e.target.value)}
                          required
                        >
                          <option value="Pending">1. Pending (Awaiting Inspection)</option>
                          <option value="Confirmed">2. Confirmed (Scheduled &amp; Approved)</option>
                          <option value="In Service">3. In Service (Active Work Underway)</option>
                          <option value="Completed">4. Completed (Service Finished)</option>
                          <option value="Ready for Pickup">5. Ready for Pickup (Customer Collect)</option>
                        </select>
                      </div>

                      {/* Ready for Pickup Alert */}
                      {newStatus === "Ready for Pickup" && (
                        <div className="alert alert-success py-2 px-3 small d-flex align-items-center mb-3">
                          <i className="bi bi-envelope-check-fill me-2 fs-5"></i>
                          <div>
                            Selecting <strong>"Ready for Pickup"</strong> will automatically send an email to the customer informing them their vehicle is ready for collection.
                          </div>
                        </div>
                      )}

                      {/* Technician Notes */}
                      <div className="mb-2">
                        <label className="form-label fw-semibold text-dark small">
                          Technician / Inspection Notes
                        </label>
                        <textarea
                          className="form-control"
                          rows="3"
                          placeholder="Describe diagnostic findings, parts replaced, or fluid levels..."
                          value={mechanicNotes}
                          onChange={(e) => setMechanicNotes(e.target.value)}
                        ></textarea>
                      </div>
                    </div>

                    <div className="modal-footer border-top-0 bg-light py-3">
                      <button
                        type="button"
                        className="btn btn-outline-secondary rounded-pill px-4"
                        onClick={() => setQuickUpdateBooking(null)}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary rounded-pill px-4 fw-semibold"
                        disabled={updating}
                      >
                        {updating ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Saving...
                          </>
                        ) : (
                          "Save & Notify"
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Decline / Reject Offer Confirmation Modal */}
          {rejectModalBooking && (
            <div
              className="modal fade show d-block"
              tabIndex="-1"
              style={{ backgroundColor: "rgba(15, 23, 42, 0.65)" }}
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
                  <div className="modal-header bg-danger text-white py-3">
                    <h5 className="modal-title fw-bold">
                      <i className="bi bi-x-octagon-fill me-2"></i>
                      Decline Assignment Offer
                    </h5>
                    <button
                      type="button"
                      className="btn-close btn-close-white"
                      onClick={() => setRejectModalBooking(null)}
                    ></button>
                  </div>

                  <form onSubmit={handleConfirmReject}>
                    <div className="modal-body p-4">
                      <p className="text-secondary mb-3">
                        Are you sure you want to decline this job offer? The booking will automatically be dispatched to the next least-loaded eligible mechanic.
                      </p>

                      <div className="p-3 bg-light rounded-3 mb-3 border">
                        <strong className="text-dark d-block">
                          {rejectModalBooking.service?.name || "Vehicle Service"}
                        </strong>
                        <div className="text-muted small mt-1">
                          Vehicle: {rejectModalBooking.vehicle?.brand} {rejectModalBooking.vehicle?.model} (
                          {rejectModalBooking.vehicle?.vehicleNumber})
                        </div>
                      </div>

                      <div className="mb-2">
                        <label className="form-label fw-semibold text-dark small">
                          Reason for Declining (Optional)
                        </label>
                        <textarea
                          className="form-control"
                          rows="3"
                          placeholder="e.g. Schedule conflict, bay at full capacity, equipment maintenance..."
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                        ></textarea>
                      </div>
                    </div>

                    <div className="modal-footer border-top-0 bg-light py-3">
                      <button
                        type="button"
                        className="btn btn-outline-secondary rounded-pill px-4"
                        onClick={() => setRejectModalBooking(null)}
                      >
                        Keep Offer
                      </button>
                      <button
                        type="submit"
                        className="btn btn-danger rounded-pill px-4 fw-semibold"
                        disabled={processingOfferId === rejectModalBooking._id}
                      >
                        {processingOfferId === rejectModalBooking._id ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Declining...
                          </>
                        ) : (
                          "Confirm Decline"
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

export default MechanicDashboard;