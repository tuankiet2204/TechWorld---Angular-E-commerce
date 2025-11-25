const db = require("../database");

// Hàm tạo Slug (tạo đường dẫn từ tên sản phẩm)
const createSlug = (str) => {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
};

// 1. GET: Lấy danh sách sản phẩm (Có Tìm kiếm, Lọc, Phân trang)
exports.getAllProducts = async (req, res) => {
  try {
    // Lấy các tham số từ URL
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const keyword = req.query.keyword;
    const category_id = req.query.category_id;
    const brand_id = req.query.brand_id;
    const min_price = req.query.min_price;
    const max_price = req.query.max_price;
    const sort = req.query.sort;

    // Xây dựng câu lệnh SQL động
    let sql = `
      SELECT p.*, c.name as category_name, b.name as brand_name 
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN brands b ON p.brand_id = b.id
      WHERE 1=1
    `;

    const params = [];

    // Tìm kiếm & Lọc
    if (keyword) {
      sql += ` AND p.name LIKE ?`;
      params.push(`%${keyword}%`);
    }
    if (category_id) {
      sql += ` AND p.category_id = ?`;
      params.push(category_id);
    }
    if (brand_id) {
      sql += ` AND p.brand_id = ?`;
      params.push(brand_id);
    }
    if (min_price) {
      sql += ` AND p.price_min >= ?`;
      params.push(min_price);
    }
    if (max_price) {
      sql += ` AND p.price_max <= ?`;
      params.push(max_price);
    }

    // Sắp xếp
    if (sort === "price_asc") sql += ` ORDER BY p.price_min ASC`;
    else if (sort === "price_desc") sql += ` ORDER BY p.price_min DESC`;
    else sql += ` ORDER BY p.created_at DESC`; // Mặc định mới nhất

    // Phân trang
    sql += ` LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const [rows] = await db.promise().query(sql, params);

    // Đếm tổng để tính số trang
    let countSql = `SELECT COUNT(*) as total FROM products p WHERE 1=1`;
    const countParams = [];
    if (keyword) {
      countSql += ` AND p.name LIKE ?`;
      countParams.push(`%${keyword}%`);
    }
    if (category_id) {
      countSql += ` AND p.category_id = ?`;
      countParams.push(category_id);
    }
    if (brand_id) {
      countSql += ` AND p.brand_id = ?`;
      countParams.push(brand_id);
    }
    if (min_price) {
      countSql += ` AND p.price_min >= ?`;
      countParams.push(min_price);
    }
    if (max_price) {
      countSql += ` AND p.price_max <= ?`;
      countParams.push(max_price);
    }

    const [countResult] = await db.promise().query(countSql, countParams);
    const total = countResult[0].total;

    res.json({
      data: rows,
      pagination: {
        page,
        limit,
        total_rows: total,
        total_pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi server" });
  }
};

// 2. GET: Lấy chi tiết 1 sản phẩm theo ID
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    // Join thêm Brand và Category để hiển thị tên cho đẹp
    const sql = `
      SELECT p.*, c.name as category_name, b.name as brand_name 
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN brands b ON p.brand_id = b.id
      WHERE p.id = ?
    `;
    const [rows] = await db.promise().query(sql, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Không tìm thấy sản phẩm" });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Lỗi server" });
  }
};

// 3. POST: Tạo sản phẩm mới
exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      price_min,
      price_max,
      description,
      thumbnail_url,
      category_id,
      brand_id,
    } = req.body;

    if (!name || !price_min || !category_id) {
      return res.status(400).json({ error: "Thiếu thông tin bắt buộc" });
    }

    const slug = createSlug(name) + "-" + Date.now();

    const sql = `
      INSERT INTO products 
      (name, slug, price_min, price_max, description, thumbnail_url, category_id, brand_id) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db
      .promise()
      .query(sql, [
        name,
        slug,
        price_min,
        price_max || price_min,
        description,
        thumbnail_url,
        category_id,
        brand_id,
      ]);

    res.status(201).json({
      message: "Thêm thành công",
      productId: result.insertId,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Lỗi server", details: error.sqlMessage || error });
  }
};

// 4. PUT: Cập nhật sản phẩm
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      price_min,
      price_max,
      description,
      thumbnail_url,
      category_id,
      brand_id,
    } = req.body;

    const sql = `
      UPDATE products 
      SET name = ?, price_min = ?, price_max = ?, description = ?, thumbnail_url = ?, category_id = ?, brand_id = ?
      WHERE id = ?
    `;

    const [result] = await db
      .promise()
      .query(sql, [
        name,
        price_min,
        price_max,
        description,
        thumbnail_url,
        category_id,
        brand_id,
        id,
      ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Không tìm thấy sản phẩm" });
    }
    res.json({ message: "Cập nhật thành công" });
  } catch (error) {
    res.status(500).json({ error: "Lỗi server" });
  }
};

// 5. DELETE: Xóa sản phẩm
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db
      .promise()
      .query("DELETE FROM products WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Không tìm thấy sản phẩm" });
    }
    res.json({ message: "Xóa thành công" });
  } catch (error) {
    res.status(500).json({ error: "Lỗi server" });
  }
};

// 6. GET: Sản phẩm Mới (Limit 8)
exports.getNewProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 8;
    const sql = "SELECT * FROM products ORDER BY created_at DESC LIMIT ?";
    const [rows] = await db.promise().query(sql, [limit]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Lỗi server" });
  }
};

// 7. GET: Sản phẩm Bán chạy (Hot)
exports.getBestSellingProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 8;
    const sql = `
      SELECT p.*, SUM(oi.quantity) as total_sold
      FROM products p
      JOIN order_items oi ON p.name = oi.product_name 
      GROUP BY p.id
      ORDER BY total_sold DESC
      LIMIT ?
    `;
    const [rows] = await db.promise().query(sql, [limit]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Lỗi server" });
  }
};
