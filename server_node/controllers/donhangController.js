const {
  DonHangModel,
  DonHangChiTietModel,
  SanPhamModel,
} = require("../database");
const sendEmail = require("../utils/sendEmail");

// Hàm gửi email xác nhận đơn hàng
const sendOrderConfirmationEmail = async (orderData, orderItems) => {
  const { ho_ten, email, id_don_hang } = orderData;

  // Tính tổng tiền
  let totalAmount = 0;
  let itemsHtml = "";

  for (let item of orderItems) {
    const product = await SanPhamModel.findByPk(item.id_sp);
    if (product) {
      const itemTotal = product.gia * item.so_luong;
      totalAmount += itemTotal;
      itemsHtml += `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #ddd;">${
            product.ten_sp
          }</td>
          <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">${
            item.so_luong
          }</td>
          <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">${product.gia.toLocaleString(
            "vi-VN"
          )} đ</td>
          <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">${itemTotal.toLocaleString(
            "vi-VN"
          )} đ</td>
        </tr>
      `;
    }
  }

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333; text-align: center;">🎉 Xác nhận đơn hàng thành công</h2>
      
      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Xin chào ${ho_ten},</strong></p>
        <p>Cảm ơn bạn đã đặt hàng tại cửa hàng của chúng tôi!</p>
        
        <div style="margin: 20px 0;">
          <p><strong>Số đơn hàng:</strong> <span style="color: #0066cc;">#${id_don_hang}</span></p>
          <p><strong>Ngày đặt:</strong> ${new Date().toLocaleString(
            "vi-VN"
          )}</p>
          <p><strong>Email:</strong> ${email}</p>
        </div>
      </div>

      <h3 style="color: #333; margin-top: 30px;">Chi tiết sản phẩm:</h3>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <thead>
          <tr style="background-color: #667eea; color: white;">
            <th style="padding: 10px; text-align: left;">Sản phẩm</th>
            <th style="padding: 10px; text-align: center;">Số lượng</th>
            <th style="padding: 10px; text-align: right;">Đơn giá</th>
            <th style="padding: 10px; text-align: right;">Tổng</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <div style="text-align: right; margin-top: 20px; padding-top: 20px; border-top: 2px solid #ddd;">
        <p style="font-size: 18px;"><strong>Tổng cộng: ${totalAmount.toLocaleString(
          "vi-VN"
        )} đ</strong></p>
      </div>

      <div style="background-color: #e8f5e9; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p><strong>📦 Trạng thái:</strong> Đơn hàng của bạn đang được xử lý. Chúng tôi sẽ gửi hàng sớm nhất có thể.</p>
      </div>

      <p style="color: #666; margin-top: 30px;">Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi:</p>
      <p style="color: #666;">📧 Email: trinhkietcv111@gmail.com<br>📱 Hotline: 0123-456-789</p>

      <p style="color: #999; text-align: center; margin-top: 30px; font-size: 12px;">
        Đây là email tự động, vui lòng không trả lời email này.
      </p>
    </div>
  `;

  await sendEmail(email, `✓ Xác nhận đơn hàng #${id_don_hang}`, html);
};

// Lưu đơn hàng mới
const luuDonHang = async (req, res) => {
  try {
    const { ho_ten, email, san_pham } = req.body;

    // Tạo đơn hàng mới
    const donHang = await DonHangModel.create({
      ho_ten,
      email,
      thoi_diem_mua: new Date(),
      status: 0,
      ghi_chu: "",
    });

    // Lưu chi tiết đơn hàng
    const chiTietPromises = san_pham.map((sp) =>
      DonHangChiTietModel.create({
        id_dh: donHang.id,
        id_sp: sp.id,
        so_luong: sp.so_luong,
      })
    );

    const chiTiet = await Promise.all(chiTietPromises);

    // Gửi email xác nhận
    try {
      await sendOrderConfirmationEmail(
        { ho_ten, email, id_don_hang: donHang.id },
        chiTiet
      );
      console.log("Email xác nhận đơn hàng đã được gửi thành công!");
    } catch (emailError) {
      console.error("Lỗi khi gửi email:", emailError);
      // Không dừng process, chỉ log lỗi
    }

    res.status(200).json({
      thanh_cong: true,
      thong_bao:
        "Đặt hàng thành công! Vui lòng kiểm tra email để nhận xác nhận.",
      id_don_hang: donHang.id,
    });
  } catch (error) {
    console.error("Lỗi lưu đơn hàng:", error);
    res.status(500).json({
      thanh_cong: false,
      thong_bao: "Có lỗi xảy ra khi lưu đơn hàng!",
    });
  }
};

// Lấy danh sách đơn hàng
const layDanhSachDonHang = async (req, res) => {
  try {
    const donHangs = await DonHangModel.findAll({
      order: [["id", "DESC"]],
    });
    res.status(200).json(donHangs);
  } catch (error) {
    console.error("Lỗi lấy danh sách đơn hàng:", error);
    res.status(500).json({ thong_bao: "Có lỗi xảy ra!" });
  }
};

// Lấy chi tiết đơn hàng
const layChiTietDonHang = async (req, res) => {
  try {
    const { id } = req.params;
    const chiTiet = await DonHangChiTietModel.findAll({
      where: { id_dh: id },
    });
    res.status(200).json(chiTiet);
  } catch (error) {
    console.error("Lỗi lấy chi tiết đơn hàng:", error);
    res.status(500).json({ thong_bao: "Có lỗi xảy ra!" });
  }
};

// Lấy đơn hàng theo email user
const layDonHangTheoEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const donHangs = await DonHangModel.findAll({
      where: { email: email },
      order: [["id", "DESC"]],
    });
    res.status(200).json(donHangs);
  } catch (error) {
    console.error("Lỗi lấy đơn hàng theo email:", error);
    res.status(500).json({ thong_bao: "Có lỗi xảy ra!" });
  }
};

// Cập nhật đơn hàng
const capNhatDonHang = async (req, res) => {
  try {
    const { id } = req.params;
    const { ho_ten, email, status, ghi_chu } = req.body;

    const donHang = await DonHangModel.findByPk(id);
    if (!donHang) {
      return res.status(404).json({ thong_bao: "Không tìm thấy đơn hàng!" });
    }

    donHang.ho_ten = ho_ten || donHang.ho_ten;
    donHang.email = email || donHang.email;
    donHang.status = status !== undefined ? status : donHang.status;
    donHang.ghi_chu = ghi_chu || donHang.ghi_chu;

    await donHang.save();
    res.status(200).json({
      thanh_cong: true,
      thong_bao: "Cập nhật đơn hàng thành công!",
      data: donHang,
    });
  } catch (error) {
    console.error("Lỗi cập nhật đơn hàng:", error);
    res.status(500).json({ thong_bao: "Có lỗi xảy ra!" });
  }
};

// Xóa đơn hàng
const xoaDonHang = async (req, res) => {
  try {
    const { id } = req.params;

    const donHang = await DonHangModel.findByPk(id);
    if (!donHang) {
      return res.status(404).json({ thong_bao: "Không tìm thấy đơn hàng!" });
    }

    // Xóa chi tiết đơn hàng trước
    await DonHangChiTietModel.destroy({ where: { id_dh: id } });

    // Xóa đơn hàng
    await donHang.destroy();

    res.status(200).json({
      thanh_cong: true,
      thong_bao: "Xóa đơn hàng thành công!",
    });
  } catch (error) {
    console.error("Lỗi xóa đơn hàng:", error);
    res.status(500).json({ thong_bao: "Có lỗi xảy ra!" });
  }
};

module.exports = {
  luuDonHang,
  layDanhSachDonHang,
  layChiTietDonHang,
  layDonHangTheoEmail,
  capNhatDonHang,
  xoaDonHang,
};
