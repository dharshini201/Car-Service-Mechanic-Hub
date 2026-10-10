import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { getAssignedBookingById, updateServiceStatus } from "../../services/mechanicService";

function UpdateServiceStatus() {
  const { serviceId } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [status, setStatus] = useState("Pending");
  const [mechanicNotes, setMechanicNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const steps = [
    "Pending",
    "Confirmed",
    "In Service",
    "Completed",
    "Ready for Pickup",
  ];

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await getAssignedBookingById(serviceId);
        const b = res.booking || res.data;
        if (b) {
          setBooking(b);
          setStatus(b.status || b.serviceStatus || "Pending");
          setMechanicNotes(b.mechanicNotes || "");
        }
      } catch (err) {
        console.error("Fetch booking error:", err);
        setError("Job details could not be loaded or access denied.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [serviceId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!status) {
      setError("Please select a status.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await updateServiceStatus(serviceId, {
        status,
        mechanicNotes: mechanicNotes.trim(),
      });

      if (res.success) {
        setSuccess(`Service status updated to "${status}" successfully! Customer has been emailed.`);
        setTimeout(() => {
          navigate("/mechanic/dashboard");
        }, 1200);
      }
    } catch (err) {
      console.error("Update service status error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to update status. Please verify permissions."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const currentStepIndex = steps.indexOf(status) !== -1 ? steps.indexOf(status) : 0;

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
            <Link
              to="/mechanic/dashboard"
              className="text-decoration-none small text-secondary fw-semibold mb-2 d-inline-block"
            >
              &larr; Back to Mechanic Dashboard
            </Link>
            <h2 className="fw-bold mb-1 text-dark">Update Service Status</h2>
            <p className="text-secondary mb-0">
              Advance service milestones: Pending &rarr; Confirmed &rarr; In Service &rarr; Completed &rarr; Ready for Pickup.
            </p>
          </div>

          <div className="row justify-content-center">
            <div className="col-lg-9">
              {/* Stepper Header */}
              <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
                <h6 className="fw-bold text-dark text-uppercase small mb-3 tracking-wide">
                  Service Progress Milestone Tracker
                </h6>
                <div className="d-flex flex-wrap justify-content-between align-items-center position-relative">
                  {steps.map((st, idx) => {
                    const isCompleted = idx < currentStepIndex;
                    const isCurrent = idx === currentStepIndex;

                    return (
                      <div
                        key={st}
                        className="text-center flex-grow-1 p-2"
                        style={{ minWidth: "100px" }}
                      >
                        <div
                          className={`rounded-circle mx-auto d-flex align-items-center justify-content-center fw-bold shadow-sm mb-2 ${
                            isCompleted
                              ? "bg-success text-white"
                              : isCurrent
                              ? "bg-primary text-white"
                              : "bg-light text-muted border"
                          }`}
                          style={{ width: "38px", height: "38px", fontSize: "14px" }}
                        >
                          {isCompleted ? <i className="bi bi-check-lg"></i> : idx + 1}
                        </div>
                        <span
                          className={`small d-block ${
                            isCurrent
                              ? "fw-bold text-primary"
                              : isCompleted
                              ? "fw-semibold text-success"
                              : "text-muted"
                          }`}
                          style={{ fontSize: "12px" }}
                        >
                          {st}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Job Details Card */}
              {booking && (
                <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
                  <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 border-bottom pb-3 mb-3">
                    <div>
                      <span className="badge bg-light text-secondary border small mb-1">
                        JOB REF: #{booking.bookingId || serviceId.slice(-6).toUpperCase()}
                      </span>
                      <h4 className="fw-bold text-dark mb-0">
                        {booking.service?.name || booking.serviceType}
                      </h4>
                    </div>

                    <div>
                      <span className="badge bg-primary px-3 py-2 rounded-pill fs-6">
                        Current: {booking.status}
                      </span>
                    </div>
                  </div>

                  <div className="row g-3 small">
                    <div className="col-md-4">
                      <span className="text-muted d-block">Customer</span>
                      <strong className="text-dark d-block">{booking.customer?.name}</strong>
                      <span className="text-secondary">{booking.customer?.phone}</span>
                      <div className="text-secondary">{booking.customer?.email}</div>
                    </div>

                    <div className="col-md-4">
                      <span className="text-muted d-block">Vehicle</span>
                      <strong className="text-dark d-block">
                        {booking.vehicle?.brand} {booking.vehicle?.model}
                      </strong>
                      <span className="badge bg-dark bg-opacity-10 text-dark font-monospace">
                        {booking.vehicle?.vehicleNumber || booking.vehicleNumber}
                      </span>
                      <div className="text-muted mt-1">Fuel: {booking.vehicle?.fuelType || "Petrol"}</div>
                    </div>

                    <div className="col-md-4">
                      <span className="text-muted d-block">Appointment Schedule</span>
                      <strong className="text-dark d-block">
                        {new Date(booking.bookingDate).toLocaleDateString()}
                      </strong>
                      <span className="text-secondary">Time: {booking.bookingTime}</span>
                      {booking.description && (
                        <div className="text-danger mt-1">
                          Issue: {booking.description}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Status Update Form */}
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
                    <p className="mt-2 text-muted small">Loading job information...</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    {/* Status Selection */}
                    <div className="mb-4">
                      <label className="form-label fw-semibold text-dark">
                        Select New Service Status <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select bg-light py-2"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        required
                      >
                        <option value="Pending">Pending (Awaiting Service)</option>
                        <option value="In Progress">In Progress (Work Underway)</option>
                        <option value="Completed">Completed (Service Finished &amp; Archived)</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Ready for Pickup">Ready for Pickup</option>
                      </select>
                      <small className="text-muted mt-1 d-block">
                        Normal Mechanic Workflow: Pending &rarr; In Progress &rarr; Completed
                      </small>
                    </div>

                    {/* Completed Highlight Box */}
                    {status === "Completed" && (
                      <div className="alert alert-success rounded-4 p-3 mb-4 border-success d-flex align-items-start gap-3">
                        <i className="bi bi-check-circle-fill fs-2 text-success mt-1"></i>
                        <div>
                          <h6 className="fw-bold mb-1 text-success">
                            Service Completion &amp; History Archive
                          </h6>
                          <p className="small mb-0 text-dark">
                            Marking status as <strong>Completed</strong> will automatically create a permanent <strong>Service History</strong> record for this vehicle and send a completion email to <strong>{booking?.customer?.email || "the customer"}</strong>.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Section 5 Highlight Box: Ready for Pickup */}
                    {status === "Ready for Pickup" && (
                      <div className="alert alert-info rounded-4 p-3 mb-4 border-info d-flex align-items-start gap-3">
                        <i className="bi bi-car-front-fill fs-2 text-info mt-1"></i>
                        <div>
                          <h6 className="fw-bold mb-1 text-info">
                            Ready for Pickup
                          </h6>
                          <p className="small mb-0 text-dark">
                            Informs <strong>{booking?.customer?.email || "the customer"}</strong> that their vehicle is ready for collection at the hub.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Mechanic Notes */}
                    <div className="mb-4">
                      <label className="form-label fw-semibold text-dark">
                        Technician Notes &amp; Repair Findings
                      </label>
                      <textarea
                        className="form-control bg-light"
                        rows="4"
                        placeholder="Add inspection findings, parts replaced, brake pad wear percentage, fluid levels, or recommendations..."
                        value={mechanicNotes}
                        onChange={(e) => setMechanicNotes(e.target.value)}
                      ></textarea>
                    </div>

                    <div className="d-flex gap-2">
                      <button
                        type="submit"
                        className="btn btn-primary px-4 py-2 rounded-pill fw-semibold shadow-sm"
                        disabled={submitting}
                      >
                        {submitting ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Updating &amp; Sending Notification...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-check2-circle me-2"></i>
                            Save &amp; Notify Customer
                          </>
                        )}
                      </button>

                      <Link
                        to="/mechanic/dashboard"
                        className="btn btn-outline-secondary px-4 py-2 rounded-pill"
                      >
                        Cancel
                      </Link>
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

export default UpdateServiceStatus;