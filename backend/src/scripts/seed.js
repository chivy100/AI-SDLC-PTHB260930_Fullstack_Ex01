const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function runSeed() {
  console.log('🌱 Đang nạp dữ liệu mẫu tiếng Việt chuẩn UTF-8...');
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'library_db',
      multipleStatements: true,
      charset: 'utf8mb4'
    });

    // Reset bảng sạch sẽ và đặt lại AUTO_INCREMENT = 1
    await conn.query('SET FOREIGN_KEY_CHECKS = 0; TRUNCATE TABLE books; TRUNCATE TABLE categories; SET FOREIGN_KEY_CHECKS = 1;');

    const seedPath = path.join(__dirname, '../../../db/seed.sql');
    const seedSql = fs.readFileSync(seedPath, 'utf8');

    await conn.query('SET NAMES utf8mb4;\n' + seedSql);

    const [books] = await conn.query('SELECT COUNT(*) AS total FROM books');
    const [cats] = await conn.query('SELECT COUNT(*) AS total FROM categories');

    console.log(`✅ Nạp thành công ${cats[0].total} thể loại và ${books[0].total} cuốn sách tiếng Việt có dấu!`);
    await conn.end();
    process.exit(0);
  } catch (err) {
    console.error('❌ Lỗi nạp dữ liệu:', err.message);
    process.exit(1);
  }
}

runSeed();
