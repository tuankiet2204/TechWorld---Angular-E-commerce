const { LoaiModel } = require("./database");
const express = require("express");
const router = express.Router();
router.get("/", async (req, res) => {
  //lấy list record
  try {
    const loai_arr = await LoaiModel.findAll();
    res.json(loai_arr);
  } catch (err) {
    res.status(500).json({ thong_bao: "Lỗi1 server", err });
  }
});
router.get("/:id", async (req, res) => {
  //lấy 1 record
  try {
    const loai = await LoaiModel.findByPk(req.params.id);
    loai
      ? res.json(loai)
      : res.status(404).json({ thong_bao: "Không tìm thấy" });
  } catch (err) {
    res.status(500).json({ thong_bao: "Lỗi server", err });
  }
});
router.post("/", async (req, res) => {
  //thêm mới
  try {
    const loai = await LoaiModel.create(req.body);
    res.status(201).json(loai);
  } catch (err) {
    res.status(500).json({ thong_bao: "Lỗi server", err });
  }
});
router.put("/:id", async (req, res) => {
  // xập nhật
  try {
    const loai = await LoaiModel.findByPk(req.params.id);
    if (!loai) return res.status(404).json({ thong_bao: "Không tìm thấy" });
    await loai.update(req.body);
    res.json(loai);
  } catch (err) {
    res.status(500).json({ thong_bao: "Có lỗi.", err });
  }
});
router.delete("/:id", async (req, res) => {
  // Xxa
  try {
    const loai = await LoaiModel.findByPk(req.params.id);
    if (!loai) return res.status(404).json({ thong_bao: "Không tìm thấy" });
    await loai.destroy();
    res.json({ thong_bao: "Đã xóa thành công" });
  } catch (err) {
    res.status(500).json({ thong_bao: "Lỗi server", err });
  }
});
module.exports = router;
