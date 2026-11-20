-- ==============================================================================
-- DATABASE SCHEMA: QUẢN LÝ THƯ VIỆN SÁCH (LIBRARY MANAGEMENT)
-- Bảng mã: utf8mb4 (hỗ trợ đầy đủ tiếng Việt có dấu và biểu tượng emoji)
-- Storage Engine: InnoDB (hỗ trợ Transaction và Foreign Key Constraints)
-- ==============================================================================

-- 1. Khởi tạo Cơ sở dữ liệu
CREATE DATABASE IF NOT EXISTS `library_db` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `library_db`;

-- 2. Xóa bảng theo thứ tự phụ thuộc (Bảng con xóa trước, bảng cha xóa sau)
DROP TABLE IF EXISTS `books`;
DROP TABLE IF EXISTS `categories`;

-- 3. Bảng cha: categories (Thể loại sách)
-- Ràng buộc:
--   - id: Khóa chính tự tăng (PRIMARY KEY AUTO_INCREMENT)
--   - name: Bắt buộc (NOT NULL), không trùng lặp (UNIQUE)
CREATE TABLE `categories` (
  `id` INT AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  CONSTRAINT `pk_categories` PRIMARY KEY (`id`),
  CONSTRAINT `uq_categories_name` UNIQUE (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Bảng con: books (Đầu sách trong thư viện)
-- Ràng buộc:
--   - id: Khóa chính tự tăng
--   - title: Tiêu đề sách, bắt buộc
--   - author: Tác giả, bắt buộc
--   - publish_year: Năm xuất bản (từ 1900 đến năm hiện tại)
--   - quantity: Số lượng trong kho (không âm, mặc định 0)
--   - category_id: Khóa ngoại trỏ tới categories(id)
--   - ON DELETE RESTRICT: Ngăn chặn xóa thể loại nếu còn sách liên kết
CREATE TABLE `books` (
  `id` INT AUTO_INCREMENT,
  `title` VARCHAR(200) NOT NULL,
  `author` VARCHAR(120) NOT NULL,
  `publish_year` INT NOT NULL,
  `quantity` INT NOT NULL DEFAULT 0,
  `category_id` INT NOT NULL,
  CONSTRAINT `pk_books` PRIMARY KEY (`id`),
  CONSTRAINT `fk_books_categories` FOREIGN KEY (`category_id`) 
    REFERENCES `categories` (`id`) 
    ON DELETE RESTRICT 
    ON UPDATE CASCADE,
  CONSTRAINT `chk_publish_year` CHECK (`publish_year` >= 1900),
  CONSTRAINT `chk_quantity` CHECK (`quantity` >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
