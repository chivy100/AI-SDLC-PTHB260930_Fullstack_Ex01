# NHẬT KÝ SỬ DỤNG AI CODING AGENT (PROMPTS.MD)

Dự án: Quản lý thư viện sách (Fullstack CRUD React + Express + MySQL)  
Học viên / Lập trình viên: [Họ và tên của bạn]  
Nguyên tắc: AI hỗ trợ sinh code -> Lập trình viên thẩm định (Code Review) -> Phát hiện lỗi -> Tự sửa chữa và hoàn thiện.

---

## BẢNG CHECKLIST KIỂM TRA CHẤT LƯỢNG CODE (CODE QUALITY CHECKLIST)
Trước khi đưa code do AI sinh vào hệ thống, luôn kiểm tra theo checklist sau:
- [x] **Tham số hóa SQL:** Mọi câu lệnh SQL đều dùng dấu `?` và mảng tham số, tuyệt đối không nối chuỗi.
- [x] **Validation:** Dữ liệu đầu vào (body, params, query) đều được kiểm thực qua Zod Schema.
- [x] **Mã trạng thái HTTP:** Trả về đúng quy chuẩn (`200`, `201`, `204`, `400`, `404`, `409`, `500`).
- [x] **Bảo mật:** Không hardcode thông tin kết nối CSDL, cổng server; đưa toàn bộ vào `.env`.
- [x] **Chuẩn giao tiếp:** JSON trả về đúng chuẩn `camelCase`, định dạng lỗi theo chuẩn `{ error: { code, message, details } }`.
- [x] **Frontend State:** Cập nhật State bất biến (immutable), không reload trang.

---

## TÍNH NĂNG 1: THIẾT KẾ CƠ SỞ DỮ LIỆU & DỮ LIỆU MẪU (DATABASE SCHEMA & SEED)

### 1. Prompt gửi AI:
```text
Hãy viết 2 file SQL cho hệ thống Quản lý thư viện sách dùng MySQL:
1. db/schema.sql:
   - Tạo CSDL library_db bảng mã utf8mb4, collate utf8mb4_unicode_ci.
   - Bảng categories: id (INT, PK, AUTO_INCREMENT), name (VARCHAR(100), NOT NULL, UNIQUE).
   - Bảng books: id (INT, PK, AUTO_INCREMENT), title (VARCHAR(200), NOT NULL), author (VARCHAR(120), NOT NULL), publish_year (INT, từ 1900 đến nay), quantity (INT, >= 0, DEFAULT 0), category_id (INT, FK trỏ tới categories.id).
   - Thiết lập ràng buộc khóa ngoại không cho phép xóa thể loại nếu còn sách liên kết (ON DELETE RESTRICT).
   - Thêm ràng buộc CHECK cho publish_year và quantity.
2. db/seed.sql:
   - Nạp tối thiểu 4 thể loại phổ biến.
   - Nạp tối thiểu 12 đầu sách thực tế bằng tiếng Việt có dấu chuẩn UTF-8.
```

### 2. Kết quả AI sinh ra:
- Tạo ra 2 file `db/schema.sql` và `db/seed.sql` với cấu trúc bảng và dữ liệu mẫu tiếng Việt.

### 3. Lỗi AI phát sinh mà tôi tự phát hiện và cách khắc phục:
- **Lỗi phát hiện:** Ban đầu AI tạo câu lệnh `DROP TABLE IF EXISTS categories;` trước `DROP TABLE IF EXISTS books;`. 
- **Tại sao đây là lỗi?** Bảng `books` có khóa ngoại tham chiếu đến bảng `categories`. Trong MySQL, nếu xóa bảng cha (`categories`) trước khi xóa bảng con (`books`), MySQL sẽ báo lỗi vi phạm ràng buộc khóa ngoại `Cannot drop table 'categories' referenced by a foreign key constraint 'fk_books_categories'`.
- **Cách khắc phục:** Đảo ngược thứ tự xóa bảng: phải `DROP TABLE IF EXISTS books;` trước, sau đó mới `DROP TABLE IF EXISTS categories;`. Đồng thời bổ sung `ENGINE=InnoDB` để đảm bảo MySQL kích hoạt đầy đủ tính năng kiểm tra khóa ngoại.


---

## TÍNH NĂNG 2: XÂY DỰNG BACKEND EXPRESS THEO KIẾN TRÚC PHÂN TẦNG VÀ VALIDATION ZOD

### 1. Prompt gửi AI:
```text
Hãy xây dựng hệ thống Backend Node.js 18+ Express 4 (CommonJS) cho quản lý thư viện sách:
- Cấu trúc thư mục phân tầng rõ ràng: config, schemas, repositories, controllers, routes, middlewares.
- Dùng mysql2/promise với Connection Pool dùng chung trong src/config/db.js.
- Viết Zod Schema trong src/schemas/book.schema.js kiểm tra chặt chẽ:
  + title, author không rỗng
  + publishYear từ 1900 đến năm hiện tại
  + quantity >= 0, default 0
  + categoryId là số dương
- Viết BookRepository dùng SQL thuần với Prepared Statements (dấu ?), dùng LEFT JOIN lấy categoryName và Alias AS camelCase.
- Viết BookController xử lý đầy đủ CRUD:
  + GET /api/books (hỗ trợ ?q=)
  + GET /api/books/:id (404 nếu không thấy)
  + POST /api/books (400 nếu category không tồn tại, 409 nếu trùng title+author, 201 trả về sách mới)
  + PUT /api/books/:id (404 nếu không thấy, 400 nếu sai thể loại, 200 trả về sách cập nhật)
  + DELETE /api/books/:id (404 nếu không thấy, 204 No Content không kèm body)
- Viết Centralized Error Middleware bắt ZodError, AppError, MySQL FK error 1451, duplicate 1062 và trả về đúng định dạng { error: { code, message, details } }.
```

### 2. Kết quả AI sinh ra:
- Khởi tạo đầy đủ các tầng Routes, Controllers, Repositories, Schemas và Error Handler.

### 3. Lỗi AI phát sinh mà tôi tự phát hiện và cách khắc phục:
- **Lỗi 1 (Sai chuẩn Zod khi nhận dữ liệu từ Form):** Ban đầu AI dùng `z.number()` cho các trường `publishYear`, `quantity`, `categoryId`. Khi Frontend gửi form hoặc khi test qua URL param, các giá trị này thường ở dạng chuỗi (ví dụ `"2024"`, `"1"`), dẫn đến Zod quăng lỗi `Expected number, received string`. 
  - *Khắc phục:* Đổi sang `z.coerce.number()`, giúp Zod tự động ép kiểu chuỗi số sang số nguyên một cách an toàn trước khi kiểm tra min/max.
- **Lỗi 2 (Vi phạm chuẩn HTTP ở API DELETE):** AI viết `res.status(204).json({ message: "Xóa thành công" });`. Theo đặc tả RFC 7231, mã `204 No Content` cấm gửi kèm response body; việc gửi kèm JSON khiến một số client hoặc proxy báo lỗi hoặc bỏ qua body gây lãng phí.
  - *Khắc phục:* Sửa thành `res.status(204).send();` hoàn toàn không có body.


---

## TÍNH NĂNG 3: XÂY DỰNG FRONTEND REACT 18 + VITE + AXIOS + CUSTOM HOOK USEBOOKS

### 1. Prompt gửi AI:
```text
Hãy xây dựng ứng dụng Frontend React 18 với Vite và Bootstrap 5 cho hệ thống Quản lý Thư viện Sách:
1. api/axiosClient.js: Cấu hình Axios instance có baseURL từ import.meta.env.VITE_API_URL, tự động trích xuất response.data.
2. api/bookApi.js & api/categoryApi.js: Các hàm gọi API tương ứng với Backend.
3. hooks/useBooks.js: Custom Hook quản lý toàn bộ State (books, categories, isLoading, error, searchTerm, isSubmitting, isDeleting):
   - loadBooks(searchTerm) có cơ chế debounce 400ms.
   - Thêm/sửa/xóa sách cập nhật State bất biến (immutable update) ngay lập tức, không reload trang.
   - Trích xuất thông báo lỗi từ error.response.data.error.message.
4. Các Component:
   - Navbar.jsx: Tiêu đề, ô tìm kiếm sách ?q=, nút Thêm sách mới.
   - BookTable.jsx: Bảng hiển thị sách kèm tên thể loại, badge số lượng, nút Sửa, nút Xóa.
   - BookFormModal.jsx: Modal Thêm/Sửa sách, validate client, hiển thị invalid-feedback.
   - DeleteConfirmModal.jsx: Modal xác nhận hiển thị tên sách cần xóa, nút Xác nhận đỏ.
   - LoadingSpinner.jsx, ErrorAlert.jsx, EmptyState.jsx: Xử lý 3 trạng thái giao diện.
```

### 2. Kết quả AI sinh ra:
- Tạo đầy đủ cây thư mục Frontend React 18 với giao diện Bootstrap 5 hiện đại, các modal và hook.

### 3. Lỗi AI phát sinh mà tôi tự phát hiện và cách khắc phục:
- **Lỗi 1 (Đột biến State trực tiếp - State Mutation):** Ban đầu AI viết hàm xóa sách bằng cách:
  ```javascript
  const index = books.findIndex(b => b.id === id);
  books.splice(index, 1);
  setBooks(books);
  ```
  Trong React, cách làm này làm biến đổi trực tiếp mảng `books` gốc mà không đổi tham chiếu (reference pointer) của mảng trong bộ nhớ. React sẽ so sánh nông (`Object.is(prev, next)`) và thấy tham chiếu cũ nên KHÔNG kích hoạt re-render giao diện, khiến dòng sách vẫn còn trơ trơ trên màn hình.
  - *Khắc phục:* Sửa lại thành cập nhật bất biến (Immutable): `setBooks(prev => prev.filter(b => b.id !== id));`. Mảng mới có địa chỉ vùng nhớ mới, kích hoạt render ngay lập tức.
- **Lỗi 2 (Hiển thị lỗi chung chung):** Khi API trả về lỗi 400 (do Zod hoặc thể loại không tồn tại), AI chỉ `catch (err) { alert(err.message); }`, hiển thị `"Request failed with status code 400"`.
  - *Khắc phục:* Tạo component `ErrorAlert.jsx` và bóc tách đúng cấu trúc lỗi do backend quy định: `err.response?.data?.error?.message` và danh sách `details`, giúp thủ thư nhìn thấy rõ ràng lỗi tiếng Việt cụ thể.
