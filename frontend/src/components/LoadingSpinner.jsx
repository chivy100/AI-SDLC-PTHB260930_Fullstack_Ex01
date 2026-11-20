import React from 'react';

export default function LoadingSpinner({ message = 'Đang tải dữ liệu từ máy chủ...' }) {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5">
      <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="text-secondary fw-semibold mb-0">{message}</p>
    </div>
  );
}
