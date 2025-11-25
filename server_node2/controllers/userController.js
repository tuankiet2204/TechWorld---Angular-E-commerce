const db = require("../database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendOTP } = require("../utils/emailService");

const JWT_SECRET = "bi_mat_khong_duoc_bat_mi_123";
const SALT_ROUNDS = 10;

// Hàm tạo OTP ngẫu nhiên 6 số
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// 1. ĐĂNG KÝ (Tạo user + Gửi OTP)
exports.register = async (req, res) => {
  try {
    const { email, password, full_name, phone, address } = req.body;

    // Check email trùng
    const [exists] = await db
      .promise()
      .query("SELECT id FROM users WHERE email = ?", [email]);
    if (exists.length > 0)
      return res.status(409).json({ error: "Email đã tồn tại" });

    // Mã hóa pass & Tạo OTP
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // Hết hạn sau 5 phút

    // Lưu user với trạng thái chưa xác thực (is_verified = 0)
    const sql = `
      INSERT INTO users (email, password_hash, full_name, phone, address, role, otp_code, otp_expires_at, is_verified) 
      VALUES (?, ?, ?, ?, ?, 'customer', ?, ?, 0)
    `;

    await db
      .promise()
      .query(sql, [
        email,
        hashedPassword,
        full_name,
        phone,
        address,
        otp,
        otpExpires,
      ]);

    // Gửi mail
    await sendOTP(email, otp);

    res.status(201).json({
      message: "Đăng ký thành công! Vui lòng kiểm tra email để nhập mã OTP.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi server" });
  }
};

// 2. XÁC THỰC TÀI KHOẢN (Nhập OTP sau khi đăng ký)
exports.verifyAccount = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const [users] = await db
      .promise()
      .query("SELECT * FROM users WHERE email = ?", [email]);
    if (users.length === 0)
      return res.status(404).json({ error: "Email không tồn tại" });

    const user = users[0];

    // Kiểm tra OTP
    if (user.otp_code !== otp)
      return res.status(400).json({ error: "Mã OTP không đúng" });
    if (new Date() > new Date(user.otp_expires_at))
      return res.status(400).json({ error: "Mã OTP đã hết hạn" });

    // Kích hoạt tài khoản & Xóa OTP
    await db
      .promise()
      .query(
        "UPDATE users SET is_verified = 1, otp_code = NULL, otp_expires_at = NULL WHERE id = ?",
        [user.id]
      );

    res.json({
      message: "Xác thực tài khoản thành công! Bạn có thể đăng nhập ngay.",
    });
  } catch (error) {
    res.status(500).json({ error: "Lỗi server" });
  }
};

// 3. ĐĂNG NHẬP (Có check đã xác thực chưa)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const [users] = await db
      .promise()
      .query("SELECT * FROM users WHERE email = ?", [email]);

    if (users.length === 0)
      return res.status(401).json({ error: "Sai email hoặc mật khẩu" });
    const user = users[0];

    // Check xác thực
    if (user.is_verified === 0) {
      return res
        .status(403)
        .json({ error: "Tài khoản chưa xác thực. Vui lòng kiểm tra email." });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch)
      return res.status(401).json({ error: "Sai email hoặc mật khẩu" });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      message: "Đăng nhập thành công",
      token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Lỗi server" });
  }
};

// 4. QUÊN MẬT KHẨU (Gửi OTP)
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const [users] = await db
      .promise()
      .query("SELECT id FROM users WHERE email = ?", [email]);
    if (users.length === 0)
      return res.status(404).json({ error: "Email không tồn tại" });

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    // Cập nhật OTP mới vào DB
    await db
      .promise()
      .query(
        "UPDATE users SET otp_code = ?, otp_expires_at = ? WHERE email = ?",
        [otp, otpExpires, email]
      );

    // Gửi mail
    await sendOTP(email, otp);

    res.json({ message: "Đã gửi mã OTP đặt lại mật khẩu vào email của bạn" });
  } catch (error) {
    res.status(500).json({ error: "Lỗi server" });
  }
};

// 5. ĐẶT LẠI MẬT KHẨU MỚI (Reset Password)
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const [users] = await db
      .promise()
      .query("SELECT * FROM users WHERE email = ?", [email]);
    if (users.length === 0)
      return res.status(404).json({ error: "Email không tồn tại" });
    const user = users[0];

    if (user.otp_code !== otp)
      return res.status(400).json({ error: "OTP sai" });
    if (new Date() > new Date(user.otp_expires_at))
      return res.status(400).json({ error: "OTP hết hạn" });

    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

    await db
      .promise()
      .query(
        "UPDATE users SET password_hash = ?, otp_code = NULL, otp_expires_at = NULL WHERE id = ?",
        [hashedPassword, user.id]
      );

    res.json({ message: "Đặt lại mật khẩu thành công. Hãy đăng nhập lại." });
  } catch (error) {
    res.status(500).json({ error: "Lỗi server" });
  }
};

// ... (Giữ lại các hàm getProfile, updateProfile, changePassword cũ nếu cần)
exports.getProfile = async (req, res) => {
  /* Code như cũ */
};
exports.updateProfile = async (req, res) => {
  /* Code như cũ */
};
exports.changePassword = async (req, res) => {
  /* Code như cũ */
};
