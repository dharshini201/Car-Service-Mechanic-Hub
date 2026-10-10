import React from "react";

function Loading({ text = "Loading..." }) {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center py-5">
      <div
        className="spinner-border text-primary"
        role="status"
        style={{ width: "3rem", height: "3rem" }}
      >
        <span className="visually-hidden">Loading...</span>
      </div>

      <p className="text-muted mt-3 mb-0">{text}</p>
    </div>
  );
}

export default Loading;