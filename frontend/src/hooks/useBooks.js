import { useState, useEffect, useCallback } from 'react';
import bookApi from '../api/bookApi';
import categoryApi from '../api/categoryApi';

/**
 * Custom Hook useBooks: Tách biệt hoàn toàn Business/Data logic khỏi Component UI
 */
export function useBooks() {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null); // { message, details }
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // 1. Tải danh sách thể loại (chỉ gọi 1 lần khi mount)
  const loadCategories = useCallback(async () => {
    try {
      const data = await categoryApi.getAll();
      setCategories(data);
    } catch (err) {
      console.error('Lỗi khi tải thể loại:', err);
      // Không chặn toàn bộ app nếu danh mục lỗi tạm thời
    }
  }, []);

  // 2. Tải danh sách sách (hỗ trợ từ khóa tìm kiếm)
  const loadBooks = useCallback(async (keyword = '') => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await bookApi.getAll(keyword);
      setBooks(data);
    } catch (err) {
      console.error('Lỗi khi tải danh sách sách:', err);
      const serverError = err.response?.data?.error;
      setError({
        message: serverError?.message || 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại.',
        details: serverError?.details || []
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Effect tải dữ liệu ban đầu
  useEffect(() => {
    loadCategories();
    loadBooks('');
  }, [loadCategories, loadBooks]);

  // Effect tìm kiếm với cơ chế Debounce 400ms để tránh spam request lên server
  useEffect(() => {
    const timer = setTimeout(() => {
      loadBooks(searchTerm);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchTerm, loadBooks]);

  // 3. Thêm sách mới (Immutable state update)
  const addBook = async (bookData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const newBook = await bookApi.create(bookData);
      // Cập nhật State bất biến: đưa sách mới lên đầu danh sách
      setBooks((prev) => [newBook, ...prev]);
      return { success: true };
    } catch (err) {
      const serverError = err.response?.data?.error;
      const errorObj = {
        message: serverError?.message || 'Có lỗi xảy ra khi thêm sách.',
        details: serverError?.details || []
      };
      setError(errorObj);
      return { success: false, error: errorObj };
    } finally {
      setIsSubmitting(false);
    }
  };

  // 4. Sửa sách (Immutable state update)
  const editBook = async (id, bookData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const updatedBook = await bookApi.update(id, bookData);
      // Cập nhật State bất biến: thay thế đúng cuốn sách có id trùng khớp
      setBooks((prev) => prev.map((b) => (b.id === id ? updatedBook : b)));
      return { success: true };
    } catch (err) {
      const serverError = err.response?.data?.error;
      const errorObj = {
        message: serverError?.message || 'Có lỗi xảy ra khi cập nhật sách.',
        details: serverError?.details || []
      };
      setError(errorObj);
      return { success: false, error: errorObj };
    } finally {
      setIsSubmitting(false);
    }
  };

  // 5. Xóa sách (Immutable state update)
  const removeBook = async (id) => {
    setIsDeleting(true);
    setError(null);
    try {
      await bookApi.delete(id);
      // Cập nhật State bất biến: lọc bỏ cuốn sách vừa xóa khỏi mảng
      setBooks((prev) => prev.filter((b) => b.id !== id));
      return { success: true };
    } catch (err) {
      const serverError = err.response?.data?.error;
      const errorObj = {
        message: serverError?.message || 'Có lỗi xảy ra khi xóa sách.',
        details: serverError?.details || []
      };
      setError(errorObj);
      return { success: false, error: errorObj };
    } finally {
      setIsDeleting(false);
    }
  };

  const clearError = () => setError(null);

  return {
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
    clearError,
    refreshBooks: () => loadBooks(searchTerm)
  };
}
