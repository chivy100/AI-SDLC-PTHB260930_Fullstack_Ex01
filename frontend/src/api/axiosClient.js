import axios from 'axios';

// Khởi tạo instance Axios dùng chung với cấu hình từ biến môi trường
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10 giây timeout
});

// Response Interceptor: Trích xuất response.data trực tiếp để code gọn gàng
axiosClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Trả về error để các hàm gọi xử lý trong khối catch
    return Promise.reject(error);
  }
);

export default axiosClient;
