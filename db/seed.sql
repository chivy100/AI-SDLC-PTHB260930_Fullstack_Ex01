-- ==============================================================================
-- DATABASE SEED DATA: QUẢN LÝ THƯ VIỆN SÁCH
-- Dữ liệu mẫu tiếng Việt có dấu chuẩn UTF-8
-- ==============================================================================

SET NAMES utf8mb4;
USE `library_db`;

-- 1. Nạp dữ liệu mẫu cho bảng categories (4 thể loại phổ biến)
INSERT INTO `categories` (`id`, `name`) VALUES
(1, 'Khoa học - Công nghệ'),
(2, 'Văn học - Nghệ thuật'),
(3, 'Kinh tế - Quản trị'),
(4, 'Kỹ năng sống - Tâm lý');

-- 2. Nạp dữ liệu mẫu cho bảng books (12 đầu sách phong phú)
INSERT INTO `books` (`title`, `author`, `publish_year`, `quantity`, `category_id`) VALUES
('Lập trình ReactJS từ cơ bản đến nâng cao', 'Phạm Văn Duy', 2023, 15, 1),
('Clean Code - Mã sạch và nghệ thuật lập trình', 'Robert C. Martin', 2008, 12, 1),
('Thiết kế kiến trúc hệ thống phân tán', 'Nguyễn Hữu Thể', 2022, 8, 1),
('Nhập môn Trí tuệ nhân tạo và Machine Learning', 'Trần Đình Quế', 2024, 20, 1),
('Dế Mèn phiêu lưu ký', 'Tô Hoài', 1941, 35, 2),
('Số đỏ', 'Vũ Trọng Phụng', 1936, 18, 2),
('Mắt biếc', 'Nguyễn Nhật Ánh', 1990, 25, 2),
('Nhà giả kim', 'Paulo Coelho', 1988, 30, 2),
('Cha giàu cha nghèo', 'Robert Kiyosaki', 1997, 22, 3),
('Kinh tế học hài hước', 'Steven Levitt & Stephen Dubner', 2005, 14, 3),
('Đắc nhân tâm', 'Dale Carnegie', 1936, 40, 4),
('Tuổi trẻ đáng giá bao nhiêu?', 'Rosie Nguyễn', 2016, 28, 4);
