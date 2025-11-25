const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize("laptop_node", "root", "220401", {
  host: "localhost",
  dialect: "mysql",
});

const LoaiModel = sequelize.define(
  "loai",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    ten_loai: { type: DataTypes.STRING, allowNull: false },
    thu_tu: { type: DataTypes.INTEGER, defaultValue: 0 },
    an_hien: { type: DataTypes.INTEGER, defaultValue: 0 },
  },
  { timestamps: false, tableName: "loai" }
);

const SanPhamModel = sequelize.define(
  "san_pham",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    ten_sp: { type: DataTypes.STRING },
    ngay: { type: DataTypes.DATE },
    gia: { type: DataTypes.INTEGER },
    gia_km: { type: DataTypes.INTEGER },
    id_loai: { type: DataTypes.INTEGER },
    hot: { type: DataTypes.INTEGER },
    an_hien: { type: DataTypes.INTEGER },
    hinh: { type: DataTypes.STRING },
    tinh_chat: { type: DataTypes.INTEGER, defaultValue: 0 },
    luot_xem: { type: DataTypes.INTEGER, defaultValue: 0 },
  },
  { timestamps: false, tableName: "san_pham" }
);
const NguoiDungModel = sequelize.define(
  "nguoi_dung",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    ho_ten: { type: DataTypes.STRING },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: { type: DataTypes.STRING, allowNull: false },
    isVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    otp: { type: DataTypes.STRING, allowNull: true },
    otp_expires: { type: DataTypes.DATE, allowNull: true },
    failedLoginAttempts: { 
      type: DataTypes.INTEGER, 
      allowNull: false, 
      defaultValue: 0 
    },
    accountLockedUntil: { type: DataTypes.DATE, allowNull: true },
    role: { 
      type: DataTypes.STRING(20), 
      allowNull: false, 
      defaultValue: "user" 
    },
  },
  { timestamps: true, tableName: "nguoi_dung" }
);
const DonHangModel = sequelize.define(
  "don_hang",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    thoi_diem_mua: { type: DataTypes.DATE, defaultValue: new Date() },
    ho_ten: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    status: { type: DataTypes.TINYINT, defaultValue: 0 },
    ghi_chu: { type: DataTypes.STRING, defaultValue: "" },
  },
  { timestamps: false, tableName: "don_hang" }
);
const DonHangChiTietModel = sequelize.define(
  "don_hang_chi_tiet",
  {
    id_ct: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_dh: {
      type: DataTypes.INTEGER,
      references: {
        model: DonHangModel,
        key: "id",
      },
    },
    id_sp: {
      type: DataTypes.INTEGER,
      references: {
        model: SanPhamModel,
        key: "id",
      },
    },
    so_luong: { type: DataTypes.INTEGER },
  },
  { timestamps: false, tableName: "don_hang_chi_tiet" }
);

const db = sequelize;

module.exports = {
  sequelize,
  db,
  SanPhamModel,
  LoaiModel,
  NguoiDungModel,
  DonHangModel,
  DonHangChiTietModel,
};
