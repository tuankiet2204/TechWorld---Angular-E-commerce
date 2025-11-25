const nodemailer = require("nodemailer");

// Cấu hình gửi mail (Dùng Gmail làm ví dụ)
// QUAN TRỌNG: Password ở đây không phải pass đăng nhập, mà là "Mật khẩu ứng dụng" (App Password)
// Cách lấy App Password: Vào Google Account -> Security -> 2-Step Verification -> App passwords
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "trinhkietcv111@gmail.com", // <--- Thay email của bạn vào đây
    pass: "ohmv jzzn phkj klwb", // <--- Thay mật khẩu ứng dụng vào đây
  },
});

const sendOTP = async (toEmail, otp) => {
  const mailOptions = {
    from: '"Badminton Shop" <no-reply@badminton.com>',
    to: toEmail,
    subject: "Mã xác thực (OTP) của bạn",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #2563eb;">Mã xác thực của bạn</h2>
        <p>Mã OTP của bạn là: <b style="font-size: 24px; letter-spacing: 2px;">${otp}</b></p>
        <p>Mã này sẽ hết hạn sau 5 phút.</p>
        <p>Vui lòng không chia sẻ mã này cho ai khác.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendOTP };
