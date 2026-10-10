import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import {
  getServices,
  addService,
  updateService,
  deleteService,
  getCategories,
} from "../../services/serviceService";

function ManageServices() {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("All");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const initialForm = {
    name: "",
    description: "",
    price: 1500,
    duration: "1-2 Hours",
    category: "",
    icon: "bi-tools",
    isActive: true,
  };
  const [formData, setFormData] = useState(initialForm);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");
      const [servicesRes, catRes] = await Promise.all([
        getServices(),
        getCategories().catch(() => ({ categories: [] })),
      ]);

      const sList = servicesRes?.services || (Array.isArray(servicesRes) ? servicesRes : []);
      setServices(sList);

      const cList = catRes?.categories || (Array.isArray(catRes) ? catRes : []);
      setCategories(cList);
    } catch (err) {
      console.error("Fetch Services Error:", err);
      setError(err?.response?.data?.message || err.message || "Failed to load services.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenAdd = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({
      ...initialForm,
      category: categories[0]?._id || "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (srv) => {
    setIsEditing(true);
    setEditingId(srv._id);
    setFormData({
      name: srv.name || "",
      description: srv.description || "",
      price: srv.price || 0,
      duration: srv.duration || "1-2 Hours",
      category: srv.category?._id || srv.category || "",
      icon: srv.icon || "bi-tools",
      isActive: srv.isActive !== false,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData(initialForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError("");

      const payload = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        duration: formData.duration,
        category: formData.category || null,
        icon: formData.icon,
        isActive: formData.isActive,
      };

      if (isEditing) {
        await updateService(editingId, payload);
        setSuccessMsg("Service package updated successfully!");
      } else {
        await addService(payload);
        setSuccessMsg("New service offering added successfully!");
      }

      setTimeout(() => setSuccessMsg(""), 4000);
      handleCloseModal();
      await fetchData();
    } catch (err) {
      console.error("Save Service Error:", err);
      setError(err?.response?.data?.message || err.message || "Failed to save service.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      setError("");
      await deleteService(id);
      setSuccessMsg("Service package deleted successfully.");
      setTimeout(() => setSuccessMsg(""), 4000);
      await fetchData();
    } catch (err) {
      console.error("Delete Service Error:", err);
      setError(err?.response?.data?.message || err.message || "Failed to delete service.");
    }
  };

  const handleToggleStatus = async (srv) => {
    try {
      setError("");
      const newStatus = !srv.isActive;
      await updateService(srv._id, { isActive: newStatus });
      setSuccessMsg(`Service ${newStatus ? "Activated" : "Deactivated"}.`);
      setTimeout(() => setSuccessMsg(""), 3000);
      await fetchData();
    } catch (err) {
      console.error("Toggle Status Error:", err);
      setError(err?.response?.data?.message || err.message || "Failed to update service status.");
    }
  };

  const filteredServices = services.filter((srv) => {
    const q = searchTerm.toLowerCase();
    const matchesQuery =
      (srv.name || "").toLowerCase().includes(q) ||
      (srv.description || "").toLowerCase().includes(q);

    const catId = srv.category?._id || srv.category;
    const matchesCat =
      selectedCategoryFilter === "All" || catId === selectedCategoryFilter;

    return matchesQuery && matchesCat;
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
                  Catalog Management
                </span>
                <h2 className="fw-bold mb-1" style={{ color: "#0f172a" }}>
                  Manage Services
                </h2>
                <p className="text-muted mb-0">
                  Configure packages, labor pricing, estimated durations, and category tags.
                </p>
              </div>

              <div className="d-flex gap-2">
                <button
                  type="button"
                  className="btn btn-danger d-flex align-items-center gap-2"
                  onClick={handleOpenAdd}
                >
                  <i className="bi bi-plus-circle-fill"></i> Add New Service
                </button>
                <Link to="/admin/dashboard" className="btn btn-outline-dark">
                  <i className="bi bi-arrow-left me-1"></i> Dashboard
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

            {/* Metrics */}
            <div className="row g-3 mb-4">
              <div className="col-md-4">
                <div className="card border-0 shadow-sm p-3 bg-white rounded-3">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <small className="text-muted text-uppercase fw-semibold">Total Services</small>
                      <h3 className="fw-bold mb-0 text-dark mt-1">{services.length}</h3>
                    </div>
                    <div className="p-3 bg-primary-subtle text-primary rounded-circle">
                      <i className="bi bi-gear-wide-connected fs-4"></i>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card border-0 shadow-sm p-3 bg-white rounded-3">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <small className="text-muted text-uppercase fw-semibold">Active Offerings</small>
                      <h3 className="fw-bold mb-0 text-success mt-1">
                        {services.filter((s) => s.isActive !== false).length}
                      </h3>
                    </div>
                    <div className="p-3 bg-success-subtle text-success rounded-circle">
                      <i className="bi bi-check2-circle fs-4"></i>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card border-0 shadow-sm p-3 bg-white rounded-3">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <small className="text-muted text-uppercase fw-semibold">Categories</small>
                      <h3 className="fw-bold mb-0 text-danger mt-1">{categories.length}</h3>
                    </div>
                    <div className="p-3 bg-danger-subtle text-danger rounded-circle">
                      <i className="bi bi-tags-fill fs-4"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Filter & Search */}
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
                        placeholder="Search services by title or description..."
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
                    <select
                      className="form-select form-select-sm"
                      style={{ maxWidth: "240px" }}
                      value={selectedCategoryFilter}
                      onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                    >
                      <option value="All">All Categories ({categories.length})</option>
                      {categories.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Services Table */}
            {loading ? (
              <div className="card border-0 shadow-sm text-center py-5">
                <div className="spinner-border text-danger mx-auto mb-3" role="status"></div>
                <p className="text-muted mb-0">Loading service catalog...</p>
              </div>
            ) : filteredServices.length === 0 ? (
              <div className="card border-0 shadow-sm text-center py-5">
                <i className="bi bi-gear text-muted" style={{ fontSize: "64px" }}></i>
                <h5 className="fw-bold mt-3">No Services Found</h5>
                <p className="text-muted">No services match your criteria. Click "Add New Service" to create one.</p>
              </div>
            ) : (
              <div className="card border-0 shadow-sm">
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-dark">
                      <tr>
                        <th style={{ width: "60px" }}>#</th>
                        <th>Service Package</th>
                        <th>Category</th>
                        <th>Price (INR)</th>
                        <th>Est. Duration</th>
                        <th>Status</th>
                        <th className="text-end" style={{ minWidth: "120px" }}>
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredServices.map((srv, idx) => {
                        const catName = srv.category?.name || "Standard";
                        const isActive = srv.isActive !== false;
                        return (
                          <tr key={srv._id || idx}>
                            <td className="text-muted fw-semibold">{idx + 1}</td>

                            {/* Service */}
                            <td>
                              <div className="d-flex align-items-center gap-3">
                                <div
                                  className="bg-danger text-white rounded-circle d-flex align-items-center justify-content-center"
                                  style={{ width: "40px", height: "40px" }}
                                >
                                  <i className={`bi ${srv.icon || "bi-tools"} fs-5`}></i>
                                </div>
                                <div>
                                  <div className="fw-bold text-dark">{srv.name}</div>
                                  <small className="text-muted text-truncate d-inline-block" style={{ maxWidth: "300px" }}>
                                    {srv.description}
                                  </small>
                                </div>
                              </div>
                            </td>

                            {/* Category */}
                            <td>
                              <span className="badge bg-secondary-subtle text-secondary border">
                                {catName}
                              </span>
                            </td>

                            {/* Price */}
                            <td>
                              <span className="fw-bold text-success fs-6">
                                ₹{srv.price?.toLocaleString()}
                              </span>
                            </td>

                            {/* Duration */}
                            <td>
                              <span className="text-muted">
                                <i className="bi bi-clock me-1"></i>
                                {srv.duration}
                              </span>
                            </td>

                            {/* Status */}
                            <td>
                              <button
                                type="button"
                                className={`btn btn-sm ${
                                  isActive ? "btn-outline-success" : "btn-outline-secondary"
                                }`}
                                onClick={() => handleToggleStatus(srv)}
                                title="Click to toggle status"
                              >
                                {isActive ? "Active" : "Inactive"}
                              </button>
                            </td>

                            {/* Actions */}
                            <td className="text-end">
                              <div className="d-flex justify-content-end gap-1">
                                <button
                                  type="button"
                                  className="btn btn-outline-primary btn-sm"
                                  title="Edit Service"
                                  onClick={() => handleOpenEdit(srv)}
                                >
                                  <i className="bi bi-pencil"></i>
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-outline-danger btn-sm"
                                  title="Delete Service"
                                  onClick={() => handleDelete(srv._id, srv.name)}
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

      {/* ================= ADD / EDIT SERVICE MODAL ================= */}
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
                    <i className="bi bi-gear-fill me-2 text-danger"></i>
                    {isEditing ? "Edit Service Package" : "Create New Service"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={handleCloseModal}
                  ></button>
                </div>

                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Service Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Complete Brake Pad Overhaul"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Description *</label>
                    <textarea
                      rows="3"
                      className="form-control"
                      placeholder="Details of the inspection, parts checked, fluids replaced..."
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      required
                    ></textarea>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Price (₹ INR) *</label>
                      <input
                        type="number"
                        min="0"
                        className="form-control"
                        placeholder="e.g. 1500"
                        value={formData.price}
                        onChange={(e) =>
                          setFormData({ ...formData, price: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Duration *</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. 1-2 Hours"
                        value={formData.duration}
                        onChange={(e) =>
                          setFormData({ ...formData, duration: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Category</label>
                      <select
                        className="form-select"
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value })
                        }
                      >
                        <option value="">-- No Category --</option>
                        {categories.map((c) => (
                          <option key={c._id} value={c._id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Bootstrap Icon</label>
                      <select
                        className="form-select"
                        value={formData.icon}
                        onChange={(e) =>
                          setFormData({ ...formData, icon: e.target.value })
                        }
                      >
                        <option value="bi-tools">bi-tools (Wrench & Screwdriver)</option>
                        <option value="bi-gear-wide-connected">bi-gear (Engine/Gear)</option>
                        <option value="bi-disc">bi-disc (Brakes)</option>
                        <option value="bi-droplet-fill">bi-droplet (Oil/Fluids)</option>
                        <option value="bi-snow">bi-snow (AC)</option>
                        <option value="bi-battery-charging">bi-battery (Electrical)</option>
                        <option value="bi-car-front-fill">bi-car (General)</option>
                      </select>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="form-check form-switch mb-2">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="isActiveSwitch"
                        checked={formData.isActive}
                        onChange={(e) =>
                          setFormData({ ...formData, isActive: e.target.checked })
                        }
                      />
                      <label className="form-check-label fw-semibold" htmlFor="isActiveSwitch">
                        Active in Booking Catalog
                      </label>
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
                  <button type="submit" className="btn btn-danger px-4" disabled={submitting}>
                    {submitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Saving...
                      </>
                    ) : isEditing ? (
                      "Update Service"
                    ) : (
                      "Create Service"
                    )}
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

export default ManageServices;