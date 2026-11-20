import axiosClient from './axiosClient';

const bookApi = {
  /**
   * Lấy danh sách sách (hỗ trợ tìm kiếm theo từ khóa ?q=)
   */
  getAll: (searchTerm = '') => {
    const params = searchTerm ? { q: searchTerm } : {};
    return axiosClient.get('/books', { params });
  },

  /**
   * Lấy chi tiết một cuốn sách theo ID
   */
  getById: (id) => {
    return axiosClient.get(`/books/${id}`);
  },

  /**
   * Thêm một cuốn sách mới
   */
  create: (bookData) => {
    return axiosClient.post('/books', bookData);
  },

  /**
   * Cập nhật thông tin một cuốn sách
   */
  update: (id, bookData) => {
    return axiosClient.put(`/books/${id}`, bookData);
  },

  /**
   * Xóa một cuốn sách khỏi kho
   */
  delete: (id) => {
    return axiosClient.delete(`/books/${id}`);
  }
};

export default bookApi;
