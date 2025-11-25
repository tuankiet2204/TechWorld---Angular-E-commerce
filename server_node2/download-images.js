const mysql = require("mysql2/promise");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const stream = require("stream");
const { promisify } = require("util");
const pipeline = promisify(stream.pipeline);

// Cấu hình Database (Giống file database.js của bạn)
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "220401", // <--- ĐIỀN PASSWORD MYSQL CỦA BẠN VÀO ĐÂY
  database: "badminton_shop",
};

// Thư mục lưu ảnh
const uploadDir = path.join(__dirname, "public", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Hàm làm sạch link ảnh (Lấy link gốc nếu lỡ bị dính proxy cũ)
const cleanUrl = (url) => {
  if (!url) return null;
  // Nếu link đã là localhost thì bỏ qua
  if (url.includes("localhost")) return null;

  // Nếu link bị dính wsrv.nl thì gỡ ra để lấy link gốc
  if (url.includes("?url=")) {
    return url.split("?url=")[1];
  }
  return url;
};

const downloadImage = async (url, filename) => {
  try {
    const response = await axios.get(url, {
      responseType: "stream",
      // Giả danh trình duyệt để không bị chặn
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Referer: "https://shopvnb.com/",
      },
    });

    const filePath = path.join(uploadDir, filename);
    await pipeline(response.data, fs.createWriteStream(filePath));
    console.log(`✅ Đã tải: ${filename}`);
    return true;
  } catch (error) {
    console.error(`❌ Lỗi tải ${url}:`, error.message);
    return false;
  }
};

const run = async () => {
  const connection = await mysql.createConnection(dbConfig);
  console.log("Đang kết nối Database...");

  // 1. Lấy danh sách sản phẩm
  const [products] = await connection.query(
    "SELECT id, thumbnail_url FROM products"
  );

  for (const p of products) {
    const originalUrl = cleanUrl(p.thumbnail_url);
    if (!originalUrl) continue; // Bỏ qua nếu là ảnh local

    const filename = `product-${p.id}-${Date.now()}.jpg`;

    // Tải ảnh về
    const success = await downloadImage(originalUrl, filename);

    if (success) {
      // Cập nhật lại Database trỏ về ảnh local
      const localUrl = `http://localhost:3000/uploads/${filename}`;
      await connection.query(
        "UPDATE products SET thumbnail_url = ? WHERE id = ?",
        [localUrl, p.id]
      );
    }
  }

  console.log("--- HOÀN TẤT! ---");
  await connection.end();
};

run();
