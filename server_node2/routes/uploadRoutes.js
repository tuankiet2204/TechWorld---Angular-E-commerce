const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

// API: POST /upload
// 'image' là tên key mà bạn phải gửi trong Postman
router.post("/", upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Vui lòng chọn file ảnh" });
    }

    // Tạo đường dẫn đầy đủ để Frontend có thể truy cập
    // Ví dụ: http://localhost:3000/uploads/1715...jpg
    const protocol = req.protocol;
    const host = req.get("host");
    const imageUrl = `${protocol}://${host}/uploads/${req.file.filename}`;

    res.json({
      message: "Upload thành công",
      url: imageUrl, // <--- Đây là cái bạn cần lấy để lưu vào DB
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
