import React, { useState } from 'react';
import Navbar from './components/Navbar';
import BookTable from './components/BookTable';
import BookFormModal from './components/BookFormModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorAlert from './components/ErrorAlert';
import EmptyState from './components/EmptyState';
import { useBooks } from './hooks/useBooks';

export default function App() {
  const {
    books,
    categories,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    isSubmitting,
    isDeleting,
    addBook,
    editBook,
    removeBook,
    clearError
  } = useBooks();

  // State quản lý việc đóng mở Modal Form (Thêm/Sửa)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  // State quản lý việc đóng mở Modal Xác nhận Xóa
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);

  // Mở modal Thêm mới
  const handleOpenAdd = () => {
    setEditingBook(null);
    clearError();
    setIsFormModalOpen(true);
  };

  // Mở modal Chỉnh sửa
  const handleOpenEdit = (book) => {
    setEditingBook(book);
    clearError();
    setIsFormModalOpen(true);
  };

  // Mở modal Xóa
  const handleOpenDelete = (book) => {
    setBookToDelete(book);
    clearError();
    setIsDeleteModalOpen(true);
  };

  // Xử lý submit form (Thêm hoặc Sửa)
  const handleFormSubmit = async (formData) => {
    let result;
    if (editingBook) {
      result = await editBook(editingBook.id, formData);
    } else {
      result = await addBook(formData);
    }

    if (result.success) {
      setIsFormModalOpen(false);
      setEditingBook(null);
    }
  };

  // Xử lý xác nhận xóa
  const handleConfirmDelete = async (id) => {
    const result = await removeBook(id);
    if (result.success) {
      setIsDeleteModalOpen(false);
      setBookToDelete(null);
    }
  };

  return (
    <div className="min-vh-100 bg-light d-flex flex-column">
      {/* 1. Thanh điều hướng Navbar */}
      <Navbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onOpenAddModal={handleOpenAdd}
      />

      {/* 2. Thân chính ứng dụng */}
      <main className="container pb-5 flex-grow-1">
        {/* Thông báo lỗi nếu có */}
        <ErrorAlert
          message={error?.message}
          details={error?.details}
          onClose={clearError}
        />

        {/* Thống kê nhanh */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="fw-bold text-dark mb-0">
            Danh Sách Đầu Sách Trong Kho
          </h4>
          {!isLoading && (
            <span className="badge bg-secondary fs-6 px-3 py-2">
              Tổng số: <strong>{books.length}</strong> đầu sách
            </span>
          )}
        </div>

        {/* Xử lý 3 trạng thái giao diện: Loading -> Empty -> Data */}
        {isLoading ? (
          <LoadingSpinner />
        ) : books.length === 0 ? (
          <EmptyState
            message={
              searchTerm
                ? `Không tìm thấy cuốn sách nào khớp với từ khóa "${searchTerm}"`
                : 'Hiện chưa có cuốn sách nào trong kho thư viện.'
            }
            onAction={searchTerm ? () => setSearchTerm('') : handleOpenAdd}
            actionText={searchTerm ? 'Xóa từ khóa tìm kiếm' : 'Thêm cuốn sách đầu tiên'}
          />
        ) : (
          <BookTable
            books={books}
            onEdit={handleOpenEdit}
            onDeleteClick={handleOpenDelete}
          />
        )}
      </main>

      {/* 3. Modal Thêm / Chỉnh sửa sách */}
      <BookFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        categories={categories}
        editingBook={editingBook}
        isSubmitting={isSubmitting}
      />

      {/* 4. Modal Xác nhận xóa sách */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        book={bookToDelete}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />

      {/* Footer */}
      <footer className="py-3 bg-white border-top text-center text-muted small mt-auto">
        Ứng dụng Quản Lý Thư Viện Sách &bull; React 18 &bull; Express 4 &bull; MySQL &bull; Thiết kế chuẩn Fullstack
      </footer>
    </div>
  );
}
