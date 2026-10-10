import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from "../../services/serviceService";

function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const initialForm = {
    name: "",
    description: "",
    isActive: true,
  };
  const [formData, setFormData] = useState(initialForm);

  const fetchCategoryList = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getCategories();
      const list = res?.categories || res?.data || (Array.isArray(res) ? res : []);
      setCategories(list);
    } catch (err) {
      console.error("Fetch Categories Error:", err);
      setError(err?.response?.data?.message || err.message || "Failed to load categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryList();
  }, []);

  const handleOpenAdd = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setIsEditing(true);
    setEditingId(cat._id);
    setFormData({
      name: cat.name || "",
      description: cat.description || "",
      isActive: cat.isActive !== false,
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
        name: formData.name.trim(),
        description: formData.description.trim(),
        isActive: formData.isActive,
      };

      if (isEditing) {
        await updateCategory(editingId, payload);
        setSuccessMsg("Category updated successfully!");
      } else {
        await addCategory(payload);
        setSuccessMsg("New service category created successfully!");
      }

      setTimeout(() => setSuccessMsg(""), 4000);
      handleCloseModal();
      await fetchCategoryList();
    } catch (err) {
      console.error("Save Category Error:", err);
      setError(err?.response?.data?.message || err.message || "Failed to save category.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete category "${name}"?`)) return;

    try {
      setError("");
      await deleteCategory(id);
      setSuccessMsg("Category deleted successfully.");
      setTimeout(() => setSuccessMsg(""), 4000);
      await fetchCategoryList();
    } catch (err) {
      console.error("Delete Category Error:", err);
      setError(err?.response?.data?.message || err.message || "Failed to delete category.");
    }
  };

  const handleToggleStatus = async (cat) => {
    try {
      setError("");
      const newStatus = !cat.isActive;
      await updateCategory(cat._id, { isActive: newStatus });
      setSuccessMsg(`Category ${newStatus ? "Activated" : "Deactivated"}.`);
      setTimeout(() => setSuccessMsg(""), 3000);
      await fetchCategoryList();
    } catch (err) {
      console.error("Toggle Category Status Error:", err);
      setError(err?.response?.data?.message || err.message || "Failed to update category status.");
    }
  };

  const filteredCategories = categories.filter((cat) => {
    const q = searchTerm.toLowerCase();
    return (
      (cat.name || "").toLowerCase().includes(q) ||
      (cat.description || "").toLowerCase().includes(q)
    );
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
                  Taxonomy & Classification
                </span>
                <h2 className="fw-bold mb-1" style={{ color: "#0f172a" }}>
                  Manage Categories
                </h2>
                <p className="text-muted mb-0">
                  Organize services into clear domain categories for customer discovery and scheduling.
                </p>
              </div>

              <div className="d-flex gap-2">
                <button
                  type="button"
                  className="btn btn-danger d-flex align-items-center gap-2"
                  onClick={handleOpenAdd}
                >
                  <i className="bi bi-tag-fill"></i> Add Category
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

            {/* Statistics */}
            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <div className="card border-0 shadow-sm p-3 bg-white rounded-3">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <small className="text-muted text-uppercase fw-semibold">Total Categories</small>
                      <h3 className="fw-bold mb-0 text-dark mt-1">{categories.length}</h3>
                    </div>
                    <div className="p-3 bg-primary-subtle text-primary rounded-circle">
                      <i className="bi bi-folder-fill fs-4"></i>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="card border-0 shadow-sm p-3 bg-white rounded-3">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <small className="text-muted text-uppercase fw-semibold">Active in Catalog</small>
                      <h3 className="fw-bold mb-0 text-success mt-1">
                        {categories.filter((c) => c.isActive !== false).length}
                      </h3>
                    </div>
                    <div className="p-3 bg-success-subtle text-success rounded-circle">
                      <i className="bi bi-check2-circle fs-4"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body p-3">
                <div className="input-group">
                  <span className="input-group-text bg-white border-end-0 text-muted">
                    <i className="bi bi-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control border-start-0"
                    placeholder="Search categories by name or description..."
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
            </div>

            {/* Categories Table */}
            {loading ? (
              <div className="card border-0 shadow-sm text-center py-5">
                <div className="spinner-border text-danger mx-auto mb-3" role="status"></div>
                <p className="text-muted mb-0">Loading categories...</p>
              </div>
            ) : filteredCategories.length === 0 ? (
              <div className="card border-0 shadow-sm text-center py-5">
                <i className="bi bi-tag text-muted" style={{ fontSize: "64px" }}></i>
                <h5 className="fw-bold mt-3">No Categories Found</h5>
                <p className="text-muted">Click "Add Category" to create a new category.</p>
              </div>
            ) : (
              <div className="card border-0 shadow-sm">
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-dark">
                      <tr>
                        <th style={{ width: "60px" }}>#</th>
                        <th>Category Name</th>
                        <th>Description</th>
                        <th>Status</th>
                        <th className="text-end" style={{ minWidth: "120px" }}>
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCategories.map((cat, idx) => {
                        const isActive = cat.isActive !== false;
                        return (
                          <tr key={cat._id || idx}>
                            <td className="text-muted fw-semibold">{idx + 1}</td>

                            {/* Name */}
                            <td>
                              <div className="d-flex align-items-center gap-2">
                                <div
                                  className="bg-danger-subtle text-danger rounded-circle d-flex align-items-center justify-content-center"
                                  style={{ width: "38px", height: "38px" }}
                                >
                                  <i className="bi bi-tag-fill"></i>
                                </div>
                                <div className="fw-bold text-dark">{cat.name}</div>
                              </div>
                            </td>

                            {/* Description */}
                            <td>
                              <span className="text-muted">{cat.description || "No description provided."}</span>
                            </td>

                            {/* Status */}
                            <td>
                              <button
                                type="button"
                                className={`btn btn-sm ${
                                  isActive ? "btn-outline-success" : "btn-outline-secondary"
                                }`}
                                onClick={() => handleToggleStatus(cat)}
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
                                  title="Edit Category"
                                  onClick={() => handleOpenEdit(cat)}
                                >
                                  <i className="bi bi-pencil"></i>
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-outline-danger btn-sm"
                                  title="Delete Category"
                                  onClick={() => handleDelete(cat._id, cat.name)}
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

      {/* ================= ADD / EDIT CATEGORY MODAL ================= */}
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
                    <i className="bi bi-tag-fill me-2 text-danger"></i>
                    {isEditing ? "Edit Category" : "Add Service Category"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={handleCloseModal}
                  ></button>
                </div>

                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Category Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Detailing & Wash"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Description</label>
                    <textarea
                      rows="3"
                      className="form-control"
                      placeholder="Brief overview of services falling under this category..."
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                    ></textarea>
                  </div>

                  {isEditing && (
                    <div className="form-check form-switch mb-2">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="isCatActiveSwitch"
                        checked={formData.isActive}
                        onChange={(e) =>
                          setFormData({ ...formData, isActive: e.target.checked })
                        }
                      />
                      <label className="form-check-label fw-semibold" htmlFor="isCatActiveSwitch">
                        Active in System
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
                      "Update Category"
                    ) : (
                      "Create Category"
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

export default ManageCategories;