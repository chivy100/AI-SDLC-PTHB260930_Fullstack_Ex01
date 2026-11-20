import React from 'react';

export default function EmptyState({ message = 'Hiện chưa có đầu sách nào trong kho.', onAction, actionText }) {
  return (
    <div className="text-center py-5 bg-white rounded-3 border">
      <div className="display-4 text-muted mb-3">📖</div>
      <h5 className="text-secondary fw-bold">{message}</h5>
      <p className="text-muted small">Hãy thêm một cuốn sách mới hoặc thử tìm kiếm với từ khóa khác.</p>
      {onAction && actionText && (
        <button className="btn btn-primary mt-2" onClick={onAction}>
          <i className="bi bi-plus-circle me-1"></i> {actionText}
        </button>
      )}
    </div>
  );
}
