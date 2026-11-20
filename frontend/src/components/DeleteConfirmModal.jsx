import React from 'react';

export default function DeleteConfirmModal({
  isOpen,
  book,
  onClose,
  onConfirm,
  isDeleting = false
}) {
  if (!isOpen || !book) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="modal-backdrop fade show" style={{ zIndex: 1060 }}></div>

      {/* Modal Dialog */}
      <div
        className="modal fade show d-block"
        tabIndex="-1"
        style={{ zIndex: 1065 }}
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content shadow-lg border-0">
            <div className="modal-header bg-danger text-white">
              <h5 className="modal-title fw-bold">
                <i className="bi bi-trash3-fill me-2"></i> Xác Nhận Xóa Sách
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={onClose}
                disabled={isDeleting}
              ></button>
            </div>

            <div className="modal-body p-4">
              <p className="mb-2 fs-6">
                Bạn có chắc chắn muốn xóa cuốn sách sau khỏi hệ thống thư viện?
              </p>
              <div className="p-3 bg-light rounded-3 border-start border-danger border-4">
                <h6 className="fw-bold text-danger mb-1">{book.title}</h6>
                <div className="text-muted small">
                  Tác giả: <strong>{book.author}</strong> | Năm XB: <strong>{book.publishYear}</strong>
                </div>
              </div>
              <p className="text-muted small mt-3 mb-0">
                ⚠️ Hành động này sẽ xóa dữ liệu vĩnh viễn khỏi CSDL và không thể hoàn tác.
              </p>
            </div>

            <div className="modal-footer bg-light">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={isDeleting}
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                className="btn btn-danger fw-semibold"
                onClick={() => onConfirm(book.id)}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Đang xóa...
                  </>
                ) : (
                  <>
                    <i className="bi bi-trash-fill me-1"></i> Xác nhận xóa
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
