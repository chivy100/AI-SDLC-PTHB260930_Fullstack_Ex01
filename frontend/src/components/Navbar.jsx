import React from 'react';

export default function Navbar({ searchTerm, onSearchChange, onOpenAddModal }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm mb-4">
      <div className="container">
        <span className="navbar-brand fw-bold d-flex align-items-center fs-4">
          📚 Quản Lý Thư Viện Sách
        </span>

        <div className="d-flex align-items-center ms-auto gap-3">
          {/* Ô tìm kiếm sách theo từ khóa (Bonus ?q=) */}
          <div className="input-group" style={{ maxWidth: '320px' }}>
            <span className="input-group-text bg-white border-end-0">
              <i className="bi bi-search text-muted"></i>
            </span>
            <input
              type="text"
              className="form-control border-start-0 ps-0"
              placeholder="Tìm theo tên hoặc tác giả..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            {searchTerm && (
              <button
                className="btn btn-white bg-white border border-start-0 text-muted"
                type="button"
                onClick={() => onSearchChange('')}
              >
                ✕
              </button>
            )}
          </div>

          {/* Nút Thêm sách mới */}
          <button
            type="button"
            className="btn btn-warning fw-semibold text-dark shadow-sm text-nowrap"
            onClick={onOpenAddModal}
          >
            <i className="bi bi-plus-lg me-1"></i> Thêm sách mới
          </button>
        </div>
      </div>
    </nav>
  );
}
