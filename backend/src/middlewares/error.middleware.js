const { ZodError } = require('zod');
const AppError = require('../utils/appError');

/**
 * Middleware bắt lỗi 404 cho các Route không tồn tại
 */
function notFoundHandler(req, res, next) {
  const error = new AppError(
    404,
    'NOT_FOUND',
    `Đường dẫn API '${req.method} ${req.originalUrl}' không tồn tại trên hệ thống.`
  );
  next(error);
}

/**
 * Middleware xử lý lỗi tập trung (Centralized Error Handler)
 * 4 tham số (err, req, res, next) bắt buộc để Express nhận diện là Error Middleware
 */
function errorHandler(err, req, res, next) {
  // 1. Xử lý lỗi do Zod kiểm thực dữ liệu thất bại
  if (err instanceof ZodError) {
    const details = err.errors.map(issue => ({
      field: issue.path.join('.'),
      message: issue.message
    }));

    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Dữ liệu đầu vào không hợp lệ.',
        details
      }
    });
  }

  // 2. Xử lý lỗi nghiệp vụ do chúng ta chủ động throw qua AppError
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        details: err.details
      }
    });
  }

  // 3. Xử lý lỗi vi phạm ràng buộc khóa ngoại từ MySQL (Mã 1451: không cho xóa bản ghi cha)
  if (err.errno === 1451 || err.code === 'ER_ROW_IS_REFERENCED_2') {
    return res.status(409).json({
      error: {
        code: 'FOREIGN_KEY_CONFLICT',
        message: 'Không thể xóa hoặc thay đổi dữ liệu này vì đang có dữ liệu khác liên kết tới.',
        details: []
      }
    });
  }

  // 4. Xử lý lỗi trùng lặp dữ liệu từ MySQL (Mã 1062: UNIQUE constraint)
  if (err.errno === 1062 || err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({
      error: {
        code: 'DUPLICATE_ENTRY',
        message: 'Dữ liệu bị trùng lặp với bản ghi đã tồn tại trong hệ thống.',
        details: []
      }
    });
  }

  // 5. Lỗi không mong muốn phía Server (500 Internal Server Error)
  console.error('🔥 [Unhandled Server Error]:', err);
  return res.status(500).json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Đã xảy ra lỗi máy chủ nội bộ. Vui lòng thử lại sau.',
      details: process.env.NODE_ENV === 'development' ? [err.message] : []
    }
  });
}

module.exports = {
  notFoundHandler,
  errorHandler
};
