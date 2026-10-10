import React from "react";
import Sidebar from "../../components/Sidebar";
import { useNotifications } from "../../context/NotificationContext";

function Notifications() {
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearNotifications,
  } = useNotifications();

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return "bi bi-check-circle-fill text-success";
      case "warning":
        return "bi bi-exclamation-triangle-fill text-warning";
      case "error":
        return "bi bi-x-circle-fill text-danger";
      default:
        return "bi bi-info-circle-fill text-primary";
    }
  };

  const getBadgeClass = (type) => {
    switch (type) {
      case "success":
        return "bg-success";
      case "warning":
        return "bg-warning text-dark";
      case "error":
        return "bg-danger";
      default:
        return "bg-primary";
    }
  };

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
              <div className="d-flex align-items-center gap-2">
                <h2 className="fw-bold mb-1 text-dark">Notifications</h2>
                {unreadCount > 0 && (
                  <span className="badge bg-danger rounded-pill px-2 py-1">
                    {unreadCount} Unread
                  </span>
                )}
              </div>
              <p className="text-secondary mb-0">
                Stay updated with your service bookings, status changes, and technician dispatches.
              </p>
            </div>

            {notifications.length > 0 && (
              <div className="d-flex gap-2">
                {unreadCount > 0 && (
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-sm rounded-pill px-3 py-2 fw-semibold"
                    onClick={markAllAsRead}
                  >
                    <i className="bi bi-check-all me-1"></i>
                    Mark All Read
                  </button>
                )}
                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm rounded-pill px-3 py-2 fw-semibold"
                  onClick={() => {
                    if (window.confirm("Are you sure you want to clear all notifications?")) {
                      clearNotifications();
                    }
                  }}
                >
                  <i className="bi bi-trash3 me-1"></i>
                  Clear All
                </button>
              </div>
            )}
          </div>

          {/* Notifications List */}
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
              <p className="mt-2 text-muted small">Loading notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
              <i className="bi bi-bell-slash text-muted" style={{ fontSize: "65px" }}></i>
              <h4 className="fw-bold mt-3 text-dark">No Notifications</h4>
              <p className="text-secondary small mb-0">
                You're completely up to date! System notifications about booking assignments and completions will appear here.
              </p>
            </div>
          ) : (
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
              <ul className="list-group list-group-flush">
                {notifications.map((notif) => {
                  const id = notif._id || notif.id;
                  const isRead = notif.isRead || notif.read;

                  return (
                    <li
                      key={id}
                      className={`list-group-item p-4 d-flex align-items-start justify-content-between transition-all ${
                        !isRead ? "bg-light bg-opacity-75" : ""
                      }`}
                      style={{ borderBottom: "1px solid #f1f5f9" }}
                    >
                      <div className="d-flex align-items-start flex-grow-1 me-3">
                        <div className="me-3 mt-1 fs-4">
                          <i className={getIcon(notif.type)}></i>
                        </div>

                        <div className="flex-grow-1">
                          <div className="d-flex align-items-center gap-2 mb-1">
                            <h6 className="fw-bold mb-0 text-dark">{notif.title}</h6>
                            <span
                              className={`badge ${getBadgeClass(
                                notif.type
                              )} rounded-pill`}
                              style={{ fontSize: "10px" }}
                            >
                              {notif.type || "info"}
                            </span>
                            {!isRead && (
                              <span
                                className="badge bg-primary rounded-circle p-1"
                                title="Unread"
                              >
                                <span className="visually-hidden">Unread</span>
                              </span>
                            )}
                          </div>

                          <p className="text-secondary small mb-1" style={{ lineHeight: "1.5" }}>
                            {notif.message}
                          </p>

                          <small className="text-muted" style={{ fontSize: "11px" }}>
                            <i className="bi bi-clock me-1"></i>
                            {notif.createdAt
                              ? new Date(notif.createdAt).toLocaleString(undefined, {
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "Recently"}
                          </small>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="d-flex align-items-center gap-1">
                        {!isRead && (
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary rounded-pill px-2 py-1"
                            onClick={() => markAsRead(id)}
                            title="Mark as read"
                          >
                            <i className="bi bi-check2"></i>
                          </button>
                        )}
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger rounded-pill px-2 py-1"
                          onClick={() => deleteNotification(id)}
                          title="Delete notification"
                        >
                          <i className="bi bi-trash3"></i>
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Notifications;