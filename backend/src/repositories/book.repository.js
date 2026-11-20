const { pool } = require('../config/db');

/**
 * Tầng Repository quản lý các câu lệnh SQL thuần cho bảng books
 * Tuân thủ tuyệt đối quy tắc:
 * 1. Mọi câu lệnh SQL đều tham số hóa bằng dấu '?' (Prepared Statements).
 * 2. Sử dụng ALIAS (AS) để chuyển đổi snake_case sang camelCase chuẩn API.
 * 3. Sử dụng LEFT JOIN để đảm bảo dữ liệu không bị thất lạc.
 */
class BookRepository {
  /**
   * Lấy danh sách sách, hỗ trợ tìm kiếm theo tiêu đề hoặc tác giả
   * @param {string} [searchTerm] Từ khóa tìm kiếm (Bonus ?q=)
   */
  async findAll(searchTerm = '') {
    let sql = `
      SELECT 
        b.id,
        b.title,
        b.author,
        b.publish_year AS publishYear,
        b.quantity,
        b.category_id AS categoryId,
        COALESCE(c.name, 'Chưa phân loại') AS categoryName
      FROM books b
      LEFT JOIN categories c ON b.category_id = c.id
    `;
    const params = [];

    if (searchTerm && searchTerm.trim() !== '') {
      sql += ` WHERE b.title LIKE ? OR b.author LIKE ? `;
      const pattern = `%${searchTerm.trim()}%`;
      params.push(pattern, pattern);
    }

    sql += ` ORDER BY b.id DESC; `;

    const [rows] = await pool.execute(sql, params);
    return rows;
  }

  /**
   * Tìm một cuốn sách theo ID kèm tên thể loại
   * @param {number} id
   */
  async findById(id) {
    const sql = `
      SELECT 
        b.id,
        b.title,
        b.author,
        b.publish_year AS publishYear,
        b.quantity,
        b.category_id AS categoryId,
        COALESCE(c.name, 'Chưa phân loại') AS categoryName
      FROM books b
      LEFT JOIN categories c ON b.category_id = c.id
      WHERE b.id = ?;
    `;
    const [rows] = await pool.execute(sql, [id]);
    return rows[0] || null;
  }

  /**
   * Kiểm tra trùng lặp tiêu đề và tác giả (Dùng cho Bonus 409 Conflict)
   * @param {string} title 
   * @param {string} author 
   * @param {number|null} [excludeId] Bỏ qua ID hiện tại khi kiểm tra cập nhật
   */
  async findDuplicate(title, author, excludeId = null) {
    let sql = `
      SELECT id FROM books 
      WHERE LOWER(title) = LOWER(?) AND LOWER(author) = LOWER(?)
    `;
    const params = [title.trim(), author.trim()];

    if (excludeId) {
      sql += ` AND id != ? `;
      params.push(excludeId);
    }

    const [rows] = await pool.execute(sql, params);
    return rows[0] || null;
  }

  /**
   * Tạo đầu sách mới
   */
  async create({ title, author, publishYear, quantity, categoryId }) {
    const sql = `
      INSERT INTO books (title, author, publish_year, quantity, category_id)
      VALUES (?, ?, ?, ?, ?);
    `;
    const values = [title, author, publishYear, quantity, categoryId];
    const [result] = await pool.execute(sql, values);

    // Lấy lại đối tượng hoàn chỉnh vừa tạo kèm tên thể loại để trả về cho Client
    return await this.findById(result.insertId);
  }

  /**
   * Cập nhật thông tin đầu sách
   */
  async update(id, { title, author, publishYear, quantity, categoryId }) {
    const sql = `
      UPDATE books 
      SET title = ?, author = ?, publish_year = ?, quantity = ?, category_id = ?
      WHERE id = ?;
    `;
    const values = [title, author, publishYear, quantity, categoryId, id];
    await pool.execute(sql, values);

    return await this.findById(id);
  }

  /**
   * Xóa một cuốn sách theo ID
   */
  async delete(id) {
    const sql = `DELETE FROM books WHERE id = ?;`;
    const [result] = await pool.execute(sql, [id]);
    return result.affectedRows > 0;
  }
}

module.exports = new BookRepository();
