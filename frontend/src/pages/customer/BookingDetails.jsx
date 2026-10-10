import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { getBookingById, cancelBooking } from "../../services/bookingService";

function BookingDetails() {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadBooking = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getBookingById(bookingId);
      setBooking(res.booking || res.data);
    } catch (err) {
      console.error("Fetch booking details error:", err);
      setError("Booking not found or access denied.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooking();
  }, [bookingId]);

  const handleCancel = async () => {
    const confirmCancel = window.confirm("Are you sure you want to cancel this booking?");
    if (!confirmCancel) return;

    try {
      await cancelBooking(bookingId);
      setSuccess("Booking has been cancelled successfully.");
      loadBooking();
      setTimeout(() => setSuccess(""), 3500);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel booking.");
    }
  };

  const statusBadges = {
    Completed: "bg-success text-white",
    "Ready for Pickup": "bg-success text-white",
    Cancelled: "bg-danger text-white",
    Pending: "bg-warning text-dark",
    Confirmed: "bg-primary text-white",
    "In Service": "bg-info text-dark",
    "In Progress": "bg-info text-dark",
  };

  // 5 Stages per Requirement 12
  const trackerStages = [
    { label: "Booking Received", desc: "Request registered" },
    { label: "Confirmed", desc: "Technician & slot confirmed" },
    { label: "In Service", desc: "Repairs actively underway" },
    { label: "Completed", desc: "Quality checks passed" },
    { label: "Ready for Pickup", desc: "Collect vehicle at hub" },
  ];

  const getStageIndex = (st) => {
    if (st === "Ready for Pickup") return 4;
    if (st === "Completed") return 3;
    if (st === "In Service" || st === "In Progress") return 2;
    if (st === "Confirmed") return 1;
    return 0; // Pending or default
  };

  const currentStatus = booking?.status || booking?.serviceStatus || "Pending";
  const activeStageIndex = currentStatus === "Cancelled" ? -1 : getStageIndex(currentStatus);

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
              to="/customer/bookings"
              className="text-decoration-none small text-secondary fw-semibold mb-2 d-inline-block"
            >
              <i className="bi bi-arrow-left me-1"></i> Back to My Bookings
            </Link>
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
              <div>
                <h2 className="fw-bold mb-1 text-dark">Service Appointment Details</h2>
                <p className="text-secondary mb-0">
                  Comprehensive status tracker and repair information for your vehicle.
                </p>
              </div>

              {booking && (
                <div className="d-flex align-items-center gap-2">
                  <span className="badge bg-light text-secondary border font-monospace px-3 py-2 rounded-pill">
                    ID: {booking.bookingId || `BK-${(booking._id || "").slice(-6).toUpperCase()}`}
                  </span>
                  <span
                    className={`badge px-4 py-2 rounded-pill shadow-sm fs-6 ${
                      statusBadges[currentStatus] || "bg-secondary"
                    }`}
                    style={{
                      backgroundColor:
                        currentStatus === "Ready for Pickup" ? "#059669" : undefined,
                    }}
                  >
                    {currentStatus}
                  </span>
                </div>
              )}
            </div>
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
              <p className="mt-2 text-muted small">Loading booking details...</p>
            </div>
          ) : !booking ? (
            <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
              <i className="bi bi-exclamation-circle text-danger" style={{ fontSize: "50px" }}></i>
              <h5 className="fw-bold mt-3 text-dark">Booking Not Found</h5>
              <p className="text-secondary small mb-3">
                This booking ID does not exist or has been removed.
              </p>
              <div>
                <Link to="/customer/bookings" className="btn btn-primary rounded-pill px-4">
                  Back to Bookings
                </Link>
              </div>
            </div>
          ) : (
            <div>
              {/* Ready for Pickup Alert Banner */}
              {currentStatus === "Ready for Pickup" && (
                <div
                  className="card border-0 shadow-sm rounded-4 p-4 mb-4 text-white"
                  style={{ background: "linear-gradient(135deg, #059669 0%, #10b981 100%)" }}
                >
                  <div className="d-flex align-items-center gap-3">
                    <div
                      className="rounded-circle bg-white text-success d-flex align-items-center justify-content-center p-3 shadow-sm flex-shrink-0"
                      style={{ width: "64px", height: "64px" }}
                    >
                      <i className="bi bi-car-front-fill fs-2"></i>
                    </div>
                    <div>
                      <h4 className="fw-bold mb-1">Your Vehicle is Ready for Pickup!</h4>
                      <p className="mb-0 text-white-50">
                        All repairs and quality checks have been completed. Please visit Car Service &amp; Mechanic Hub to collect your vehicle.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Requirement 12: Visual Status Tracker */}
              <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="fw-bold text-dark text-uppercase small mb-0 tracking-wide">
                    Live Service Progress Tracker
                  </h6>
                  <span className="badge bg-light text-primary border px-2 py-1 rounded small">
                    5-Stage Milestone Flow
                  </span>
                </div>

                {currentStatus !== "Cancelled" ? (
                  <div className="py-2">
                    <div className="row g-2 text-center position-relative">
                      {trackerStages.map((stage, idx) => {
                        const isCompleted = idx < activeStageIndex;
                        const isCurrent = idx === activeStageIndex;

                        return (
                          <div key={stage.label} className="col">
                            <div
                              className={`rounded-circle mx-auto d-flex align-items-center justify-content-center fw-bold shadow-sm mb-2 ${
                                isCompleted
                                  ? "bg-success text-white"
                                  : isCurrent
                                  ? "bg-primary text-white"
                                  : "bg-light text-muted border"
                              }`}
                              style={{ width: "42px", height: "42px", fontSize: "16px" }}
                            >
                              {isCompleted ? <i className="bi bi-check-lg"></i> : idx + 1}
                            </div>
                            <span
                              className={`d-block small ${
                                isCurrent
                                  ? "fw-bold text-primary"
                                  : isCompleted
                                  ? "fw-semibold text-success"
                                  : "text-muted"
                              }`}
                            >
                              {stage.label}
                            </span>
                            <small className="text-secondary d-none d-md-block" style={{ fontSize: "11px" }}>
                              {stage.desc}
                            </small>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="alert alert-danger py-2 px-3 mb-0 rounded-3 text-center">
                    <i className="bi bi-x-octagon-fill me-2"></i>
                    This booking has been cancelled.
                  </div>
                )}
              </div>

              <div className="row g-4">
                {/* Left Column: Service & Vehicle */}
                <div className="col-lg-8">
                  {/* Service Details Card */}
                  <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
                    <div className="d-flex align-items-center mb-3">
                      <div
                        className="bg-primary bg-opacity-10 text-primary rounded-circle p-3 me-3 d-flex align-items-center justify-content-center"
                        style={{ width: "52px", height: "52px" }}
                      >
                        <i className="bi bi-tools fs-4"></i>
                      </div>
                      <div>
                        <span className="text-secondary small">Service Selected</span>
                        <h4 className="fw-bold text-dark mb-0">
                          {booking.service?.name || booking.serviceType || "Automotive Service"}
                        </h4>
                      </div>
                    </div>

                    <p className="text-secondary mb-3" style={{ lineHeight: "1.6" }}>
                      {booking.service?.description || "Professional vehicle maintenance service."}
                    </p>

                    <div className="row g-3 p-3 rounded-3" style={{ backgroundColor: "#f8fafc" }}>
                      <div className="col-sm-6">
                        <span className="text-secondary small d-block">Service Price</span>
                        <strong className="fs-5 text-dark">
                          {booking.service?.price !== undefined ? `₹${booking.service.price}` : "Standard Rates"}
                        </strong>
                      </div>
                      <div className="col-sm-6">
                        <span className="text-secondary small d-block">Estimated Duration</span>
                        <strong className="text-dark">
                          {booking.service?.duration || "1 - 2 Hours"}
                        </strong>
                      </div>
                    </div>

                    {booking.description && (
                      <div className="mt-3 p-3 bg-light rounded-3 border">
                        <span className="text-secondary small fw-semibold d-block mb-1">
                          Problem / Issue Described by You:
                        </span>
                        <p className="mb-0 text-dark small">{booking.description}</p>
                      </div>
                    )}
                  </div>

                  {/* Vehicle Details Card */}
                  <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
                    <h5 className="fw-bold text-dark mb-3">
                      <i className="bi bi-car-front text-primary me-2"></i>
                      Vehicle Details
                    </h5>

                    <div className="row g-3">
                      <div className="col-sm-6">
                        <span className="text-secondary small d-block">Brand &amp; Model</span>
                        <strong className="text-dark fs-6">
                          {booking.vehicle?.brand || ""} {booking.vehicle?.model || booking.vehicleModel || "Vehicle"}
                        </strong>
                      </div>
                      <div className="col-sm-6">
                        <span className="text-secondary small d-block">Registration Plate</span>
                        <span className="badge bg-dark bg-opacity-10 text-dark font-monospace fs-6 px-3 py-1">
                          {booking.vehicle?.vehicleNumber || booking.vehicleNumber || "N/A"}
                        </span>
                      </div>
                      <div className="col-sm-6">
                        <span className="text-secondary small d-block">Fuel Type</span>
                        <strong className="text-dark">
                          {booking.vehicle?.fuelType || "Petrol"}
                        </strong>
                      </div>
                      <div className="col-sm-6">
                        <span className="text-secondary small d-block">Manufacturing Year</span>
                        <strong className="text-dark">
                          {booking.vehicle?.year || "N/A"}
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* Technician Notes Card if available */}
                  {booking.mechanicNotes && (
                    <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white border-start border-primary border-4">
                      <h5 className="fw-bold text-dark mb-2">
                        <i className="bi bi-clipboard-pulse text-primary me-2"></i>
                        Technician Diagnostic Notes
                      </h5>
                      <p className="text-dark mb-0" style={{ lineHeight: "1.6" }}>
                        {booking.mechanicNotes}
                      </p>
                    </div>
                  )}
                </div>

                {/* Right Column: Appointment Schedule & Mechanic */}
                <div className="col-lg-4">
                  {/* Appointment Schedule Card */}
                  <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
                    <h5 className="fw-bold text-dark mb-3">
                      <i className="bi bi-calendar-check text-primary me-2"></i>
                      Appointment Schedule
                    </h5>

                    <div className="mb-3">
                      <span className="text-secondary small d-block">Booking Reference ID</span>
                      <span className="badge bg-light text-dark border font-monospace px-3 py-2 rounded-pill fs-6">
                        {booking.bookingId || `BK-${(booking._id || "").slice(-6).toUpperCase()}`}
                      </span>
                    </div>

                    <div className="mb-3">
                      <span className="text-secondary small d-block">Service Date</span>
                      <strong className="text-dark fs-6">
                        {booking.bookingDate
                          ? new Date(booking.bookingDate).toLocaleDateString()
                          : "N/A"}
                      </strong>
                    </div>

                    <div className="mb-3">
                      <span className="text-secondary small d-block">Time Slot</span>
                      <strong className="text-dark">{booking.bookingTime || "N/A"}</strong>
                    </div>

                    <div className="pt-2 border-top">
                      <small className="text-muted">
                        Booked on {new Date(booking.createdAt).toLocaleDateString()}
                      </small>
                    </div>
                  </div>

                  {/* Assigned Mechanic Card */}
                  <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
                    <h5 className="fw-bold text-dark mb-3">
                      <i className="bi bi-person-gear text-primary me-2"></i>
                      Assigned Mechanic
                    </h5>

                    {booking.mechanic || booking.assignedMechanic ? (
                      <div>
                        {(() => {
                          const mech = booking.mechanic || booking.assignedMechanic;
                          return (
                            <>
                              <div className="d-flex align-items-center mb-3">
                                <div
                                  className="bg-info bg-opacity-10 text-info rounded-circle p-2 me-3 d-flex align-items-center justify-content-center"
                                  style={{ width: "42px", height: "42px" }}
                                >
                                  <i className="bi bi-person-check fs-5"></i>
                                </div>
                                <div>
                                  <strong className="text-dark d-block">
                                    {mech.name || "Assigned Technician"}
                                  </strong>
                                  <small className="text-muted">
                                    Certified Technician
                                  </small>
                                </div>
                              </div>

                              {mech.phone && (
                                <div className="small text-secondary mb-1">
                                  <i className="bi bi-telephone me-2 text-muted"></i>
                                  {mech.phone}
                                </div>
                              )}
                              {mech.email && (
                                <div className="small text-secondary">
                                  <i className="bi bi-envelope me-2 text-muted"></i>
                                  {mech.email}
                                </div>
                              )}
                            </>
                          );
                        })()}
                      </div>
                    ) : (
                      <div className="text-muted small">
                        <i className="bi bi-clock-history me-1"></i>
                        A mechanic will be assigned shortly by workshop dispatch.
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  {currentStatus !== "Cancelled" &&
                    currentStatus !== "Completed" &&
                    currentStatus !== "Ready for Pickup" && (
                      <button
                        type="button"
                        className="btn btn-outline-danger w-100 py-2 rounded-pill fw-semibold"
                        onClick={handleCancel}
                      >
                        <i className="bi bi-x-circle me-2"></i>
                        Cancel This Booking
                      </button>
                    )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default BookingDetails;