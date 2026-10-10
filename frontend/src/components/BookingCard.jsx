import React from "react";

function BookingCard({ booking, onView, onCancel }) {
  if (!booking) return null;

  // Extract service title safely
  const serviceName =
    booking.service?.name ||
    booking.serviceType ||
    booking.serviceName ||
    "Car Service";

  // Extract vehicle details safely
  const vehicleText =
    booking.vehicle && typeof booking.vehicle === "object"
      ? `${booking.vehicle.brand || ""} ${booking.vehicle.model || ""} (${booking.vehicle.vehicleNumber || booking.vehicleNumber || ""})`.trim()
      : booking.vehicleModel
      ? `${booking.vehicleModel} (${booking.vehicleNumber || ""})`
      : booking.vehicleName || "Vehicle";

  // Extract date & time safely
  const rawDate = booking.bookingDate || booking.date;
  const formattedDate = rawDate
    ? new Date(rawDate).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Not specified";

  const bookingTime = booking.bookingTime || booking.time || "Not specified";

  // Booking reference ID
  const displayId =
    booking.bookingId ||
    (booking._id || booking.id || "N/A").toString().slice(-6).toUpperCase();

  const status = booking.status || booking.serviceStatus || "Pending";

  const statusClasses = {
    Completed: "bg-success",
    "Ready for Pickup": "bg-success text-white",
    Cancelled: "bg-danger",
    Pending: "bg-warning text-dark",
    Confirmed: "bg-primary text-white",
    "In Service": "bg-info text-dark",
    "In Progress": "bg-info text-dark",
  };

  // 5 Stages for visual tracker per Requirement 12:
  // Booking Received → Confirmed → In Service → Completed → Ready for Pickup
  const trackerStages = [
    { label: "Received", match: ["Pending"] },
    { label: "Confirmed", match: ["Confirmed"] },
    { label: "In Service", match: ["In Service", "In Progress"] },
    { label: "Completed", match: ["Completed"] },
    { label: "Ready for Pickup", match: ["Ready for Pickup"] },
  ];

  const getStageIndex = (st) => {
    if (st === "Ready for Pickup") return 4;
    if (st === "Completed") return 3;
    if (st === "In Service" || st === "In Progress") return 2;
    if (st === "Confirmed") return 1;
    return 0; // Pending or default
  };

  const activeIndex = status === "Cancelled" ? -1 : getStageIndex(status);

  return (
    <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden bg-white">
      <div className="card-body p-4 d-flex flex-column">
        {/* Header */}
        <div className="d-flex align-items-center mb-3">
          <div
            className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center p-3"
            style={{ width: "50px", height: "50px" }}
          >
            <i className="bi bi-tools text-primary fs-5"></i>
          </div>

          <div className="ms-3 flex-grow-1">
            <h5 className="fw-bold text-dark mb-0 text-truncate" style={{ maxWidth: "200px" }}>
              {serviceName}
            </h5>
            <span className="badge bg-light text-secondary border font-monospace mt-1" style={{ fontSize: "11px" }}>
              ID: {displayId}
            </span>
          </div>

          <span
            className={`badge px-3 py-2 rounded-pill shadow-sm ${
              statusClasses[status] || "bg-primary"
            }`}
            style={{
              fontSize: "11px",
              backgroundColor: status === "Ready for Pickup" ? "#059669" : undefined,
            }}
          >
            {status}
          </span>
        </div>

        {/* Visual Status Tracker Bar per Requirement 12 */}
        {status !== "Cancelled" ? (
          <div className="bg-light p-2 rounded-3 my-2 border">
            <div className="d-flex justify-content-between text-center align-items-center position-relative">
              {trackerStages.map((stage, idx) => {
                const isPassed = idx < activeIndex;
                const isCurrent = idx === activeIndex;

                return (
                  <div key={stage.label} className="flex-grow-1" style={{ fontSize: "10px" }}>
                    <div
                      className={`rounded-circle mx-auto d-flex align-items-center justify-content-center mb-1 ${
                        isCurrent
                          ? "bg-primary text-white shadow-sm"
                          : isPassed
                          ? "bg-success text-white"
                          : "bg-white text-muted border"
                      }`}
                      style={{ width: "20px", height: "20px", fontSize: "10px" }}
                    >
                      {isPassed ? "✓" : idx + 1}
                    </div>
                    <span
                      className={`d-block text-truncate px-1 ${
                        isCurrent
                          ? "fw-bold text-primary"
                          : isPassed
                          ? "text-success fw-semibold"
                          : "text-muted"
                      }`}
                      style={{ fontSize: "9px" }}
                    >
                      {stage.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="alert alert-danger py-1 px-2 small mb-2 text-center rounded-3">
            <i className="bi bi-x-circle me-1"></i> Booking Cancelled
          </div>
        )}

        <hr className="my-2 border-light-subtle" />

        {/* Details */}
        <div className="py-2 flex-grow-1">
          <div className="mb-2 d-flex align-items-center text-secondary small">
            <i className="bi bi-car-front me-2 text-primary fs-6"></i>
            <span className="text-dark fw-medium text-truncate">{vehicleText}</span>
          </div>

          <div className="mb-2 d-flex align-items-center text-secondary small">
            <i className="bi bi-calendar-event me-2 text-primary fs-6"></i>
            <span>{formattedDate} at {bookingTime}</span>
          </div>

          {/* Assigned Mechanic */}
          <div className="mb-2 d-flex align-items-center text-secondary small">
            <i className="bi bi-person-gear me-2 text-info fs-6"></i>
            <span>
              Mechanic:{" "}
              {booking.mechanic && typeof booking.mechanic === "object" && booking.mechanic.name ? (
                <strong className="text-dark">{booking.mechanic.name}</strong>
              ) : booking.assignedMechanic && typeof booking.assignedMechanic === "object" && booking.assignedMechanic.name ? (
                <strong className="text-dark">{booking.assignedMechanic.name}</strong>
              ) : (
                <span className="text-muted fst-italic">Pending Assignment</span>
              )}
            </span>
          </div>

          {booking.mechanicNotes && (
            <div className="p-2 bg-light-subtle rounded border small text-secondary mt-2">
              <i className="bi bi-info-circle me-1 text-primary"></i>
              <strong>Note:</strong> {booking.mechanicNotes}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="d-flex gap-2 mt-3 pt-2 border-top">
          {onView && (
            <button
              type="button"
              className="btn btn-outline-primary btn-sm flex-grow-1 rounded-pill py-2 fw-semibold"
              onClick={() => onView(booking)}
            >
              <i className="bi bi-eye me-1"></i>
              Details &amp; Tracker
            </button>
          )}

          {onCancel && status !== "Cancelled" && status !== "Completed" && status !== "Ready for Pickup" && (
            <button
              type="button"
              className="btn btn-outline-danger btn-sm rounded-pill px-3 py-2 fw-semibold"
              onClick={() => onCancel(booking)}
              title="Cancel Booking"
            >
              <i className="bi bi-x-circle me-1"></i>
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookingCard;