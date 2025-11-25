const express = require("express");
const router = express.Router();
const { getAllLoai, getLoaiById } = require("../controllers/loaiController");

router.get("/", getAllLoai);

router.get("/:id", getLoaiById);

module.exports = router;
