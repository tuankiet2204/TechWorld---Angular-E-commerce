require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { sequelize } = require("./database");

const loaiRoutes = require("./routes/loaiRoutes");
const sanphamRoutes = require("./routes/sanphamRoutes");
const userRoutes = require("./routes/userRoutes");
const donhangRoutes = require("./routes/donhangRoutes");

const app = express();
const port = 3005;

app.use(cors());
app.use(express.json());

var adminLoai = require("./admin");
app.use("/admin/loai", adminLoai);

app.use("/api/loai", loaiRoutes);
app.use("/api/sanpham", sanphamRoutes);
app.use("/api/users", userRoutes);
app.use("/api", donhangRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Server đang chạy thành công!",
    time: new Date(),
    apiEndpoint: "/api",
  });
});

sequelize
  .authenticate()
  .then(() => {
    console.log("✓ Kết nối database thành công!");

    app
      .listen(port, () => {
        console.log(`✓ Server đang chạy ở port ${port}`);
      })
      .on("error", function (err) {
        console.log(`Lỗi xảy ra khi chạy ứng dụng ${err}`);
      });
  })
  .catch((err) => {
    console.error("✗ Lỗi kết nối database:", err);
  });
