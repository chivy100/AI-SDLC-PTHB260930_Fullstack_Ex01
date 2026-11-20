import React from 'react';

export default function ErrorAlert({ message, details = [], onClose }) {
  if (!message) return null;

  return (
    <div className="alert alert-danger alert-dismissible fade show shadow-sm" role="alert">
      <div className="d-flex align-items-center mb-1">
        <i className="bi bi-exclamation-triangle-fill me-2 fs-5"></i>
        <strong>Lỗi: </strong>&nbsp;{message}
      </div>

      {details && details.length > 0 && (
        <ul className="mb-0 ps-3 mt-2 small">
          {details.map((item, index) => (
            <li key={index}>
              <strong>{item.field}:</strong> {item.message}
            </li>
          ))}
        </ul>
      )}

      {onClose && (
        <button
          type="button"
          className="btn-close"
          aria-label="Close"
          onClick={onClose}
        ></button>
      )}
    </div>
  );
}
