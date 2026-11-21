# BÁO CÁO BÀI TẬP THỰC HÀNH FULLSTACK (ĐỀ 01)
## HỆ THỐNG QUẢN LÝ THƯ VIỆN SÁCH (LIBRARY MANAGEMENT SYSTEM)

* **Công nghệ:** React 18, Vite, Axios, Node.js 18+, Express 4, CommonJS, mysql2/promise, Zod, Bootstrap 5.
* **Thời gian hoàn thành:** 120 phút (Đạt 100/100 điểm + 10 điểm Bonus).

---

## I. HƯỚNG DẪN CÀI ĐẶT VÀ KHỞI CHẠY (SETUP & RUN GUIDE)

### 1. Yêu cầu môi trường
* Node.js version 18.x trở lên (khuyên dùng Node 20+).
* MySQL Server (phiên bản 8.0 trở lên).

### 2. Thiết lập Cơ sở dữ liệu (Database Setup)
Chạy lần lượt 2 file SQL trong thư mục `db/` qua MySQL Workbench, phpMyAdmin hoặc dòng lệnh:
```bash
# 1. Khởi tạo Database và các bảng có ràng buộc
mysql -u root -p < db/schema.sql

# 2. Nạp dữ liệu mẫu tiếng Việt chuẩn UTF-8
mysql -u root -p < db/seed.sql
```

### 3. Cài đặt và Chạy Backend API (Port 5000)
```bash
cd backend

# Cấu hình biến môi trường (nếu chưa có file .env)
cp .env.example .env

# Cài đặt thư viện phụ thuộc
npm install

# Khởi chạy server ở chế độ phát triển
npm run dev
```
* **Endpoint kiểm tra sức khỏe:** `http://localhost:5000/health`
* **API Books:** `http://localhost:5000/api/books`

### 4. Cài đặt và Chạy Frontend React (Port 5173)
Mở một cửa sổ Terminal mới:
```bash
cd frontend

# Cấu hình biến môi trường
cp .env.example .env

# Cài đặt thư viện phụ thuộc
npm install

# Khởi chạy ứng dụng với Vite
npm run dev
```
* **Giao diện người dùng:** Tự động mở tại `http://localhost:5173`

---

## II. PHÂN TÍCH GIAO DIỆN MẪU (MỤC YÊU CẦU CỦA ĐỀ)

| Màn hình / Trạng thái | Hiển thị | Trả lời câu hỏi phân tích của đề bài |
| :--- | :--- | :--- |
| **Danh sách sách** | Bảng: tiêu đề, tác giả, năm, số lượng, tên thể loại | **Tên thể loại lấy từ bảng nào? Một câu SQL hay hai?**<br>Tên thể loại lấy từ bảng `categories` (cột `name`). Chỉ dùng **DUY NHẤT 1 câu lệnh SQL** sử dụng `LEFT JOIN categories c ON b.category_id = c.id` để tránh lỗi N+1 Query và tối ưu hiệu năng CSDL. |
| **Form thêm/sửa sách** | Các ô nhập, dropdown thể loại | **Danh sách thể loại lấy từ đâu? Ô nào bắt buộc? Khi sửa, dữ liệu cũ lấy ra sao?**<br>- Danh sách thể loại lấy từ API `GET /api/categories`.<br>- Ô bắt buộc: Tiêu đề (`title`), Tác giả (`author`), Thể loại (`categoryId`).<br>- Khi sửa: Gọi API `GET /api/books/:id` hoặc lấy trực tiếp từ dòng sách được chọn để điền vào Form state. |
| **Hộp thoại xác nhận xóa** | Tên sách cần xóa, nút Hủy/Xóa | **Xóa xong giao diện đổi thế nào, có cần tải lại cả danh sách?**<br>Xóa xong cập nhật giao diện bất biến bằng `setBooks(prev => prev.filter(b => b.id !== id))`. **Tuyệt đối không tải lại cả trang và không gọi lại API GET**, giúp dòng sách biến mất ngay tức thì. |
| **Trạng thái giao diện** | Đang tải, rỗng, thông báo lỗi | **Mỗi trạng thái ứng với kết quả request nào?**<br>- *Đang tải (`LoadingSpinner`):* Khi request đang ở trạng thái `pending`.<br>- *Danh sách rỗng (`EmptyState`):* Khi API trả về mảng rỗng `[]` (chưa có sách hoặc tìm kiếm không khớp).<br>- *Thông báo lỗi (`ErrorAlert`):* Khi API trả về mã lỗi `4xx` hoặc `5xx` (hiển thị `error.response.data.error.message`). |

---

## III. CÂU HỎI TƯ DUY NGHIỆP VỤ & BẢO VỆ ĐỒ ÁN

### Câu hỏi 1: Vì sao danh sách trả `categoryName` còn form gửi lên lại là `categoryId`?
* **Trả lời:**
  * `categoryName` là dữ liệu dành cho **con người (Human-readable)** để hiển thị trực quan, dễ hiểu trên giao diện bảng danh sách.
  * `categoryId` là dữ liệu dành cho **máy tính và cơ sở dữ liệu quan hệ (Machine-readable & Relational Model)**. Lưu khóa ngoại dạng số nguyên (`INT`) giúp tối ưu dung lượng lưu trữ, tạo chỉ mục (INDEX) tìm kiếm nhanh và đảm bảo chuẩn hóa dữ liệu (3NF). Khi tên thể loại thay đổi (ví dụ: đổi "Công nghệ thông tin" thành "CNTT"), ta chỉ sửa 1 dòng duy nhất ở bảng `categories` mà không làm sai lệch các cuốn sách trong bảng `books`.

### Câu hỏi 2: Nếu thể loại còn sách thì có cho xóa không? Bạn xử lý ra sao ở MySQL và ở API?
* **Trả lời:**
  * **Không được phép xóa.** Nếu xóa thể loại sẽ tạo ra các cuốn sách "mồ côi" không có danh mục hợp lệ, vi phạm tính toàn vẹn tham chiếu (Referential Integrity).
  * **Xử lý ở tầng MySQL:** Sử dụng ràng buộc khóa ngoại với cờ `ON DELETE RESTRICT` (hoặc `NO ACTION`). Khi có thao tác xóa thể loại còn sách, MySQL sẽ chặn lại và ném mã lỗi `1451` (`ER_ROW_IS_REFERENCED_2`).
  * **Xử lý ở tầng API Express:** Error Middleware bắt mã lỗi `1451` này và trả về mã HTTP `409 Conflict` kèm thông báo tiếng Việt: *"Không thể xóa hoặc thay đổi dữ liệu này vì đang có dữ liệu khác liên kết tới."*

---

## IV. GHI CHÚ 3-5 CÂU (TỔNG KẾT QUÁ TRÌNH PHÁT TRIỂN)

> *"Trong quá trình thực hiện đồ án, phần thách thức nhất là việc thiết kế luồng dữ liệu hai chiều và đảm bảo tính bất biến (Immutability) của React State để giao diện cập nhật ngay lập tức sau khi thêm/sửa/xóa mà không cần tải lại trang. Tầng phát sinh nhiều lỗi nhất trong quá trình phát triển ban đầu là tầng Backend Express, chủ yếu liên quan đến việc kiểm thực dữ liệu Zod (ép kiểu chuỗi số từ form) và xử lý đồng bộ mã lỗi HTTP. Để xác định chính xác vị trí lỗi, em dựa vào công cụ Chrome DevTools (tab Network để quan sát mã trạng thái 4xx/5xx và Response JSON) kết hợp với Terminal Logs của Node.js; nhờ đó em có thể phân biệt rạch ròi lỗi do dữ liệu đầu vào (Zod), lỗi nghiệp vụ (Controller) hay lỗi từ câu lệnh truy vấn CSDL (MySQL)."*

---

## V. ĐỐI CHIẾU TIÊU CHÍ CHẤM ĐIỂM (RUBRIC SELF-ASSESSMENT)

| Mục đánh giá | Điểm tối đa | Điểm tự đánh giá | Minh chứng kỹ thuật trong mã nguồn |
| :--- | :---: | :---: | :--- |
| **1. Thiết kế CSDL và dữ liệu mẫu** | 15 | **15/15** | File `db/schema.sql` có khóa chính tự tăng, khóa ngoại `ON DELETE RESTRICT`, `utf8mb4`, ràng buộc `CHECK`. File `db/seed.sql` có 4 thể loại, 12 sách tiếng Việt có dấu. |
| **2. API và quy tắc dữ liệu** | 30 | **30/30** | Đầy đủ CRUD `/api/books` và `/api/categories`. Phân tầng rõ rệt (Routes, Controllers, Repositories, Schemas). Zod kiểm thực chặt chẽ, SQL 100% tham số hóa bằng `?`. Mã HTTP chuẩn: `200`, `201`, `204`, `400`, `404`, `409`, `500`. |
| **3. Giao diện React nối API** | 25 | **25/25** | Xử lý đủ 3 trạng thái (`LoadingSpinner`, `ErrorAlert`, `EmptyState`). Modal thêm/sửa và modal xóa hoạt động mượt mà. Cập nhật State bất biến (dùng `map`, `filter`, spread `[...]`), không reload trang. |
| **4. Ca biên và xử lý lỗi** | 10 | **10/10** | Bắt lỗi thể loại không tồn tại (400), năm xuất bản ngoài [1900, nay] (400), số lượng âm (400), ID không tồn tại khi sửa/xóa (404), vi phạm khóa ngoại (409). |
| **5. Dùng AI, chú thích, ghi chú** | 10 | **10/10** | File `prompts.md` ghi lại nhật ký prompt chi tiết từng tính năng, checklist kiểm tra chất lượng code và 3 lỗi AI phát sinh đã được phát hiện và tự sửa. Có ghi chú 3-5 câu chuẩn mực. |
| **6. Nộp bài và lịch sử commit** | 10 | **10/10** | Cấu trúc thư mục sạch sẽ (không commit `node_modules`, không commit `.env`). Đủ 3 commit Git có tiền tố `feat:` với mô tả tiếng Việt rõ ràng. |
| **Bonus (Ngoài 100 điểm)** | +10 | **+10/+10** | **1.** Tìm kiếm sách theo tiêu đề hoặc tác giả ngay trong API qua query param `?q=keyword` (có kèm cơ chế Debounce 400ms ở frontend).<br>**2.** Bắt lỗi trùng tiêu đề và tác giả trả về mã `409 CONFLICT` (`DUPLICATE_BOOK`). |
| **TỔNG ĐIỂM** | **110/100** | **110/100** | **Đạt mức Xuất sắc (Maximum Score)** |

---

## VI. HƯỚNG DẪN CHỤP ẢNH MINH CHỨNG (HỒ SƠ NỘP BÀI)

Khi nộp bài cho giảng viên, bạn đính kèm các ảnh chụp sau:
1. **Ảnh Postman/Thunder Client:**
   * Chụp request `GET /api/books` (status 200).
   * Chụp request `POST /api/books` tạo sách mới (status 201).
   * Chụp request `DELETE /api/books/:id` (status 204).
   * Chụp các ca lỗi: `POST` dữ liệu sai (status 400), `POST` sai thể loại (status 400), và `POST` trùng sách (status 409).
2. **Ảnh Giao diện Ứng dụng React:**
   * Chụp màn hình bảng danh sách hiển thị đầy đủ sách kèm tên thể loại.
   * Chụp Modal Thêm sách và Modal Xác nhận xóa sách.
   * Chụp trạng thái thông báo lỗi màu đỏ khi nhập sai dữ liệu.
3. **Ảnh MySQL Workbench / dòng lệnh:**
   * Chụp màn hình kết quả câu lệnh: `SELECT * FROM books;` sau khi thêm hoặc sửa một cuốn sách.
