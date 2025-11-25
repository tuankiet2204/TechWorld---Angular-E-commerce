const jwt = require("jsonwebtoken");

// QUAN TRỌNG: Cái này PHẢI GIỐNG HỆT bên userController.js
// Cách tốt nhất là lưu vào file .env, còn hiện tại mình hardcode cho đồng bộ
const JWT_SECRET = "bi_mat_khong_duoc_bat_mi_123";

exports.verifyToken = (req, res, next) => {
  // 1. Lấy header Authorization
  const authHeader = req.header("Authorization");

  // 2. Kiểm tra xem có header không và có đúng định dạng "Bearer <token>" không
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Vui lòng đăng nhập (Thiếu hoặc sai định dạng Token)" });
  }

  // 3. Tách lấy token (bỏ chữ "Bearer " đi)
  const token = authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Token rỗng" });

  // 4. Xác thực
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res
        .status(403)
        .json({ error: "Token không hợp lệ hoặc đã hết hạn" });
    }

    // 5. Lưu thông tin user đã giải mã vào req để dùng ở các hàm sau
    req.user = decoded;
    next();
  });
};
exports.isAdmin = (req, res, next) => {
  // req.user đã có sau khi chạy verifyToken ở trên
  if (req.user && req.user.role === "admin") {
    next(); // Là admin thì cho đi tiếp
  } else {
    return res.status(403).json({ error: "Bạn không có quyền Admin!" });
  }
};
