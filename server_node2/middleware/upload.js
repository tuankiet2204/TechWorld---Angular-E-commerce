const multer = require("multer");
const path = require("path");

// Cấu hình nơi lưu trữ
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Lưu vào thư mục public/uploads mà bạn vừa tạo
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    // Đặt tên file: timestamp-tên-gốc (Ví dụ: 1715000-vot-yonex.jpg)
    // Để tránh trường hợp 2 người upload cùng tên file bị ghi đè
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// Kiểm tra định dạng file (chỉ cho phép ảnh)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Chỉ được upload file ảnh!"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn 5MB
});

module.exports = upload;
