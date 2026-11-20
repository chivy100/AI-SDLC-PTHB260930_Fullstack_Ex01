import React from 'react';

export default function BookTable({ books, onEdit, onDeleteClick }) {
  return (
    <div className="table-responsive bg-white rounded-3 shadow-sm border">
      <table className="table table-hover align-middle mb-0">
        <thead className="table-light text-secondary">
          <tr>
            <th style={{ width: '60px' }} className="text-center">#</th>
            <th>Tiêu đề sách</th>
            <th>Tác giả</th>
            <th style={{ width: '130px' }} className="text-center">Năm xuất bản</th>
            <th style={{ width: '120px' }} className="text-center">Số lượng kho</th>
            <th style={{ width: '180px' }}>Thể loại</th>
            <th style={{ width: '150px' }} className="text-center">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book, index) => (
            <tr key={book.id}>
              <td className="text-center text-muted fw-bold">{book.id}</td>
              <td>
                <span className="fw-semibold text-dark">{book.title}</span>
              </td>
              <td className="text-secondary">{book.author}</td>
              <td className="text-center">
                <span className="badge bg-light text-dark border">
                  {book.publishYear}
                </span>
              </td>
              <td className="text-center">
                {book.quantity > 0 ? (
                  <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1">
                    {book.quantity} cuốn
                  </span>
                ) : (
                  <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-2 py-1">
                    Hết hàng (0)
                  </span>
                )}
              </td>
              <td>
                <span className="badge bg-primary-subtle text-primary border border-primary-subtle">
                  {book.categoryName}
                </span>
              </td>
              <td className="text-center">
                <div className="btn-group btn-group-sm" role="group">
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    title="Chỉnh sửa thông tin sách"
                    onClick={() => onEdit(book)}
                  >
                    <i className="bi bi-pencil-square me-1"></i> Sửa
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    title="Xóa đầu sách khỏi kho"
                    onClick={() => onDeleteClick(book)}
                  >
                    <i className="bi bi-trash me-1"></i> Xóa
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
