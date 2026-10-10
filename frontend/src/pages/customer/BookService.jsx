import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { getVehicles } from "../../services/vehicleService";
import { getServices } from "../../services/serviceService";
import { createBooking } from "../../services/bookingService";

function BookService() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedServiceId = searchParams.get("serviceId") || "";

  const [vehicles, setVehicles] = useState([]);
  const [services, setServices] = useState([]);

  const [formData, setFormData] = useState({
    vehicle: "",
    service: preselectedServiceId,
    bookingDate: "",
    bookingTime: "09:00 AM",
    description: "",
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const [vehiclesRes, servicesRes] = await Promise.all([
          getVehicles(),
          getServices(),
        ]);

        const userVehicles = vehiclesRes.vehicles || [];
        const availableServices = servicesRes.services || [];

        setVehicles(userVehicles);
        setServices(availableServices);

        // Pre-select first vehicle if available and none selected
        if (userVehicles.length > 0 && !formData.vehicle) {
          setFormData((prev) => ({
            ...prev,
            vehicle: userVehicles[0]._id || userVehicles[0].id,
          }));
        }

        // If preselectedServiceId was given and exists, select it
        if (preselectedServiceId) {
          setFormData((prev) => ({
            ...prev,
            service: preselectedServiceId,
          }));
        } else if (availableServices.length > 0 && !formData.service) {
          setFormData((prev) => ({
            ...prev,
            service: availableServices[0]._id || availableServices[0].id,
          }));
        }
      } catch (err) {
        console.error("Load booking requirements error:", err);
        setError("Unable to load vehicles or services. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [preselectedServiceId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.vehicle) {
      setError("Please select a registered vehicle.");
      return;
    }

    if (!formData.service) {
      setError("Please select a service package.");
      return;
    }

    if (!formData.bookingDate) {
      setError("Please pick a preferred service date.");
      return;
    }

    if (!formData.bookingTime) {
      setError("Please pick a preferred time slot.");
      return;
    }

    try {
      setSubmitting(true);

      const res = await createBooking({
        vehicle: formData.vehicle,
        service: formData.service,
        bookingDate: formData.bookingDate,
        bookingTime: formData.bookingTime,
        description: formData.description.trim(),
      });

      if (res.success) {
        setSuccess("Service booking submitted successfully! Status: Pending");
        setTimeout(() => {
          navigate("/customer/bookings");
        }, 900);
      }
    } catch (err) {
      console.error("Create booking error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to submit booking. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Get tomorrow's date as min date for booking
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const selectedServiceObj = services.find(
    (s) => (s._id || s.id) === formData.service
  );

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
            <h2 className="fw-bold mb-1 text-dark">Book a Car Service</h2>
            <p className="text-secondary mb-0">
              Schedule certified maintenance with our expert automotive technicians.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
              <p className="mt-2 text-muted small">Loading booking options...</p>
            </div>
          ) : (
            <div className="row g-4">
              {/* Form Column */}
              <div className="col-lg-8">
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

                  {vehicles.length === 0 ? (
                    <div className="text-center py-4">
                      <i className="bi bi-car-front text-warning" style={{ fontSize: "50px" }}></i>
                      <h5 className="fw-bold mt-3 text-dark">No Vehicle Registered</h5>
                      <p className="text-secondary small mb-3">
                        You need at least one registered vehicle to schedule a service booking.
                      </p>
                      <Link
                        to="/customer/add-vehicle"
                        className="btn btn-primary rounded-pill px-4 fw-semibold"
                      >
                        <i className="bi bi-plus-circle me-2"></i>
                        Register Vehicle First
                      </Link>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit}>
                      {/* Step 1: Vehicle Selection */}
                      <div className="mb-4">
                        <label className="form-label fw-semibold text-dark">
                          1. Select Your Vehicle <span className="text-danger">*</span>
                        </label>
                        <select
                          name="vehicle"
                          className="form-select bg-light py-2"
                          value={formData.vehicle}
                          onChange={handleChange}
                          required
                        >
                          <option value="">-- Choose registered vehicle --</option>
                          {vehicles.map((v) => (
                            <option key={v._id || v.id} value={v._id || v.id}>
                              {v.brand} {v.model} ({v.vehicleNumber}) - {v.fuelType}
                            </option>
                          ))}
                        </select>
                        <div className="form-text small">
                          Want to use a different car?{" "}
                          <Link to="/customer/add-vehicle" className="text-primary text-decoration-none">
                            Add another vehicle
                          </Link>
                        </div>
                      </div>

                      {/* Step 2: Service Selection */}
                      <div className="mb-4">
                        <label className="form-label fw-semibold text-dark">
                          2. Select Service Package <span className="text-danger">*</span>
                        </label>
                        <select
                          name="service"
                          className="form-select bg-light py-2"
                          value={formData.service}
                          onChange={handleChange}
                          required
                        >
                          <option value="">-- Choose car service --</option>
                          {services.map((s) => (
                            <option key={s._id || s.id} value={s._id || s.id}>
                              {s.name} - ₹{s.price} ({s.duration})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Step 3: Date & Time */}
                      <div className="row g-3 mb-4">
                        <div className="col-md-6">
                          <label className="form-label fw-semibold text-dark">
                            3. Preferred Date <span className="text-danger">*</span>
                          </label>
                          <input
                            type="date"
                            name="bookingDate"
                            className="form-control bg-light py-2"
                            min={getMinDate()}
                            value={formData.bookingDate}
                            onChange={handleChange}
                            required
                          />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label fw-semibold text-dark">
                            4. Preferred Time Slot <span className="text-danger">*</span>
                          </label>
                          <select
                            name="bookingTime"
                            className="form-select bg-light py-2"
                            value={formData.bookingTime}
                            onChange={handleChange}
                            required
                          >
                            <option value="09:00 AM">09:00 AM - 10:30 AM</option>
                            <option value="11:00 AM">11:00 AM - 12:30 PM</option>
                            <option value="02:00 PM">02:00 PM - 03:30 PM</option>
                            <option value="04:00 PM">04:00 PM - 05:30 PM</option>
                          </select>
                        </div>
                      </div>

                      {/* Step 4: Description / Notes */}
                      <div className="mb-4">
                        <label className="form-label fw-semibold text-dark">
                          5. Additional Service Notes / Symptoms (Optional)
                        </label>
                        <textarea
                          name="description"
                          className="form-control bg-light"
                          rows="3"
                          placeholder="Describe any particular noise, warning light, vibrations, or instructions for the mechanic..."
                          value={formData.description}
                          onChange={handleChange}
                        ></textarea>
                      </div>

                      {/* Submit */}
                      <button
                        type="submit"
                        className="btn btn-primary w-100 py-3 rounded-pill fw-bold shadow-sm"
                        disabled={submitting}
                      >
                        {submitting ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                            ></span>
                            Confirming Booking...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-calendar-check-fill me-2"></i>
                            Confirm & Submit Booking
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </div>

              {/* Service Summary Card Column */}
              <div className="col-lg-4">
                <div className="card border-0 shadow-sm rounded-4 p-4 bg-white sticky-top" style={{ top: "90px" }}>
                  <h5 className="fw-bold text-dark mb-3">Booking Summary</h5>

                  {selectedServiceObj ? (
                    <div>
                      <div className="p-3 mb-3 rounded-3" style={{ backgroundColor: "#f8fafc" }}>
                        <h6 className="fw-bold text-primary mb-1">{selectedServiceObj.name}</h6>
                        <p className="text-muted small mb-2">{selectedServiceObj.description}</p>
                        <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                          <span className="text-secondary small">Service Price:</span>
                          <span className="fs-5 fw-bold text-dark">₹{selectedServiceObj.price}</span>
                        </div>
                        <div className="d-flex justify-content-between align-items-center mt-1">
                          <span className="text-secondary small">Est. Duration:</span>
                          <span className="badge bg-light text-dark border">{selectedServiceObj.duration}</span>
                        </div>
                      </div>

                      <ul className="list-unstyled small text-secondary mb-3">
                        <li className="mb-2">
                          <i className="bi bi-shield-check text-success me-2"></i>
                          Certified Automotive Technicians
                        </li>
                        <li className="mb-2">
                          <i className="bi bi-check2 text-success me-2"></i>
                          Genuine OEM / OEM-Grade Parts
                        </li>
                        <li className="mb-2">
                          <i className="bi bi-bell text-success me-2"></i>
                          Real-time Status Notifications
                        </li>
                      </ul>
                    </div>
                  ) : (
                    <p className="text-muted small">
                      Select a service from the dropdown to see price and duration details.
                    </p>
                  )}

                  <div className="alert alert-info py-2 px-3 small mb-0 rounded-3">
                    <i className="bi bi-info-circle me-1"></i>
                    Initial status will be <strong>Pending</strong> until confirmed or assigned to a mechanic.
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

export default BookService;