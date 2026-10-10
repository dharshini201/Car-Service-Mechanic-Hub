import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { getAssignedBookingById } from "../../services/mechanicService";
import { getBookingById } from "../../services/bookingService";

function RequestDetails() {
  const { requestId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        setLoading(true);
        setError("");
        let res;
        try {
          res = await getAssignedBookingById(requestId);
        } catch {
          res = await getBookingById(requestId);
        }
        setBooking(res.booking || res.data);
      } catch (err) {
        console.error("Fetch request details error:", err);
        setError("Request not found or access denied.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [requestId]);

  const statusClasses = {
    Completed: "bg-success",
    Cancelled: "bg-danger",
    Pending: "bg-warning text-dark",
    "In Progress": "bg-info text-dark",
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
            <Link
              to="/mechanic/service-requests"
              className="text-decoration-none small text-secondary fw-semibold mb-2 d-inline-block"
            >
              <i className="bi bi-arrow-left me-1"></i> Back to Service Requests
            </Link>
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
              <div>
                <h2 className="fw-bold mb-1 text-dark">Service Job Details</h2>
                <p className="text-secondary mb-0">
                  Detailed inspection report and repair specifications.
                </p>
              </div>

              {booking && (
                <div className="d-flex gap-2">
                  <span
                    className={`badge px-4 py-2 rounded-pill shadow-sm fs-6 ${
                      statusClasses[booking.status] || "bg-secondary"
                    }`}
                  >
                    {booking.status}
                  </span>
                  <Link
                    to={`/mechanic/update-status/${booking._id || booking.id}`}
                    className="btn btn-primary rounded-pill px-4 fw-semibold shadow-sm"
                  >
                    <i className="bi bi-gear-wide-connected me-2"></i>
                    Update Status
                  </Link>
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

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
              <p className="mt-2 text-muted small">Loading job details...</p>
            </div>
          ) : !booking ? (
            <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
              <p className="text-muted mb-0">Job details could not be found.</p>
            </div>
          ) : (
            <div className="row g-4">
              {/* Left Column */}
              <div className="col-lg-8">
                {/* 1. SERVICE INFORMATION */}
                <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
                  <div className="d-flex align-items-center mb-3">
                    <div
                      className="bg-primary bg-opacity-10 text-primary rounded-circle p-3 me-3 d-flex align-items-center justify-content-center"
                      style={{ width: "52px", height: "52px" }}
                    >
                      <i className="bi bi-tools fs-4"></i>
                    </div>
                    <div>
                      <span className="text-secondary small fw-semibold text-uppercase tracking-wider">
                        Service Information
                      </span>
                      <h4 className="fw-bold text-dark mb-0">
                        {booking.service?.name || "Service Package"}
                      </h4>
                    </div>
                  </div>

                  <p className="text-secondary mb-3" style={{ lineHeight: "1.6" }}>
                    {booking.service?.description || "No description provided for this service."}
                  </p>

                  <div className="row g-3 p-3 rounded-3" style={{ backgroundColor: "#f8fafc" }}>
                    <div className="col-sm-6">
                      <span className="text-secondary small d-block">Price</span>
                      <strong className="fs-5 text-dark">
                        {booking.service?.price !== undefined ? `₹${booking.service.price}` : "N/A"}
                      </strong>
                    </div>
                    <div className="col-sm-6">
                      <span className="text-secondary small d-block">Duration</span>
                      <strong className="text-dark">
                        {booking.service?.duration || "1 - 2 Hours"}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* 2. VEHICLE INFORMATION */}
                <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
                  <h5 className="fw-bold text-dark mb-3">
                    <i className="bi bi-car-front text-primary me-2"></i>
                    Vehicle Information
                  </h5>

                  <div className="row g-3">
                    <div className="col-sm-6">
                      <span className="text-secondary small d-block">Brand</span>
                      <strong className="text-dark fs-6">
                        {booking.vehicle?.brand || "N/A"}
                      </strong>
                    </div>
                    <div className="col-sm-6">
                      <span className="text-secondary small d-block">Model</span>
                      <strong className="text-dark fs-6">
                        {booking.vehicle?.model || "N/A"}
                      </strong>
                    </div>
                    <div className="col-sm-6">
                      <span className="text-secondary small d-block">Vehicle Number</span>
                      <strong className="font-monospace text-primary fs-6">
                        {booking.vehicle?.vehicleNumber || "N/A"}
                      </strong>
                    </div>
                    <div className="col-sm-3 col-6">
                      <span className="text-secondary small d-block">Year</span>
                      <span className="text-dark fw-semibold">{booking.vehicle?.year || "N/A"}</span>
                    </div>
                    <div className="col-sm-3 col-6">
                      <span className="text-secondary small d-block">Fuel Type</span>
                      <span className="badge bg-light text-dark border">
                        {booking.vehicle?.fuelType || "Petrol"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3. BOOKING INFORMATION */}
                <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
                  <h5 className="fw-bold text-dark mb-3">
                    <i className="bi bi-calendar-check text-primary me-2"></i>
                    Booking Information
                  </h5>

                  <div className="row g-3 mb-3">
                    <div className="col-sm-6">
                      <span className="text-secondary small d-block">Date</span>
                      <strong className="text-dark">
                        {booking.bookingDate
                          ? new Date(booking.bookingDate).toLocaleDateString(undefined, {
                              weekday: "short",
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : "N/A"}
                      </strong>
                    </div>
                    <div className="col-sm-6">
                      <span className="text-secondary small d-block">Time</span>
                      <strong className="text-dark">{booking.bookingTime || "N/A"}</strong>
                    </div>
                    <div className="col-12">
                      <span className="text-secondary small d-block">Current Status</span>
                      <span
                        className={`badge px-3 py-2 rounded-pill mt-1 ${
                          statusClasses[booking.status] || "bg-primary"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-secondary small d-block mb-1">Customer Description</span>
                    <div className="p-3 rounded-3 bg-light text-secondary" style={{ lineHeight: "1.6" }}>
                      {booking.description || "No specific customer instructions provided."}
                    </div>
                  </div>

                  {booking.mechanicNotes && (
                    <div className="mt-3">
                      <span className="text-secondary small d-block mb-1">Mechanic Notes / Diagnosis</span>
                      <div className="p-3 rounded-3 bg-warning bg-opacity-10 border border-warning border-opacity-25 text-dark" style={{ lineHeight: "1.6" }}>
                        {booking.mechanicNotes}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column */}
              <div className="col-lg-4">
                {/* 4. CUSTOMER INFORMATION */}
                <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
                  <h5 className="fw-bold text-dark mb-3">
                    <i className="bi bi-person text-primary me-2"></i>
                    Customer Information
                  </h5>

                  <div className="mb-3">
                    <span className="text-secondary small d-block">Name</span>
                    <strong className="text-dark fs-6 d-block">
                      {booking.customer?.name || "Customer"}
                    </strong>
                  </div>

                  <div className="mb-3">
                    <span className="text-secondary small d-block">Email</span>
                    {booking.customer?.email ? (
                      <a href={`mailto:${booking.customer.email}`} className="text-decoration-none text-primary">
                        <i className="bi bi-envelope me-1"></i>
                        {booking.customer.email}
                      </a>
                    ) : (
                      <span className="text-muted">N/A</span>
                    )}
                  </div>

                  <div>
                    <span className="text-secondary small d-block">Phone</span>
                    {booking.customer?.phone ? (
                      <a href={`tel:${booking.customer.phone}`} className="text-decoration-none text-dark fw-semibold">
                        <i className="bi bi-telephone me-1 text-primary"></i>
                        {booking.customer.phone}
                      </a>
                    ) : (
                      <span className="text-muted">N/A</span>
                    )}
                  </div>
                </div>

                {/* 5. MECHANIC INFORMATION */}
                <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
                  <h5 className="fw-bold text-dark mb-3">
                    <i className="bi bi-person-gear text-primary me-2"></i>
                    Mechanic Information
                  </h5>

                  <div className="mb-3">
                    <span className="text-secondary small d-block">Mechanic Name</span>
                    <strong className="text-dark fs-6 d-block">
                      {booking.mechanic?.name || "Assigned Technician"}
                    </strong>
                  </div>

                  <div>
                    <span className="text-secondary small d-block">Contact Phone</span>
                    <strong className="text-dark fs-6 d-block">
                      {booking.mechanic?.phone || "Workshop Support"}
                    </strong>
                  </div>
                </div>

                {/* Status Update Action Box */}
                <div className="p-3 rounded-4 bg-primary bg-opacity-10 text-center">
                  <Link
                    to={`/mechanic/update-status/${booking._id || booking.id}`}
                    className="btn btn-primary w-100 rounded-pill py-2 fw-semibold shadow-sm"
                  >
                    <i className="bi bi-wrench me-2"></i>
                    Update Service Status
                  </Link>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default RequestDetails;