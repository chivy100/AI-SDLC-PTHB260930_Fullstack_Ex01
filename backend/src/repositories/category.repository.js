const { pool } = require('../config/db');

/**
 * Tầng Repository quản lý các câu lệnh SQL thuần cho bảng categories
 */
class CategoryRepository {
  /**
   * Lấy toàn bộ danh sách thể loại sách
   */
  async findAll() {
    const sql = `
      SELECT id, name 
      FROM categories 
      ORDER BY name ASC;
    `;
    const [rows] = await pool.execute(sql);
    return rows;
  }

  /**
   * Tìm thể loại theo ID
   * @param {number} id
   */
  async findById(id) {
    const sql = `
      SELECT id, name 
      FROM categories 
      WHERE id = ?;
    `;
    const [rows] = await pool.execute(sql, [id]);
    return rows[0] || null;
  }
}

module.exports = new CategoryRepository();
