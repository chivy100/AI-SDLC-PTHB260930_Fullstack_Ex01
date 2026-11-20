const app = require('./app');
const { testConnection } = require('./config/db');

const PORT = process.env.PORT || 5000;

// Khởi chạy HTTP Server
app.listen(PORT, async () => {
  console.log('====================================================');
  console.log(`🚀 Library API Server đang chạy tại: http://localhost:${PORT}`);
  console.log(`📡 Môi trường (NODE_ENV): ${process.env.NODE_ENV || 'development'}`);
  console.log('====================================================');

  // Kiểm tra kết nối tới MySQL Database
  await testConnection();
});
