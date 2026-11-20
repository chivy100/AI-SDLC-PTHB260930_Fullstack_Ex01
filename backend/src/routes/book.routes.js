const express = require('express');
const bookController = require('../controllers/book.controller');
const validate = require('../middlewares/validate.middleware');
const {
  createBookSchema,
  updateBookSchema,
  bookIdParamSchema,
  searchQuerySchema
} = require('../schemas/book.schema');

const router = express.Router();

// [GET] /api/books - Lấy danh sách sách (hỗ trợ ?q=)
router.get(
  '/',
  validate(searchQuerySchema, 'query'),
  bookController.getBooks
);

// [GET] /api/books/:id - Xem chi tiết sách
router.get(
  '/:id',
  validate(bookIdParamSchema, 'params'),
  bookController.getBookById
);

// [POST] /api/books - Thêm sách mới
router.post(
  '/',
  validate(createBookSchema, 'body'),
  bookController.createBook
);

// [PUT] /api/books/:id - Cập nhật sách
router.put(
  '/:id',
  validate(bookIdParamSchema, 'params'),
  validate(updateBookSchema, 'body'),
  bookController.updateBook
);

// [DELETE] /api/books/:id - Xóa sách khỏi kho
router.delete(
  '/:id',
  validate(bookIdParamSchema, 'params'),
  bookController.deleteBook
);

module.exports = router;
