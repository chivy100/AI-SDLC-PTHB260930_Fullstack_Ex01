const bookRepository = require('../repositories/book.repository');
const categoryRepository = require('../repositories/category.repository');
const AppError = require('../utils/appError');

class BookController {
  /**
   * [GET] /api/books - Lấy danh sách sách (hỗ trợ ?q=keyword)
   */
  async getBooks(req, res, next) {
    try {
      const searchTerm = req.query.q || '';
      const books = await bookRepository.findAll(searchTerm);
      return res.status(200).json(books);
    } catch (error) {
      next(error);
    }
  }

  /**
   * [GET] /api/books/:id - Xem chi tiết 1 cuốn sách
   */
  async getBookById(req, res, next) {
    try {
      const { id } = req.params;
      const book = await bookRepository.findById(id);

      if (!book) {
        throw new AppError(404, 'NOT_FOUND', `Không tìm thấy cuốn sách với mã số ${id}.`);
      }

      return res.status(200).json(book);
    } catch (error) {
      next(error);
    }
  }

  /**
   * [POST] /api/books - Thêm sách mới
   */
  async createBook(req, res, next) {
    try {
      const { title, author, publishYear, quantity, categoryId } = req.body;

      // 1. Kiểm tra thể loại có tồn tại trong CSDL hay không
      const categoryExists = await categoryRepository.findById(categoryId);
      if (!categoryExists) {
        throw new AppError(
          400,
          'CATEGORY_NOT_FOUND',
          `Thể loại sách với mã ID ${categoryId} không tồn tại trong hệ thống.`
        );
      }

      // 2. Bonus: Kiểm tra trùng lặp tiêu đề + tác giả (409 CONFLICT)
      const isDuplicate = await bookRepository.findDuplicate(title, author);
      if (isDuplicate) {
        throw new AppError(
          409,
          'DUPLICATE_BOOK',
          `Đầu sách '${title}' của tác giả '${author}' đã tồn tại trong thư viện.`
        );
      }

      // 3. Thực thi tạo mới
      const newBook = await bookRepository.create({
        title,
        author,
        publishYear,
        quantity,
        categoryId
      });

      return res.status(201).json(newBook);
    } catch (error) {
      next(error);
    }
  }

  /**
   * [PUT] /api/books/:id - Cập nhật thông tin sách
   */
  async updateBook(req, res, next) {
    try {
      const { id } = req.params;
      const { title, author, publishYear, quantity, categoryId } = req.body;

      // 1. Kiểm tra sách cần sửa có tồn tại không
      const existingBook = await bookRepository.findById(id);
      if (!existingBook) {
        throw new AppError(404, 'NOT_FOUND', `Không tìm thấy cuốn sách với mã số ${id} để cập nhật.`);
      }

      // 2. Kiểm tra thể loại mới có tồn tại không
      const categoryExists = await categoryRepository.findById(categoryId);
      if (!categoryExists) {
        throw new AppError(
          400,
          'CATEGORY_NOT_FOUND',
          `Thể loại sách với mã ID ${categoryId} không tồn tại trong hệ thống.`
        );
      }

      // 3. Bonus: Kiểm tra trùng lặp với cuốn sách khác (trừ chính nó)
      const isDuplicate = await bookRepository.findDuplicate(title, author, id);
      if (isDuplicate) {
        throw new AppError(
          409,
          'DUPLICATE_BOOK',
          `Đầu sách '${title}' của tác giả '${author}' đã tồn tại trong thư viện.`
        );
      }

      // 4. Thực thi cập nhật
      const updatedBook = await bookRepository.update(id, {
        title,
        author,
        publishYear,
        quantity,
        categoryId
      });

      return res.status(200).json(updatedBook);
    } catch (error) {
      next(error);
    }
  }

  /**
   * [DELETE] /api/books/:id - Xóa sách khỏi kho
   */
  async deleteBook(req, res, next) {
    try {
      const { id } = req.params;

      // 1. Kiểm tra sách có tồn tại không
      const existingBook = await bookRepository.findById(id);
      if (!existingBook) {
        throw new AppError(404, 'NOT_FOUND', `Không tìm thấy cuốn sách với mã số ${id} để xóa.`);
      }

      // 2. Thực thi xóa
      await bookRepository.delete(id);

      // Trả về 204 No Content và hoàn toàn không gửi kèm body
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new BookController();
