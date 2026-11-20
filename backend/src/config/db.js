require('dotenv').config();
const mysql = require('mysql2/promise');

// Khởi tạo Connection Pool dùng chung cho toàn bộ ứng dụng
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'library_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4'
});

// Hàm kiểm tra kết nối CSDL khi khởi động Server
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Kết nối thành công đến MySQL Database:', process.env.DB_NAME || 'library_db');
    connection.release();
  } catch (error) {
    console.error('❌ Lỗi kết nối MySQL Database:', error.message);
    console.error('👉 Hãy kiểm tra lại thông tin cấu hình trong file backend/.env');
  }
}

module.exports = {
  pool,
  testConnection
};
