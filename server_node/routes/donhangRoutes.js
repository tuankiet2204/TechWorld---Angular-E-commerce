const express = require("express");
const router = express.Router();
const donhangController = require("../controllers/donhangController");

router.get("/luudonhang", (req, res) => {
  res.json({
    message: "Endpoint này yêu cầu POST method để lưu đơn hàng",
    example: {
      method: "POST",
      url: "http://localhost:3005/api/luudonhang",
      body: {
        ho_ten: "Nguyễn Văn A",
        email: "test@example.com",
        san_pham: [{ id: 1, so_luong: 2 }],
      },
    },
  });
});

router.post("/luudonhang", donhangController.luuDonHang);

router.get("/don-hang", donhangController.layDanhSachDonHang);

router.get("/donhang", donhangController.layDanhSachDonHang);

router.get("/don-hang/:id", donhangController.layChiTietDonHang);

router.get("/donhang/:id", donhangController.layChiTietDonHang);

router.put("/don-hang/:id", donhangController.capNhatDonHang);

router.delete("/don-hang/:id", donhangController.xoaDonHang);

router.get("/donhang-user/:email", donhangController.layDonHangTheoEmail);

module.exports = router;
