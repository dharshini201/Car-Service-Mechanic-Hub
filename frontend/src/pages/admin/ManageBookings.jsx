import React, { useEffect, useState, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import {
  getBookings,
  getBookingById,
  createBooking,
  updateBooking,
  cancelBooking,
  deleteBooking,
  reassignBookingAdmin,
} from "../../services/bookingService";
import { getMechanics } from "../../services/mechanicService";
import { getAllUsers } from "../../services/userService";
import { getAllVehiclesAdmin } from "../../services/vehicleService";
import { getServices } from "../../services/serviceService";

function ManageBookings() {
  const { bookingId: routeBookingId } = useParams();

  const [bookings, setBookings] = useState([]);
  const [mechanics, setMechanics] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [services, setServices] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  // Modals state
  const [viewingBooking, setViewingBooking] = useState(null);
  const [viewingLoading, setViewingLoading] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [assigningBookingId, setAssigningBookingId] = useState(null);
  const [selectedMechanicUser, setSelectedMechanicUser] = useState("");
  const [assignLoading, setAssignLoading] = useState(false);
  const [autoReassigningId, setAutoReassigningId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Form state for Create Booking
  const [createForm, setCreateForm] = useState({
    customer: "",
    vehicle: "",
    service: "",
    bookingDate: new Date().toISOString().split("T")[0],
    bookingTime: "09:00 AM",
    serviceType: "Workshop",
    mechanic: "",
    description: "",
  });

  // Form state for Edit Booking
  const [editForm, setEditForm] = useState({
    service: "",
    bookingDate: "",
    bookingTime: "",
    status: "Pending",
    mechanic: "",
    description: "",
  });

  // ================= DATA FETCHING =================
  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [bookingsRes, mechanicsRes, usersRes, vehiclesRes, servicesRes] =
        await Promise.all([
          getBookings(),
          getMechanics().catch(() => ({ mechanics: [] })),
          getAllUsers().catch(() => ({ users: [] })),
          getAllVehiclesAdmin().catch(() => ({ vehicles: [] })),
          getServices().catch(() => ({ services: [] })),
        ]);

      const bookingList =
        bookingsRes?.bookings ||
        bookingsRes?.data ||
        (Array.isArray(bookingsRes) ? bookingsRes : []);
      setBookings(bookingList);

      const mechList =
        mechanicsRes?.mechanics ||
        mechanicsRes?.data ||
        (Array.isArray(mechanicsRes) ? mechanicsRes : []);
      setMechanics(mechList);

      const userList =
        usersRes?.users ||
        usersRes?.data ||
        (Array.isArray(usersRes) ? usersRes : []);
      setCustomers(userList.filter((u) => u.role === "customer"));

      const vehList =
        vehiclesRes?.vehicles ||
        vehiclesRes?.data ||
        (Array.isArray(vehiclesRes) ? vehiclesRes : []);
      setVehicles(vehList);

      const srvList =
        servicesRes?.services ||
        servicesRes?.data ||
        (Array.isArray(servicesRes) ? servicesRes : []);
      setServices(srvList);

      // If route has a bookingId (e.g. /admin/bookings/:bookingId), open it directly in Details Modal
      if (routeBookingId) {
        const found = bookingList.find((b) => b._id === routeBookingId);
        if (found) {
          setViewingBooking(found);
        } else {
          // Fetch single from API
          try {
            const singleRes = await getBookingById(routeBookingId);
            if (singleRes?.booking) setViewingBooking(singleRes.booking);
          } catch (_) {}
        }
      }
    } catch (err) {
      console.error("Admin Bookings Fetch Error:", err);
      const errMsg =
        err?.response?.data?.message || err?.message || "Failed to load bookings.";
      setError(typeof errMsg === "string" ? errMsg : JSON.stringify(errMsg));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [routeBookingId]);

  // Filtered vehicles for Create Modal based on selected customer
  const customerVehicles = useMemo(() => {
    if (!createForm.customer) return vehicles;
    return vehicles.filter(
      (v) =>
        (v.user?._id || v.user)?.toString() === createForm.customer.toString()
    );
  }, [vehicles, createForm.customer]);

  // ================= ACTIONS =================

  // 1. Quick Status Change
  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      setError("");
      await updateBooking(bookingId, { status: newStatus });
      setSuccessMsg(`Booking status updated to "${newStatus}".`);
      setTimeout(() => setSuccessMsg(""), 4000);
      await fetchData();
    } catch (err) {
      console.error("Status Change Error:", err);
      const msg =
        err?.response?.data?.message || err?.message || "Failed to update status.";
      setError(typeof msg === "string" ? msg : JSON.stringify(msg));
    }
  };

  // 2. Open View Details Modal
  const handleOpenDetails = async (booking) => {
    try {
      setViewingLoading(true);
      setViewingBooking(booking);
      // Fetch fresh details from DB to include complete history and timeline
      const fresh = await getBookingById(booking._id);
      if (fresh?.booking) {
        setViewingBooking(fresh.booking);
      }
    } catch (_) {
      // Keep existing object if fetch fails
    } finally {
      setViewingLoading(false);
    }
  };

  // 3. Open Create Modal
  const handleOpenCreateModal = () => {
    setError("");
    setCreateForm({
      customer: customers[0]?._id || "",
      vehicle: vehicles[0]?._id || "",
      service: services[0]?._id || "",
      bookingDate: new Date().toISOString().split("T")[0],
      bookingTime: "09:00 AM",
      serviceType: "Workshop",
      mechanic: "",
      description: "",
    });
    setIsCreateModalOpen(true);
  };

  // 4. Submit Create Booking
  const handleCreateBookingSubmit = async (e) => {
    e.preventDefault();
    if (!createForm.vehicle || !createForm.service || !createForm.bookingDate || !createForm.bookingTime) {
      setError("Please fill in all required fields (Vehicle, Service, Date, Time).");
      return;
    }

    try {
      setActionLoading(true);
      setError("");

      const payload = {
        customer: createForm.customer || undefined,
        vehicle: createForm.vehicle,
        service: createForm.service,
        bookingDate: createForm.bookingDate,
        bookingTime: createForm.bookingTime,
        serviceType: createForm.serviceType,
        description: createForm.description,
        ...(createForm.mechanic ? { mechanic: createForm.mechanic } : {}),
      };

      await createBooking(payload);
      setSuccessMsg("New service booking created successfully!");
      setTimeout(() => setSuccessMsg(""), 4000);
      setIsCreateModalOpen(false);
      await fetchData();
    } catch (err) {
      console.error("Create Booking Error:", err);
      const msg =
        err?.response?.data?.message || err?.message || "Failed to create booking.";
      setError(typeof msg === "string" ? msg : JSON.stringify(msg));
    } finally {
      setActionLoading(false);
    }
  };

  // 5. Open Edit Modal
  const handleOpenEditModal = (booking) => {
    setError("");
    setEditingBooking(booking);
    setEditForm({
      service: booking.service?._id || booking.service || "",
      bookingDate: booking.bookingDate
        ? new Date(booking.bookingDate).toISOString().split("T")[0]
        : "",
      bookingTime: booking.bookingTime || "09:00 AM",
      status: booking.status || "Pending",
      mechanic: booking.mechanic?._id || booking.mechanic || "",
      description: booking.description || "",
    });
  };

  // 6. Submit Edit Booking
  const handleEditBookingSubmit = async (e) => {
    e.preventDefault();
    if (!editingBooking) return;

    try {
      setActionLoading(true);
      setError("");

      const payload = {
        service: editForm.service || undefined,
        bookingDate: editForm.bookingDate || undefined,
        bookingTime: editForm.bookingTime || undefined,
        status: editForm.status,
        mechanic: editForm.mechanic || null,
        description: editForm.description,
      };

      await updateBooking(editingBooking._id, payload);
      setSuccessMsg("Booking updated successfully!");
      setTimeout(() => setSuccessMsg(""), 4000);
      setEditingBooking(null);
      if (viewingBooking?._id === editingBooking._id) {
        setViewingBooking(null);
      }
      await fetchData();
    } catch (err) {
      console.error("Edit Booking Error:", err);
      const msg =
        err?.response?.data?.message || err?.message || "Failed to update booking.";
      setError(typeof msg === "string" ? msg : JSON.stringify(msg));
    } finally {
      setActionLoading(false);
    }
  };

  // 7. Manual Mechanic Assignment
  const handleOpenAssignModal = (booking) => {
    setAssigningBookingId(booking._id);
    setSelectedMechanicUser(booking.mechanic?._id || booking.mechanic || "");
  };

  const handleSaveMechanic = async () => {
    if (!assigningBookingId) return;
    try {
      setAssignLoading(true);
      setError("");
      await reassignBookingAdmin(
        assigningBookingId,
        selectedMechanicUser ? { mechanicId: selectedMechanicUser } : { mechanicId: "" }
      );
      setSuccessMsg("Mechanic assigned successfully! Assignment offer dispatched.");
      setTimeout(() => setSuccessMsg(""), 4000);
      setAssigningBookingId(null);
      await fetchData();
    } catch (err) {
      console.error("Assign Mechanic Error:", err);
      const msg =
        err?.response?.data?.message || err?.message || "Failed to assign mechanic.";
      setError(typeof msg === "string" ? msg : JSON.stringify(msg));
    } finally {
      setAssignLoading(false);
    }
  };

  // 8. Auto Reassign / Dispatch
  const handleAutoReassign = async (bookingId) => {
    try {
      setAutoReassigningId(bookingId);
      setError("");
      const res = await reassignBookingAdmin(bookingId, { auto: true });
      setSuccessMsg(res?.message || "Auto-dispatch completed successfully.");
      setTimeout(() => setSuccessMsg(""), 4000);
      await fetchData();
      if (viewingBooking?._id === bookingId) {
        handleOpenDetails({ _id: bookingId });
      }
    } catch (err) {
      console.error("Auto Reassign Error:", err);
      const msg =
        err?.response?.data?.message || err?.message || "Auto-assignment failed.";
      setError(typeof msg === "string" ? msg : JSON.stringify(msg));
    } finally {
      setAutoReassigningId(null);
    }
  };

  // 9. Cancel Booking
  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      setError("");
      await cancelBooking(bookingId);
      setSuccessMsg("Booking has been cancelled.");
      setTimeout(() => setSuccessMsg(""), 4000);
      if (viewingBooking?._id === bookingId) {
        setViewingBooking(null);
      }
      await fetchData();
    } catch (err) {
      console.error("Cancel Booking Error:", err);
      const msg =
        err?.response?.data?.message || err?.message || "Failed to cancel booking.";
      setError(typeof msg === "string" ? msg : JSON.stringify(msg));
    }
  };

  // 10. Delete Booking (Permanent)
  const handleDeleteBooking = async (bookingId) => {
    if (
      !window.confirm(
        "Are you sure you want to PERMANENTLY delete this booking record from the database? This action cannot be undone."
      )
    )
      return;

    try {
      setError("");
      await deleteBooking(bookingId);
      setSuccessMsg("Booking record permanently deleted from database.");
      setTimeout(() => setSuccessMsg(""), 4000);
      if (viewingBooking?._id === bookingId) {
        setViewingBooking(null);
      }
      await fetchData();
    } catch (err) {
      console.error("Delete Booking Error:", err);
      const msg =
        err?.response?.data?.message || err?.message || "Failed to delete booking.";
      setError(typeof msg === "string" ? msg : JSON.stringify(msg));
    }
  };

  // Badges
  const getStatusBadge = (status) => {
    switch (status) {
      case "Completed":
        return "bg-success text-white";
      case "In Progress":
      case "In Service":
        return "bg-info text-dark";
      case "Ready for Pickup":
        return "bg-primary text-white";
      case "Cancelled":
        return "bg-danger text-white";
      case "Pending":
      default:
        return "bg-secondary text-white";
    }
  };

  const getAssignmentBadge = (assignStatus) => {
    switch (assignStatus) {
      case "Accepted":
        return "bg-success-subtle text-success border border-success-subtle";
      case "Pending Acceptance":
        return "bg-warning-subtle text-warning border border-warning-subtle";
      case "Escalated":
        return "bg-danger text-white";
      case "Rejected":
        return "bg-danger-subtle text-danger border border-danger-subtle";
      case "Reassigned":
        return "bg-info-subtle text-info border border-info-subtle";
      case "Unassigned":
      default:
        return "bg-light text-muted border";
    }
  };

  // Search & Filter
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchesStatus = filterStatus === "All" || b.status === filterStatus;
      const customerName = b.customer?.name || "";
      const vehicleName = `${b.vehicle?.brand || ""} ${b.vehicle?.model || ""} ${
        b.vehicle?.vehicleNumber || ""
      }`;
      const serviceName = b.service?.name || "";
      const bookingRef = b.bookingId || b._id || "";
      const query = searchTerm.toLowerCase();

      const matchesSearch =
        customerName.toLowerCase().includes(query) ||
        vehicleName.toLowerCase().includes(query) ||
        serviceName.toLowerCase().includes(query) ||
        bookingRef.toLowerCase().includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [bookings, filterStatus, searchTerm]);

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
                  Admin Control Center
                </span>
                <h2 className="fw-bold mb-1" style={{ color: "#0f172a" }}>
                  Manage Bookings
                </h2>
                <p className="text-muted mb-0">
                  Full CRUD control: create, inspect, assign mechanics, update status, and manage appointments.
                </p>
              </div>

              <div className="d-flex flex-wrap gap-2">
                <button
                  type="button"
                  className="btn btn-danger d-flex align-items-center gap-2 fw-semibold shadow-sm"
                  onClick={handleOpenCreateModal}
                >
                  <i className="bi bi-plus-circle"></i> Create Booking
                </button>
                <button
                  className="btn btn-outline-secondary d-flex align-items-center gap-2"
                  onClick={fetchData}
                  title="Refresh"
                >
                  <i className="bi bi-arrow-clockwise"></i> Refresh
                </button>
                <Link
                  to="/admin/dashboard"
                  className="btn btn-dark d-flex align-items-center gap-2"
                >
                  <i className="bi bi-speedometer2"></i> Dashboard
                </Link>
              </div>
            </div>

            {/* Alerts */}
            {error && (
              <div
                className="alert alert-danger alert-dismissible fade show shadow-sm"
                role="alert"
              >
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                {error}
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setError("")}
                ></button>
              </div>
            )}

            {successMsg && (
              <div
                className="alert alert-success alert-dismissible fade show shadow-sm"
                role="alert"
              >
                <i className="bi bi-check-circle-fill me-2"></i>
                {successMsg}
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSuccessMsg("")}
                ></button>
              </div>
            )}

            {/* Quick Metrics */}
            <div className="row g-3 mb-4">
              <div className="col-sm-6 col-xl-3">
                <div className="card border-0 shadow-sm p-3 bg-white rounded-3">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <small className="text-muted text-uppercase fw-semibold">
                        Total Bookings
                      </small>
                      <h3 className="fw-bold mb-0 text-dark mt-1">
                        {bookings.length}
                      </h3>
                    </div>
                    <div className="p-3 bg-primary-subtle text-primary rounded-circle">
                      <i className="bi bi-calendar2-check fs-4"></i>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-sm-6 col-xl-3">
                <div className="card border-0 shadow-sm p-3 bg-white rounded-3">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <small className="text-muted text-uppercase fw-semibold">
                        Pending Assignment
                      </small>
                      <h3 className="fw-bold mb-0 text-warning mt-1">
                        {
                          bookings.filter(
                            (b) => !b.mechanic && b.status !== "Cancelled"
                          ).length
                        }
                      </h3>
                    </div>
                    <div className="p-3 bg-warning-subtle text-warning rounded-circle">
                      <i className="bi bi-person-x fs-4"></i>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-sm-6 col-xl-3">
                <div className="card border-0 shadow-sm p-3 bg-white rounded-3">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <small className="text-muted text-uppercase fw-semibold">
                        In Progress
                      </small>
                      <h3 className="fw-bold mb-0 text-info mt-1">
                        {
                          bookings.filter(
                            (b) =>
                              b.status === "In Progress" ||
                              b.status === "In Service"
                          ).length
                        }
                      </h3>
                    </div>
                    <div className="p-3 bg-info-subtle text-info rounded-circle">
                      <i className="bi bi-tools fs-4"></i>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-sm-6 col-xl-3">
                <div className="card border-0 shadow-sm p-3 bg-white rounded-3">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <small className="text-muted text-uppercase fw-semibold">
                        Completed
                      </small>
                      <h3 className="fw-bold mb-0 text-success mt-1">
                        {
                          bookings.filter((b) => b.status === "Completed").length
                        }
                      </h3>
                    </div>
                    <div className="p-3 bg-success-subtle text-success rounded-circle">
                      <i className="bi bi-check2-all fs-4"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body p-3">
                <div className="row g-3 align-items-center">
                  <div className="col-md-6 col-lg-5">
                    <div className="input-group">
                      <span className="input-group-text bg-white border-end-0 text-muted">
                        <i className="bi bi-search"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control border-start-0"
                        placeholder="Search by customer, vehicle, service, or booking ID..."
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

                  <div className="col-md-6 col-lg-7 d-flex flex-wrap gap-2 justify-content-md-end">
                    {[
                      "All",
                      "Pending",
                      "In Progress",
                      "Completed",
                      "Cancelled",
                    ].map((st) => (
                      <button
                        key={st}
                        className={`btn btn-sm ${
                          filterStatus === st
                            ? "btn-danger fw-semibold"
                            : "btn-outline-secondary"
                        }`}
                        onClick={() => setFilterStatus(st)}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bookings Table */}
            {loading ? (
              <div className="card border-0 shadow-sm text-center py-5">
                <div
                  className="spinner-border text-danger mx-auto mb-3"
                  role="status"
                ></div>
                <p className="text-muted mb-0">
                  Loading booking records from database...
                </p>
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="card border-0 shadow-sm text-center py-5">
                <i
                  className="bi bi-calendar-x text-muted"
                  style={{ fontSize: "64px" }}
                ></i>
                <h5 className="fw-bold mt-3">No Bookings Found</h5>
                <p className="text-muted">
                  No records match your selected filter or search term.
                </p>
                <div>
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm"
                    onClick={handleOpenCreateModal}
                  >
                    <i className="bi bi-plus-circle me-1"></i> Create First Booking
                  </button>
                </div>
              </div>
            ) : (
              <div className="card border-0 shadow-sm">
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-dark">
                      <tr>
                        <th style={{ width: "50px" }}>#</th>
                        <th>Customer</th>
                        <th>Vehicle</th>
                        <th>Service</th>
                        <th>Schedule</th>
                        <th>Mechanic</th>
                        <th>Offer Status</th>
                        <th>Service Stage</th>
                        <th className="text-end" style={{ minWidth: "160px" }}>
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBookings.map((booking, idx) => {
                        const cust = booking.customer;
                        const veh = booking.vehicle;
                        const srv = booking.service;
                        const mech = booking.mechanic;
                        const bookingId = booking._id;

                        return (
                          <tr key={bookingId || idx}>
                            <td className="text-muted fw-semibold">
                              {idx + 1}
                            </td>

                            {/* Customer */}
                            <td>
                              <div className="fw-bold text-dark">
                                {cust?.name || "N/A"}
                              </div>
                              <small className="text-muted d-block">
                                <i className="bi bi-envelope me-1"></i>
                                {cust?.email || "No email"}
                              </small>
                              {cust?.phone && (
                                <small className="text-muted d-block">
                                  <i className="bi bi-telephone me-1"></i>
                                  {cust.phone}
                                </small>
                              )}
                            </td>

                            {/* Vehicle */}
                            <td>
                              <div className="fw-semibold text-dark">
                                {veh?.brand} {veh?.model}
                              </div>
                              <span className="badge bg-light text-dark border me-1">
                                {veh?.vehicleNumber || booking.vehicleNumber || "N/A"}
                              </span>
                              {veh?.fuelType && (
                                <small className="text-muted">
                                  {veh.fuelType}
                                </small>
                              )}
                            </td>

                            {/* Service */}
                            <td>
                              <div className="fw-bold text-danger">
                                {srv?.name || booking.serviceType || "Custom Service"}
                              </div>
                              <small className="text-success fw-semibold">
                                ₹{srv?.price?.toLocaleString() || "0"}
                              </small>
                            </td>

                            {/* Schedule */}
                            <td>
                              <div className="fw-semibold">
                                <i className="bi bi-calendar3 me-1 text-primary"></i>
                                {booking.bookingDate
                                  ? new Date(
                                      booking.bookingDate
                                    ).toLocaleDateString()
                                  : "N/A"}
                              </div>
                              <small className="text-muted">
                                <i className="bi bi-clock me-1"></i>
                                {booking.bookingTime || "N/A"}
                              </small>
                            </td>

                            {/* Mechanic */}
                            <td>
                              {mech ? (
                                <div>
                                  <div className="fw-bold text-dark d-flex align-items-center gap-1">
                                    <i className="bi bi-person-badge text-primary"></i>
                                    {mech.name || "Assigned"}
                                  </div>
                                  <button
                                    type="button"
                                    className="btn btn-link p-0 text-decoration-none text-primary"
                                    style={{ fontSize: "12px" }}
                                    onClick={() =>
                                      handleOpenAssignModal(booking)
                                    }
                                  >
                                    Change Mechanic
                                  </button>
                                </div>
                              ) : (
                                <div>
                                  <span className="badge bg-secondary-subtle text-secondary mb-1">
                                    Unassigned
                                  </span>
                                  <br />
                                  <button
                                    type="button"
                                    className="btn btn-outline-primary btn-sm py-0 px-2"
                                    style={{ fontSize: "12px" }}
                                    onClick={() =>
                                      handleOpenAssignModal(booking)
                                    }
                                  >
                                    <i className="bi bi-person-plus me-1"></i>{" "}
                                    Assign
                                  </button>
                                </div>
                              )}
                            </td>

                            {/* Offer Status */}
                            <td>
                              <span
                                className={`badge ${getAssignmentBadge(
                                  booking.assignmentStatus ||
                                    (mech ? "Accepted" : "Unassigned")
                                )} mb-1 d-inline-block`}
                              >
                                {booking.assignmentStatus ||
                                  (mech ? "Accepted" : "Unassigned")}
                              </span>
                              {(booking.assignmentStatus === "Escalated" ||
                                (!mech && booking.status !== "Cancelled")) && (
                                <button
                                  type="button"
                                  className="btn btn-warning btn-sm py-0 px-2 d-block mt-1 fw-semibold"
                                  style={{ fontSize: "11px" }}
                                  disabled={autoReassigningId === bookingId}
                                  onClick={() => handleAutoReassign(bookingId)}
                                  title="Dispatch offer to next least-loaded eligible mechanic"
                                >
                                  {autoReassigningId === bookingId
                                    ? "Dispatching..."
                                    : "⚡ Auto Dispatch"}
                                </button>
                              )}
                            </td>

                            {/* Service Stage */}
                            <td>
                              <select
                                className="form-select form-select-sm fw-semibold mb-1"
                                value={booking.status || "Pending"}
                                onChange={(e) =>
                                  handleStatusChange(bookingId, e.target.value)
                                }
                                style={{ minWidth: "130px" }}
                                disabled={booking.status === "Cancelled"}
                              >
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                              <span
                                className={`badge ${getStatusBadge(
                                  booking.status
                                )}`}
                              >
                                {booking.status}
                              </span>
                            </td>

                            {/* Actions Column: View (Eye), Edit (Pencil), Cancel (X), Delete (Trash) */}
                            <td className="text-end">
                              <div className="d-flex justify-content-end gap-1">
                                {/* Eye: View Details in Modal */}
                                <button
                                  type="button"
                                  className="btn btn-outline-info btn-sm"
                                  title="View Booking Details"
                                  onClick={() => handleOpenDetails(booking)}
                                >
                                  <i className="bi bi-eye"></i>
                                </button>

                                {/* Pencil: Edit Booking in Modal */}
                                <button
                                  type="button"
                                  className="btn btn-outline-primary btn-sm"
                                  title="Edit Booking"
                                  onClick={() => handleOpenEditModal(booking)}
                                >
                                  <i className="bi bi-pencil-square"></i>
                                </button>

                                {/* X: Cancel Booking */}
                                {booking.status !== "Cancelled" &&
                                  booking.status !== "Completed" && (
                                    <button
                                      type="button"
                                      className="btn btn-outline-warning btn-sm"
                                      title="Cancel Booking"
                                      onClick={() =>
                                        handleCancelBooking(bookingId)
                                      }
                                    >
                                      <i className="bi bi-x-circle"></i>
                                    </button>
                                  )}

                                {/* Trash: Delete Booking permanently */}
                                <button
                                  type="button"
                                  className="btn btn-outline-danger btn-sm"
                                  title="Delete Booking"
                                  onClick={() =>
                                    handleDeleteBooking(bookingId)
                                  }
                                >
                                  <i className="bi bi-trash3"></i>
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

      {/* ================= MODAL 1: VIEW DETAILS MODAL ================= */}
      {viewingBooking && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.65)", zIndex: 1050 }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              {/* Header */}
              <div className="modal-header bg-dark text-white py-3">
                <div className="d-flex align-items-center gap-2">
                  <div className="p-2 bg-primary rounded-circle text-white d-flex align-items-center justify-content-center" style={{ width: "36px", height: "36px" }}>
                    <i className="bi bi-calendar2-check fs-6"></i>
                  </div>
                  <div>
                    <h5 className="modal-title fw-bold mb-0">
                      Booking Reference: {viewingBooking.bookingId || viewingBooking._id}
                    </h5>
                    <small className="text-secondary">
                      Created on {new Date(viewingBooking.createdAt || Date.now()).toLocaleString()}
                    </small>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setViewingBooking(null)}
                ></button>
              </div>

              {/* Body */}
              <div className="modal-body p-4 bg-light">
                {viewingLoading && (
                  <div className="text-center py-2 text-primary small">
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Syncing latest booking data...
                  </div>
                )}

                {/* Badges Bar */}
                <div className="d-flex flex-wrap gap-2 mb-4 p-3 bg-white rounded-3 shadow-sm border">
                  <div>
                    <small className="text-muted d-block text-uppercase fw-semibold" style={{ fontSize: "11px" }}>
                      Service Stage
                    </small>
                    <span className={`badge ${getStatusBadge(viewingBooking.status)} fs-6`}>
                      {viewingBooking.status}
                    </span>
                  </div>

                  <div className="ms-md-4">
                    <small className="text-muted d-block text-uppercase fw-semibold" style={{ fontSize: "11px" }}>
                      Mechanic Offer Status
                    </small>
                    <span className={`badge ${getAssignmentBadge(viewingBooking.assignmentStatus || (viewingBooking.mechanic ? "Accepted" : "Unassigned"))} fs-6`}>
                      {viewingBooking.assignmentStatus || (viewingBooking.mechanic ? "Accepted" : "Unassigned")}
                    </span>
                  </div>

                  <div className="ms-auto text-md-end">
                    <small className="text-muted d-block text-uppercase fw-semibold" style={{ fontSize: "11px" }}>
                      Total Cost
                    </small>
                    <span className="fw-bold text-success fs-5">
                      ₹{viewingBooking.service?.price?.toLocaleString() || viewingBooking.cost || "1,500"}
                    </span>
                  </div>
                </div>

                <div className="row g-3">
                  {/* Customer Information */}
                  <div className="col-md-6">
                    <div className="card h-100 border-0 shadow-sm p-3 rounded-3 bg-white">
                      <h6 className="fw-bold text-dark border-bottom pb-2 mb-3 d-flex align-items-center gap-2">
                        <i className="bi bi-person-circle text-primary"></i> Customer Details
                      </h6>
                      <div className="mb-2">
                        <span className="text-muted small d-block">Full Name</span>
                        <strong className="text-dark">{viewingBooking.customer?.name || "N/A"}</strong>
                      </div>
                      <div className="mb-2">
                        <span className="text-muted small d-block">Email Address</span>
                        <span className="text-dark">{viewingBooking.customer?.email || "No email provided"}</span>
                      </div>
                      <div>
                        <span className="text-muted small d-block">Phone Number</span>
                        <span className="text-dark">{viewingBooking.customer?.phone || "No phone provided"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Vehicle Information */}
                  <div className="col-md-6">
                    <div className="card h-100 border-0 shadow-sm p-3 rounded-3 bg-white">
                      <h6 className="fw-bold text-dark border-bottom pb-2 mb-3 d-flex align-items-center gap-2">
                        <i className="bi bi-car-front-fill text-danger"></i> Vehicle Information
                      </h6>
                      <div className="mb-2">
                        <span className="text-muted small d-block">Make & Model</span>
                        <strong className="text-dark">
                          {viewingBooking.vehicle?.brand || viewingBooking.vehicleModel || "Vehicle"} {viewingBooking.vehicle?.model || ""}
                        </strong>
                      </div>
                      <div className="mb-2">
                        <span className="text-muted small d-block">Registration Plate</span>
                        <span className="badge bg-light text-dark border px-2 py-1 fs-6">
                          {viewingBooking.vehicle?.vehicleNumber || viewingBooking.vehicleNumber || "N/A"}
                        </span>
                      </div>
                      <div className="d-flex gap-4">
                        <div>
                          <span className="text-muted small d-block">Fuel Type</span>
                          <span className="text-dark">{viewingBooking.vehicle?.fuelType || "Petrol"}</span>
                        </div>
                        <div>
                          <span className="text-muted small d-block">Model Year</span>
                          <span className="text-dark">{viewingBooking.vehicle?.year || "N/A"}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Service & Schedule */}
                  <div className="col-md-6">
                    <div className="card h-100 border-0 shadow-sm p-3 rounded-3 bg-white">
                      <h6 className="fw-bold text-dark border-bottom pb-2 mb-3 d-flex align-items-center gap-2">
                        <i className="bi bi-tools text-warning"></i> Service Requested
                      </h6>
                      <div className="mb-2">
                        <span className="text-muted small d-block">Package Name</span>
                        <strong className="text-danger">
                          {viewingBooking.service?.name || viewingBooking.serviceType || "Standard Maintenance"}
                        </strong>
                      </div>
                      <div className="mb-2">
                        <span className="text-muted small d-block">Duration Estimate</span>
                        <span className="text-dark">{viewingBooking.service?.duration || "2 - 3 Hours"}</span>
                      </div>
                      <div>
                        <span className="text-muted small d-block">Appointment Schedule</span>
                        <span className="fw-semibold text-dark">
                          <i className="bi bi-calendar3 me-1 text-primary"></i>
                          {viewingBooking.bookingDate ? new Date(viewingBooking.bookingDate).toLocaleDateString() : "N/A"}
                          {" at "}
                          <i className="bi bi-clock me-1 text-primary"></i>
                          {viewingBooking.bookingTime || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Technician & Assignment */}
                  <div className="col-md-6">
                    <div className="card h-100 border-0 shadow-sm p-3 rounded-3 bg-white">
                      <h6 className="fw-bold text-dark border-bottom pb-2 mb-3 d-flex align-items-center gap-2">
                        <i className="bi bi-person-badge text-success"></i> Assigned Technician
                      </h6>
                      {viewingBooking.mechanic ? (
                        <>
                          <div className="mb-2">
                            <span className="text-muted small d-block">Technician Name</span>
                            <strong className="text-dark">{viewingBooking.mechanic?.name || "Assigned"}</strong>
                          </div>
                          <div className="mb-2">
                            <span className="text-muted small d-block">Contact</span>
                            <span className="text-dark">
                              {viewingBooking.mechanic?.phone || viewingBooking.mechanic?.email || "Available via Hub"}
                            </span>
                          </div>
                        </>
                      ) : (
                        <div className="p-3 bg-light rounded text-center my-2">
                          <span className="badge bg-secondary-subtle text-secondary mb-2">Unassigned</span>
                          <p className="text-muted small mb-2">No mechanic currently assigned to this job.</p>
                          <button
                            type="button"
                            className="btn btn-warning btn-sm fw-semibold"
                            onClick={() => handleAutoReassign(viewingBooking._id)}
                            disabled={autoReassigningId === viewingBooking._id}
                          >
                            {autoReassigningId === viewingBooking._id ? "Dispatching..." : "⚡ Auto Dispatch Now"}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Notes & Description */}
                  {viewingBooking.description && (
                    <div className="col-12">
                      <div className="card border-0 shadow-sm p-3 rounded-3 bg-white">
                        <h6 className="fw-bold text-dark mb-1">Customer Notes / Service Request</h6>
                        <p className="text-muted mb-0 small">{viewingBooking.description}</p>
                      </div>
                    </div>
                  )}

                  {/* Rejection History if any */}
                  {Array.isArray(viewingBooking.rejectionHistory) && viewingBooking.rejectionHistory.length > 0 && (
                    <div className="col-12">
                      <div className="card border-0 shadow-sm p-3 rounded-3 bg-white border-start border-danger border-4">
                        <h6 className="fw-bold text-danger mb-2 d-flex align-items-center gap-2">
                          <i className="bi bi-clock-history"></i> Assignment Rejection Log ({viewingBooking.rejectionHistory.length})
                        </h6>
                        <div className="table-responsive">
                          <table className="table table-sm table-bordered mb-0 small">
                            <thead className="table-light">
                              <tr>
                                <th>Timestamp</th>
                                <th>Reason Given</th>
                              </tr>
                            </thead>
                            <tbody>
                              {viewingBooking.rejectionHistory.map((rej, i) => (
                                <tr key={i}>
                                  <td>{new Date(rej.rejectedAt || Date.now()).toLocaleString()}</td>
                                  <td className="text-danger fw-semibold">{rej.reason || "Declined by technician"}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="modal-footer bg-light py-2">
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1"
                  onClick={() => {
                    const target = viewingBooking;
                    setViewingBooking(null);
                    handleOpenEditModal(target);
                  }}
                >
                  <i className="bi bi-pencil-square"></i> Edit Booking
                </button>
                <button
                  type="button"
                  className="btn btn-outline-warning btn-sm d-flex align-items-center gap-1"
                  onClick={() => {
                    const target = viewingBooking;
                    setViewingBooking(null);
                    handleOpenAssignModal(target);
                  }}
                >
                  <i className="bi bi-person-gear"></i> Change Mechanic
                </button>
                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1"
                  onClick={() => handleDeleteBooking(viewingBooking._id)}
                >
                  <i className="bi bi-trash3"></i> Delete
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setViewingBooking(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: CREATE BOOKING MODAL ================= */}
      {isCreateModalOpen && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.65)", zIndex: 1050 }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <form onSubmit={handleCreateBookingSubmit}>
                <div className="modal-header bg-danger text-white py-3">
                  <h5 className="modal-title fw-bold">
                    <i className="bi bi-plus-circle me-2"></i> Create New Service Booking
                  </h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() => setIsCreateModalOpen(false)}
                  ></button>
                </div>

                <div className="modal-body p-4 bg-light">
                  <div className="row g-3">
                    {/* Customer */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small text-dark">
                        Select Customer <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select"
                        value={createForm.customer}
                        onChange={(e) =>
                          setCreateForm({
                            ...createForm,
                            customer: e.target.value,
                            vehicle: "",
                          })
                        }
                        required
                      >
                        <option value="">-- Choose Customer --</option>
                        {customers.map((c) => (
                          <option key={c._id} value={c._id}>
                            {c.name} ({c.email})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Vehicle */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small text-dark">
                        Select Vehicle <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select"
                        value={createForm.vehicle}
                        onChange={(e) =>
                          setCreateForm({
                            ...createForm,
                            vehicle: e.target.value,
                          })
                        }
                        required
                      >
                        <option value="">-- Choose Vehicle --</option>
                        {customerVehicles.map((v) => (
                          <option key={v._id} value={v._id}>
                            {v.brand} {v.model} ({v.vehicleNumber})
                          </option>
                        ))}
                      </select>
                      {customerVehicles.length === 0 && (
                        <small className="text-danger">
                          No vehicles found. Make sure selected customer has a vehicle registered.
                        </small>
                      )}
                    </div>

                    {/* Service Package */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small text-dark">
                        Service Package <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select"
                        value={createForm.service}
                        onChange={(e) =>
                          setCreateForm({
                            ...createForm,
                            service: e.target.value,
                          })
                        }
                        required
                      >
                        <option value="">-- Choose Service --</option>
                        {services.map((s) => (
                          <option key={s._id} value={s._id}>
                            {s.name} - ₹{s.price?.toLocaleString()}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Service Type */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small text-dark">
                        Service Type
                      </label>
                      <select
                        className="form-select"
                        value={createForm.serviceType}
                        onChange={(e) =>
                          setCreateForm({
                            ...createForm,
                            serviceType: e.target.value,
                          })
                        }
                      >
                        <option value="Workshop">Workshop Service</option>
                        <option value="Doorstep Pickup">Doorstep Pickup</option>
                        <option value="Emergency Roadside">Emergency Roadside</option>
                      </select>
                    </div>

                    {/* Date */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small text-dark">
                        Appointment Date <span className="text-danger">*</span>
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        value={createForm.bookingDate}
                        onChange={(e) =>
                          setCreateForm({
                            ...createForm,
                            bookingDate: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    {/* Time */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small text-dark">
                        Appointment Time Slot <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select"
                        value={createForm.bookingTime}
                        onChange={(e) =>
                          setCreateForm({
                            ...createForm,
                            bookingTime: e.target.value,
                          })
                        }
                        required
                      >
                        <option value="09:00 AM">09:00 AM - 10:00 AM</option>
                        <option value="10:00 AM">10:00 AM - 11:00 AM</option>
                        <option value="11:00 AM">11:00 AM - 12:00 PM</option>
                        <option value="01:00 PM">01:00 PM - 02:00 PM</option>
                        <option value="02:00 PM">02:00 PM - 03:00 PM</option>
                        <option value="03:00 PM">03:00 PM - 04:00 PM</option>
                        <option value="04:00 PM">04:00 PM - 05:00 PM</option>
                      </select>
                    </div>

                    {/* Mechanic (Optional) */}
                    <div className="col-12">
                      <label className="form-label fw-semibold small text-dark">
                        Initial Mechanic Assignment (Optional)
                      </label>
                      <select
                        className="form-select"
                        value={createForm.mechanic}
                        onChange={(e) =>
                          setCreateForm({
                            ...createForm,
                            mechanic: e.target.value,
                          })
                        }
                      >
                        <option value="">⚡ Auto-Dispatch Automatically (Recommended)</option>
                        {mechanics.map((m) => {
                          const u = m.user || {};
                          return (
                            <option key={u._id || m._id} value={u._id || m._id}>
                              {u.name || m.name} (Direct Assign)
                            </option>
                          );
                        })}
                      </select>
                      <div className="form-text small">
                        Leave as Auto-Dispatch to let the load-balancing algorithm select the least-loaded technician.
                      </div>
                    </div>

                    {/* Notes */}
                    <div className="col-12">
                      <label className="form-label fw-semibold small text-dark">
                        Service Notes / Description
                      </label>
                      <textarea
                        className="form-control"
                        rows="3"
                        placeholder="Optional instructions or reported issues from customer..."
                        value={createForm.description}
                        onChange={(e) =>
                          setCreateForm({
                            ...createForm,
                            description: e.target.value,
                          })
                        }
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div className="modal-footer bg-light py-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setIsCreateModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-danger px-4 fw-semibold"
                    disabled={actionLoading}
                  >
                    {actionLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Creating...
                      </>
                    ) : (
                      "Create Booking"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 3: EDIT BOOKING MODAL ================= */}
      {editingBooking && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.65)", zIndex: 1050 }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <form onSubmit={handleEditBookingSubmit}>
                <div className="modal-header bg-primary text-white py-3">
                  <h5 className="modal-title fw-bold">
                    <i className="bi bi-pencil-square me-2"></i> Edit Booking ({editingBooking.bookingId || editingBooking._id})
                  </h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() => setEditingBooking(null)}
                  ></button>
                </div>

                <div className="modal-body p-4 bg-light">
                  <div className="row g-3">
                    {/* Service Package */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small text-dark">
                        Service Package
                      </label>
                      <select
                        className="form-select"
                        value={editForm.service}
                        onChange={(e) =>
                          setEditForm({ ...editForm, service: e.target.value })
                        }
                      >
                        {services.map((s) => (
                          <option key={s._id} value={s._id}>
                            {s.name} - ₹{s.price?.toLocaleString()}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Status */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small text-dark">
                        Service Status Stage
                      </label>
                      <select
                        className="form-select"
                        value={editForm.status}
                        onChange={(e) =>
                          setEditForm({ ...editForm, status: e.target.value })
                        }
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Ready for Pickup">Ready for Pickup</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>

                    {/* Date */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small text-dark">
                        Appointment Date
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        value={editForm.bookingDate}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            bookingDate: e.target.value,
                          })
                        }
                      />
                    </div>

                    {/* Time */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small text-dark">
                        Appointment Time Slot
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={editForm.bookingTime}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            bookingTime: e.target.value,
                          })
                        }
                        placeholder="e.g. 10:00 AM"
                      />
                    </div>

                    {/* Mechanic Assignment */}
                    <div className="col-12">
                      <label className="form-label fw-semibold small text-dark">
                        Assigned Mechanic
                      </label>
                      <select
                        className="form-select"
                        value={editForm.mechanic}
                        onChange={(e) =>
                          setEditForm({ ...editForm, mechanic: e.target.value })
                        }
                      >
                        <option value="">-- No Mechanic (Unassigned) --</option>
                        {mechanics.map((m) => {
                          const u = m.user || {};
                          return (
                            <option key={u._id || m._id} value={u._id || m._id}>
                              {u.name || m.name}
                            </option>
                          );
                        })}
                      </select>
                    </div>

                    {/* Description */}
                    <div className="col-12">
                      <label className="form-label fw-semibold small text-dark">
                        Service Notes / Description
                      </label>
                      <textarea
                        className="form-control"
                        rows="3"
                        value={editForm.description}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            description: e.target.value,
                          })
                        }
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div className="modal-footer bg-light py-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setEditingBooking(null)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary px-4 fw-semibold"
                    disabled={actionLoading}
                  >
                    {actionLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 4: ASSIGN MECHANIC MODAL ================= */}
      {assigningBookingId && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 1050 }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-3">
              <div className="modal-header bg-dark text-white">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-person-plus-fill me-2 text-danger"></i>
                  Assign Mechanic
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setAssigningBookingId(null)}
                ></button>
              </div>

              <div className="modal-body p-4">
                <p className="text-muted">
                  Select a certified mechanic to handle this service booking.
                  The technician and customer will be notified automatically.
                </p>

                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Select Mechanic
                  </label>
                  <select
                    className="form-select form-select-lg"
                    value={selectedMechanicUser}
                    onChange={(e) => setSelectedMechanicUser(e.target.value)}
                  >
                    <option value="">-- Remove / No Mechanic --</option>
                    {mechanics.map((m) => {
                      const userObj = m.user || {};
                      const userId = userObj._id || m._id;
                      const name = userObj.name || m.name || "Mechanic";
                      const status =
                        m.status || (m.isAvailable ? "Available" : "Busy");
                      return (
                        <option key={userId} value={userId}>
                          {name} ({status} • {m.activeWorkload || 0} active jobs)
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              <div className="modal-footer bg-light">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setAssigningBookingId(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger px-4"
                  onClick={handleSaveMechanic}
                  disabled={assignLoading}
                >
                  {assignLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Assigning...
                    </>
                  ) : (
                    "Save Assignment"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageBookings;