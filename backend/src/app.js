require('dotenv').config();
const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes');
const { notFoundHandler, errorHandler } = require('./middlewares/error.middleware');

const app = express();

// 1. Cấu hình CORS cho phép Frontend truy cập
const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
app.use(cors({
  origin: clientOrigin,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 2. Middleware phân tích cú pháp Request Body dạng JSON
app.use(express.json());

// 3. Endpoint kiểm tra sức khỏe hệ thống (Health Check)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 4. Tuyến đường API chính
app.use('/api', apiRoutes);

// 5. Middleware xử lý khi truy cập sai đường dẫn (404 Not Found)
app.use(notFoundHandler);

// 6. Middleware xử lý lỗi tập trung (Centralized Error Handler)
app.use(errorHandler);

module.exports = app;
