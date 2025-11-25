const express = require("express");
const router = express.Router();
const {
  getAllSanPham,
  getSanPhamHot,
  getSanPhamMoi,
  getSanPhamById,
  getSanPhamTrongLoai,
} = require("../controllers/sanphamController");

router.get("/", getAllSanPham);

router.get("/hot", getSanPhamHot);
router.get("/hot/:sosp", getSanPhamHot);

router.get("/moi", getSanPhamMoi);
router.get("/moi/:sosp", getSanPhamMoi);

router.get("/loai/:id", getSanPhamTrongLoai);

router.get("/:id", getSanPhamById);

module.exports = router;
