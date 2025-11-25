const { NguoiDungModel } = require("../database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const dangKy = async (req, res) => {
  try {
    const { ho_ten, email, password } = req.body;

    const existingUser = await NguoiDungModel.findOne({
      where: { email: email },
    });
    if (existingUser) {
      return res.status(400).json({ message: "Email đã được sử dụng" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    const newUser = await NguoiDungModel.create({
      ho_ten: ho_ten,
      email: email,
      password: hashedPassword,
      otp: otp,
      otp_expires: otpExpires,
      isVerified: false,
    });

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #10b981;">Chào mừng ${newUser.ho_ten}!</h1>
        <p>Cảm ơn bạn đã đăng ký tài khoản. Vui lòng sử dụng mã OTP dưới đây để xác thực:</p>
        <div style="background-color: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0;">
          <h2 style="color: #10b981; font-size: 32px; letter-spacing: 5px; margin: 0;">${otp}</h2>
        </div>
        <p style="color: #ef4444;"><strong>Lưu ý:</strong> Mã OTP này sẽ hết hạn sau 5 phút.</p>
        <p>Nếu bạn không yêu cầu đăng ký, vui lòng bỏ qua email này.</p>
      </div>
    `;

    await sendEmail(newUser.email, "Mã OTP xác thực tài khoản", emailHtml);

    res.status(201).json({
      message: "Đăng ký thành công! Vui lòng kiểm tra email để lấy mã OTP.",
      userId: newUser.id,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
      return res
        .status(400)
        .json({ message: "Thiếu thông tin userId hoặc OTP" });
    }

    const user = await NguoiDungModel.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    if (user.isVerified) {
      return res
        .status(400)
        .json({ message: "Tài khoản đã được xác thực rồi" });
    }

    if (new Date() > new Date(user.otp_expires)) {
      return res
        .status(400)
        .json({ message: "Mã OTP đã hết hạn. Vui lòng đăng ký lại." });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Mã OTP không chính xác" });
    }

    await NguoiDungModel.update(
      {
        isVerified: true,
        otp: null,
        otp_expires: null,
      },
      { where: { id: userId } }
    );

    const token = jwt.sign(
      { id: user.id, email: user.email, ho_ten: user.ho_ten },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Xác thực thành công!",
      token: token,
      user: { id: user.id, email: user.email, ho_ten: user.ho_ten },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const guiOTPQuenMatKhau = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await NguoiDungModel.findOne({ where: { email: email } });
    if (!user) {
      return res
        .status(404)
        .json({ message: "Email không tồn tại trong hệ thống" });
    }

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    await NguoiDungModel.update(
      { otp: otp, otp_expires: otpExpires },
      { where: { email: email } }
    );

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #10b981;">Đặt lại mật khẩu</h1>
        <p>Bạn đã yêu cầu đặt lại mật khẩu. Vui lòng sử dụng mã OTP dưới đây:</p>
        <div style="background-color: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0;">
          <h2 style="color: #10b981; font-size: 32px; letter-spacing: 5px; margin: 0;">${otp}</h2>
        </div>
        <p style="color: #ef4444;"><strong>Lưu ý:</strong> Mã OTP này sẽ hết hạn sau 5 phút.</p>
        <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
      </div>
    `;

    await sendEmail(user.email, "Mã OTP đặt lại mật khẩu", emailHtml);

    res.status(200).json({
      message: "Mã OTP đã được gửi đến email của bạn!",
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const datLaiMatKhau = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res
        .status(400)
        .json({ message: "Thiếu thông tin email, OTP hoặc mật khẩu mới" });
    }

    const user = await NguoiDungModel.findOne({ where: { email: email } });
    if (!user) {
      return res.status(404).json({ message: "Email không tồn tại" });
    }

    if (new Date() > new Date(user.otp_expires)) {
      return res.status(400).json({ message: "Mã OTP đã hết hạn" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Mã OTP không chính xác" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await NguoiDungModel.update(
      {
        password: hashedPassword,
        otp: null,
        otp_expires: null,
      },
      { where: { email: email } }
    );

    res.status(200).json({
      message: "Đặt lại mật khẩu thành công! Bạn có thể đăng nhập ngay.",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME_MINUTES = 15;

const dangNhap = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await NguoiDungModel.findOne({ where: { email: email } });
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    // Kiểm tra tài khoản đã được xác thực chưa
    if (!user.isVerified) {
      return res.status(403).json({
        message: "Tài khoản chưa được xác thực. Vui lòng kiểm tra email.",
      });
    }

    // Kiểm tra tài khoản có bị khóa không
    if (user.accountLockedUntil && user.accountLockedUntil > new Date()) {
      const remainingTime = Math.ceil(
        (user.accountLockedUntil - new Date()) / 60000
      ); // Phút
      return res.status(429).send({
        message: `Tài khoản của bạn đã bị khóa. Vui lòng thử lại sau ${remainingTime} phút.`,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // Tăng bộ đếm
      user.failedLoginAttempts += 1;

      if (user.failedLoginAttempts >= MAX_LOGIN_ATTEMPTS) {
        // Khóa tài khoản
        const lockUntil = new Date();
        lockUntil.setMinutes(lockUntil.getMinutes() + LOCK_TIME_MINUTES);
        user.accountLockedUntil = lockUntil;

        // Lưu lại và thông báo khóa
        await user.save();
        return res.status(429).send({
          message: `Bạn đã nhập sai quá ${MAX_LOGIN_ATTEMPTS} lần. Tài khoản bị khóa trong ${LOCK_TIME_MINUTES} phút.`,
        });
      } else {
        // Chỉ lưu lại và thông báo sai
        await user.save();
        const attemptsLeft = MAX_LOGIN_ATTEMPTS - user.failedLoginAttempts;
        return res.status(400).json({
          message: `Sai email hoặc mật khẩu. Bạn còn ${attemptsLeft} lần thử.`,
        });
      }
    }

    // Reset số lần đăng nhập sai khi đăng nhập thành công
    if (user.failedLoginAttempts > 0 || user.accountLockedUntil) {
      user.failedLoginAttempts = 0;
      user.accountLockedUntil = null;
      await user.save(); // Lưu lại trạng thái bình thường
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, ho_ten: user.ho_ten, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Đăng nhập thành công!",
      token: token,
      user: {
        id: user.id,
        email: user.email,
        ho_ten: user.ho_ten,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const layThongTinUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await NguoiDungModel.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    res.status(200).json({
      id: user.id,
      ho_ten: user.ho_ten,
      email: user.email,
      dia_chi: user.dia_chi,
      dien_thoai: user.dien_thoai,
      isVerified: user.isVerified,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const capNhatThongTin = async (req, res) => {
  try {
    const userId = req.params.id;
    const { ho_ten, dia_chi, dien_thoai } = req.body;

    const user = await NguoiDungModel.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    await NguoiDungModel.update(
      { ho_ten, dia_chi, dien_thoai },
      { where: { id: userId } }
    );

    res.status(200).json({ message: "Cập nhật thông tin thành công!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const doiMatKhau = async (req, res) => {
  try {
    const userId = req.params.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Thiếu thông tin mật khẩu" });
    }

    const user = await NguoiDungModel.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Mật khẩu hiện tại không đúng" });
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res
        .status(400)
        .json({ message: "Mật khẩu mới phải khác mật khẩu cũ" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await NguoiDungModel.update(
      { password: hashedPassword },
      { where: { id: userId } }
    );

    res.status(200).json({ message: "Đổi mật khẩu thành công!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  dangKy,
  dangNhap,
  verifyOTP,
  guiOTPQuenMatKhau,
  datLaiMatKhau,
  layThongTinUser,
  capNhatThongTin,
  doiMatKhau,
};
