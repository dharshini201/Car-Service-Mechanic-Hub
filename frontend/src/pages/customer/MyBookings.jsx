import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import BookingCard from "../../components/BookingCard";
import { getBookings, cancelBooking } from "../../services/bookingService";

function MyBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getBookings();
      setBookings(res.bookings || []);
    } catch (err) {
      console.error("Fetch bookings error:", err);
      setError("Failed to load your bookings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleCancel = async (booking) => {
    const id = booking._id || booking.id;
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmCancel) return;

    try {
      await cancelBooking(id);
      setSuccess("Booking cancelled successfully.");
      loadBookings();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel booking.");
    }
  };

  const handleView = (booking) => {
    navigate(`/customer/booking/${booking._id || booking.id}`);
  };

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === "All") return true;
    if (activeTab === "In Progress") {
      return ["In Progress", "In Service", "Confirmed"].includes(b.status);
    }
    if (activeTab === "Completed") {
      return ["Completed", "Ready for Pickup"].includes(b.status);
    }
    return b.status === activeTab;
  });

  const tabs = ["All", "Pending", "In Progress", "Completed", "Cancelled"];

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-3 col-lg-2 px-0">
          <Sidebar role="customer" />
        </div>

        {/* Main Content */}
        <main className="col-md-9 col-lg-10 py-4 px-4 bg-light min-vh-100">
          {/* Header */}
          <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
            <div>
              <h2 className="fw-bold mb-1 text-dark">My Bookings</h2>
              <p className="text-secondary mb-0">
                Track status updates and manage your service appointments.
              </p>
            </div>
            <Link
              to="/customer/book-service"
              className="btn btn-primary rounded-pill px-4 py-2 fw-semibold shadow-sm"
            >
              <i className="bi bi-plus-circle me-2"></i>
              Book New Service
            </Link>
          </div>

          {/* Feedback */}
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

          {/* Filter Tabs */}
          <div className="d-flex flex-wrap gap-2 mb-4">
            {tabs.map((tab) => {
              const count =
                tab === "All"
                  ? bookings.length
                  : bookings.filter((b) => b.status === tab).length;

              return (
                <button
                  key={tab}
                  type="button"
                  className={`btn btn-sm rounded-pill px-3 py-2 fw-semibold transition-all ${
                    activeTab === tab
                      ? "btn-primary shadow-sm"
                      : "btn-white bg-white text-secondary border"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                  <span
                    className={`badge ms-2 rounded-pill ${
                      activeTab === tab ? "bg-white text-primary" : "bg-light text-secondary"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Content */}
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
              <p className="mt-2 text-muted small">Loading bookings from server...</p>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
              <i className="bi bi-calendar-x text-muted" style={{ fontSize: "65px" }}></i>
              <h4 className="fw-bold mt-3 text-dark">No {activeTab !== "All" ? activeTab : ""} Bookings Found</h4>
              <p className="text-secondary small mb-4">
                {activeTab === "All"
                  ? "You don't have any bookings yet. Book a service to keep your vehicle running smoothly."
                  : `There are currently no bookings with status "${activeTab}".`}
              </p>
              <div>
                <Link
                  to="/customer/book-service"
                  className="btn btn-primary rounded-pill px-4 py-2 fw-semibold"
                >
                  Book a Service
                </Link>
              </div>
            </div>
          ) : (
            <div className="row g-4">
              {filteredBookings.map((booking) => (
                <div className="col-md-6 col-lg-4" key={booking._id || booking.id}>
                  <BookingCard
                    booking={booking}
                    onView={handleView}
                    onCancel={handleCancel}
                  />
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default MyBookings;