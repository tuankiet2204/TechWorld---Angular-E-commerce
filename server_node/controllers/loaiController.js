const { LoaiModel } = require("../database");

// Lấy tất cả loại sản phẩm
const getAllLoai = async (req, res) => {
  try {
    const loai_arr = await LoaiModel.findAll({
      where: { an_hien: 1 },
      order: [["thu_tu", "ASC"]],
    });
    res.json(loai_arr);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Lấy loại sản phẩm theo ID
const getLoaiById = async (req, res) => {
  try {
    const loai = await LoaiModel.findByPk(req.params.id);
    if (!loai) {
      return res.status(404).json({ message: "Không tìm thấy loại sản phẩm" });
    }
    res.json(loai);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllLoai,
  getLoaiById,
};
