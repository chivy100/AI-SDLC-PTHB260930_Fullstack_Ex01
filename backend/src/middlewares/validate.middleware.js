/**
 * Middleware kiểm thực dữ liệu đầu vào bằng Zod Schema
 * @param {import('zod').ZodSchema} schema 
 * @param {'body' | 'params' | 'query'} target 
 */
function validate(schema, target = 'body') {
  return (req, res, next) => {
    try {
      const parsedData = schema.parse(req[target]);
      // Gán dữ liệu đã được Zod làm sạch và ép kiểu trở lại request
      req[target] = parsedData;
      next();
    } catch (error) {
      next(error); // Chuyển lỗi sang Error Middleware tập trung xử lý
    }
  };
}

module.exports = validate;
