import React, { useState, useEffect } from 'react';

const currentYear = new Date().getFullYear();

export default function BookFormModal({
  isOpen,
  onClose,
  onSubmit,
  categories = [],
  editingBook = null,
  isSubmitting = false
}) {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    publishYear: currentYear,
    quantity: 0,
    categoryId: ''
  });

  const [formErrors, setFormErrors] = useState({});

  // Cập nhật dữ liệu form khi modal mở ra hoặc khi chuyển đổi giữa Thêm/Sửa
  useEffect(() => {
    if (editingBook) {
      setFormData({
        title: editingBook.title || '',
        author: editingBook.author || '',
        publishYear: editingBook.publishYear || currentYear,
        quantity: editingBook.quantity !== undefined ? editingBook.quantity : 0,
        categoryId: editingBook.categoryId || (categories[0]?.id || '')
      });
    } else {
      setFormData({
        title: '',
        author: '',
        publishYear: currentYear,
        quantity: 0,
        categoryId: categories[0]?.id || ''
      });
    }
    setFormErrors({});
  }, [editingBook, isOpen, categories]);

  if (!isOpen) return null;

  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    // Xóa lỗi của trường vừa sửa
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Kiểm thực sơ bộ tại Client (Client-side validation)
  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) {
      errors.title = 'Tiêu đề sách không được để trống.';
    }
    if (!formData.author.trim()) {
      errors.author = 'Tên tác giả không được để trống.';
    }
    const year = Number(formData.publishYear);
    if (!year || year < 1900 || year > currentYear) {
      errors.publishYear = `Năm xuất bản phải từ năm 1900 đến ${currentYear}.`;
    }
    const qty = Number(formData.quantity);
    if (isNaN(qty) || qty < 0) {
      errors.quantity = 'Số lượng trong kho không được là số âm.';
    }
    if (!formData.categoryId) {
      errors.categoryId = 'Vui lòng chọn một thể loại.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    onSubmit({
      title: formData.title.trim(),
      author: formData.author.trim(),
      publishYear: Number(formData.publishYear),
      quantity: Number(formData.quantity),
      categoryId: Number(formData.categoryId)
    });
  };

  return (
    <>
      {/* Backdrop */}
      <div className="modal-backdrop fade show" style={{ zIndex: 1050 }}></div>

      {/* Modal Dialog */}
      <div
        className="modal fade show d-block"
        tabIndex="-1"
        style={{ zIndex: 1055 }}
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content shadow-lg border-0">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title fw-bold">
                {editingBook ? '✏️ Chỉnh Sửa Thông Tin Sách' : '➕ Thêm Đầu Sách Mới'}
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={onClose}
                disabled={isSubmitting}
              ></button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body p-4">
                {/* Tiêu đề */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Tiêu đề sách <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    className={`form-control ${formErrors.title ? 'is-invalid' : ''}`}
                    placeholder="Ví dụ: Clean Code..."
                    value={formData.title}
                    onChange={handleChange}
                    autoFocus
                  />
                  {formErrors.title && (
                    <div className="invalid-feedback">{formErrors.title}</div>
                  )}
                </div>

                {/* Tác giả */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Tác giả <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="author"
                    className={`form-control ${formErrors.author ? 'is-invalid' : ''}`}
                    placeholder="Ví dụ: Robert C. Martin..."
                    value={formData.author}
                    onChange={handleChange}
                  />
                  {formErrors.author && (
                    <div className="invalid-feedback">{formErrors.author}</div>
                  )}
                </div>

                <div className="row">
                  {/* Năm xuất bản */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">
                      Năm XB (1900 - {currentYear}) <span className="text-danger">*</span>
                    </label>
                    <input
                      type="number"
                      name="publishYear"
                      className={`form-control ${formErrors.publishYear ? 'is-invalid' : ''}`}
                      min="1900"
                      max={currentYear}
                      value={formData.publishYear}
                      onChange={handleChange}
                    />
                    {formErrors.publishYear && (
                      <div className="invalid-feedback">{formErrors.publishYear}</div>
                    )}
                  </div>

                  {/* Số lượng */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">
                      Số lượng trong kho <span className="text-danger">*</span>
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      className={`form-control ${formErrors.quantity ? 'is-invalid' : ''}`}
                      min="0"
                      value={formData.quantity}
                      onChange={handleChange}
                    />
                    {formErrors.quantity && (
                      <div className="invalid-feedback">{formErrors.quantity}</div>
                    )}
                  </div>
                </div>

                {/* Thể loại (Dropdown) */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Thể loại sách <span className="text-danger">*</span>
                  </label>
                  <select
                    name="categoryId"
                    className={`form-select ${formErrors.categoryId ? 'is-invalid' : ''}`}
                    value={formData.categoryId}
                    onChange={handleChange}
                  >
                    <option value="" disabled>-- Chọn thể loại --</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  {formErrors.categoryId && (
                    <div className="invalid-feedback">{formErrors.categoryId}</div>
                  )}
                </div>
              </div>

              <div className="modal-footer bg-light">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="btn btn-primary fw-semibold"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-lg me-1"></i>
                      {editingBook ? 'Lưu thay đổi' : 'Thêm sách'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
