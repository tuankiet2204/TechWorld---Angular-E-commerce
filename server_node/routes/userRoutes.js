const express = require("express");
const router = express.Router();
const {
  dangKy,
  dangNhap,
  verifyOTP,
  guiOTPQuenMatKhau,
  datLaiMatKhau,
  layThongTinUser,
  capNhatThongTin,
  doiMatKhau,
} = require("../controllers/userController");

router.post("/dang-ky", dangKy);
router.post("/dang-nhap", dangNhap);
router.post("/verify-otp", verifyOTP);
router.post("/quen-mat-khau/gui-otp", guiOTPQuenMatKhau);
router.post("/quen-mat-khau/dat-lai", datLaiMatKhau);
router.get("/:id", layThongTinUser);
router.put("/:id", capNhatThongTin);
router.put("/:id/doi-mat-khau", doiMatKhau);
module.exports = router;
