import React, { useState } from "react";
import api from "../services/api";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // ================= HANDLE CHANGE =================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  // ================= HANDLE SUBMIT =================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Validation
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.subject.trim() ||
      !formData.message.trim()
    ) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/contact", {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
      });

      const result = response.data;

      console.log("Contact Response:", result);

      setSuccess(
        result.message ||
          "Your message has been sent successfully."
      );

      // Clear form after successful submission
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      console.error("Contact Error:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to send your message. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">

      {/* ================= HEADER ================= */}

      <div className="text-center mb-5">
        <h2 className="fw-bold">
          Contact Us
        </h2>

        <p className="text-muted">
          Get in touch with our Car Service Mechanic Hub team.
        </p>
      </div>

      <div className="row g-5">

        {/* ================= CONTACT INFORMATION ================= */}

        <div className="col-lg-5">

          <div className="mb-4">

            <h5 className="fw-bold">
              Contact Information
            </h5>

            <p className="text-muted">
              Have questions about our car services?
              Contact us and our team will help you.
            </p>

          </div>

          {/* Address */}

          <div className="d-flex mb-4">

            <div className="text-primary fs-3 me-3">
              <i className="bi bi-geo-alt-fill"></i>
            </div>

            <div>
              <h6 className="fw-bold mb-1">
                Address
              </h6>

              <p className="text-muted mb-0">
                123 Service Road,
                <br />
                Chennai, Tamil Nadu
              </p>
            </div>

          </div>

          {/* Phone */}

          <div className="d-flex mb-4">

            <div className="text-primary fs-3 me-3">
              <i className="bi bi-telephone-fill"></i>
            </div>

            <div>
              <h6 className="fw-bold mb-1">
                Phone
              </h6>

              <p className="text-muted mb-0">
                +91 9360084723
              </p>
            </div>

          </div>

          {/* Email */}

          <div className="d-flex mb-4">

            <div className="text-primary fs-3 me-3">
              <i className="bi bi-envelope-fill"></i>
            </div>

            <div>
              <h6 className="fw-bold mb-1">
                Email
              </h6>

              <p className="text-muted mb-0">
                support@carservicehub.com
              </p>
            </div>

          </div>

          {/* Working Hours */}

          <div className="d-flex mb-4">

            <div className="text-primary fs-3 me-3">
              <i className="bi bi-clock-fill"></i>
            </div>

            <div>
              <h6 className="fw-bold mb-1">
                Working Hours
              </h6>

              <p className="text-muted mb-0">
                Monday - Saturday
                <br />
                9:00 AM - 7:00 PM
              </p>
            </div>

          </div>

          {/* Social Media */}

          <div>

            <h6 className="fw-bold mb-3">
              Follow Us
            </h6>

            <div className="d-flex gap-3">

              <button
                type="button"
                className="btn btn-outline-primary rounded-circle"
              >
                <i className="bi bi-facebook"></i>
              </button>

              <button
                type="button"
                className="btn btn-outline-primary rounded-circle"
              >
                <i className="bi bi-instagram"></i>
              </button>

              <button
                type="button"
                className="btn btn-outline-primary rounded-circle"
              >
                <i className="bi bi-whatsapp"></i>
              </button>

            </div>

          </div>

        </div>

        {/* ================= CONTACT FORM ================= */}

        <div className="col-lg-7">

          <div className="card border-0 shadow-sm">

            <div className="card-body p-4 p-md-5">

              <h3 className="fw-bold mb-2">
                Send Us a Message
              </h3>

              <p className="text-muted mb-4">
                Have a question? Fill out the form and
                our team will get back to you.
              </p>

              {/* Success Message */}

              {success && (
                <div
                  className="alert alert-success"
                  role="alert"
                >
                  <i className="bi bi-check-circle me-2"></i>
                  {success}
                </div>
              )}

              {/* Error Message */}

              {error && (
                <div
                  className="alert alert-danger"
                  role="alert"
                >
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {error}
                </div>
              )}

              {/* Form */}

              <form onSubmit={handleSubmit}>

                {/* Name + Email */}

                <div className="row">

                  {/* Name */}

                  <div className="col-md-6 mb-3">

                    <label
                      htmlFor="name"
                      className="form-label fw-semibold"
                    >
                      Your Name
                    </label>

                    <input
                      id="name"
                      type="text"
                      name="name"
                      className="form-control"
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={loading}
                    />

                  </div>

                  {/* Email */}

                  <div className="col-md-6 mb-3">

                    <label
                      htmlFor="email"
                      className="form-label fw-semibold"
                    >
                      Email Address
                    </label>

                    <input
                      id="email"
                      type="email"
                      name="email"
                      className="form-control"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={loading}
                    />

                  </div>

                </div>

                {/* Phone */}

                <div className="mb-3">

                  <label
                    htmlFor="phone"
                    className="form-label fw-semibold"
                  >
                    Phone Number
                  </label>

                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    className="form-control"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={loading}
                  />

                </div>

                {/* Subject */}

                <div className="mb-3">

                  <label
                    htmlFor="subject"
                    className="form-label fw-semibold"
                  >
                    Subject
                  </label>

                  <input
                    id="subject"
                    type="text"
                    name="subject"
                    className="form-control"
                    placeholder="Enter subject"
                    value={formData.subject}
                    onChange={handleChange}
                    disabled={loading}
                  />

                </div>

                {/* Message */}

                <div className="mb-4">

                  <label
                    htmlFor="message"
                    className="form-label fw-semibold"
                  >
                    Message
                  </label>

                  <textarea
                    id="message"
                    name="message"
                    className="form-control"
                    rows="6"
                    placeholder="Write your message"
                    value={formData.message}
                    onChange={handleChange}
                    disabled={loading}
                  ></textarea>

                </div>

                {/* Submit Button */}

                <button
                  type="submit"
                  className="btn btn-primary px-4 py-2"
                  disabled={loading}
                >

                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>

                      Sending...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-send me-2"></i>
                      Send Message
                    </>
                  )}

                </button>

              </form>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Contact;