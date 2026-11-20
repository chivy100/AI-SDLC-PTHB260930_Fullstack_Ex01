const { z } = require('zod');

const currentYear = new Date().getFullYear();

// Schema cho việc tạo sách mới (POST /api/books)
const createBookSchema = z.object({
  title: z
    .string({ required_error: 'Tiêu đề sách là bắt buộc.' })
    .trim()
    .min(1, 'Tiêu đề sách không được để trống.')
    .max(200, 'Tiêu đề không được vượt quá 200 ký tự.'),
  author: z
    .string({ required_error: 'Tác giả sách là bắt buộc.' })
    .trim()
    .min(1, 'Tên tác giả không được để trống.')
    .max(120, 'Tên tác giả không được vượt quá 120 ký tự.'),
  publishYear: z
    .coerce.number({ invalid_type_error: 'Năm xuất bản phải là số nguyên.' })
    .int('Năm xuất bản phải là số nguyên.')
    .min(1900, 'Năm xuất bản phải từ năm 1900 trở lại đây.')
    .max(currentYear, `Năm xuất bản không được lớn hơn năm hiện tại (${currentYear}).`),
  quantity: z
    .coerce.number({ invalid_type_error: 'Số lượng phải là số nguyên.' })
    .int('Số lượng phải là số nguyên.')
    .min(0, 'Số lượng trong kho không được là số âm.')
    .default(0),
  categoryId: z
    .coerce.number({ invalid_type_error: 'Thể loại sách phải là số ID hợp lệ.' })
    .int('Mã thể loại phải là số nguyên.')
    .positive('Mã thể loại sách không hợp lệ.')
});

// Schema cho việc cập nhật sách (PUT /api/books/:id)
const updateBookSchema = createBookSchema;

// Schema kiểm tra ID trên URL parameter (:id)
const bookIdParamSchema = z.object({
  id: z
    .coerce.number({ invalid_type_error: 'ID sách phải là số nguyên.' })
    .int('ID sách phải là số nguyên.')
    .positive('ID sách phải lớn hơn 0.')
});

// Schema cho query tìm kiếm (?q=keyword)
const searchQuerySchema = z.object({
  q: z.string().trim().optional()
});

module.exports = {
  createBookSchema,
  updateBookSchema,
  bookIdParamSchema,
  searchQuerySchema
};
