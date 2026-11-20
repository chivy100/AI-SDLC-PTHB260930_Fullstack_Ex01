/**
 * Lớp lỗi tùy chỉnh chuẩn hóa cho toàn bộ Backend
 * Kế thừa từ Error chuẩn của JavaScript
 */
class AppError extends Error {
  constructor(statusCode, code, message, details = []) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = true; // Đánh dấu là lỗi nghiệp vụ có thể dự đoán được

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
