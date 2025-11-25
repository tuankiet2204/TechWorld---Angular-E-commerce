const { SanPhamModel } = require("../database");

const getAllSanPham = async (req, res) => {
  try {
    const sp_arr = await SanPhamModel.findAll({
      where: { an_hien: 1 },
      order: [
        ["ngay", "DESC"],
        ["gia", "ASC"],
      ],
    });
    res.json(sp_arr);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSanPhamHot = async (req, res) => {
  try {
    const sosp = Number(req.query.sosp) || 12;
    const sp_arr = await SanPhamModel.findAll({
      where: { an_hien: 1, hot: 1 },
      order: [
        ["ngay", "DESC"],
        ["gia", "ASC"],
      ],
      offset: 0,
      limit: sosp,
    });
    res.json(sp_arr);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSanPhamMoi = async (req, res) => {
  try {
    const sosp = Number(req.query.sosp) || 8;
    const sp_arr = await SanPhamModel.findAll({
      where: { an_hien: 1 },
      order: [
        ["ngay", "DESC"],
        ["gia", "ASC"],
      ],
      offset: 0,
      limit: sosp,
    });
    res.json(sp_arr);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSanPhamById = async (req, res) => {
  console.log("Request params:", req.params);
  console.log("Request query:", req.query);
  console.log("Request id:", req.params.id);
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "ID sản phẩm không hợp lệ" });
    }
    const sp = await SanPhamModel.findOne({
      where: { id: id },
    });

    if (!sp) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    res.json(sp);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSanPhamTrongLoai = async (req, res) => {
  try {
    const id_loai = Number(req.params.id);
    const sp_arr = await SanPhamModel.findAll({
      where: { id_loai: id_loai, an_hien: 1 },
      order: [
        ["ngay", "DESC"],
        ["gia", "ASC"],
      ],
    });
    res.json(sp_arr);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllSanPham,
  getSanPhamHot,
  getSanPhamMoi,
  getSanPhamById,
  getSanPhamTrongLoai,
};
