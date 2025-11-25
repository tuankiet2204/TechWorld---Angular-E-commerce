const db = require("../database");

// Hàm tạo mã đơn hàng ngẫu nhiên (VD: ORD-1715123456)
const generateOrderNumber = () => {
  return `ORD-${Date.now()}`;
};

// --- 1. TẠO ĐƠN HÀNG (User) ---
exports.createOrder = async (req, res) => {
  // Lấy kết nối để dùng Transaction
  const connection = await db.promise().getConnection();

  try {
    const {
      shipping_name,
      shipping_phone,
      shipping_address,
      payment_method,
      items,
      total_amount,
    } = req.body;
    const userId = req.user.id;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "Giỏ hàng trống" });
    }

    // Bắt đầu giao dịch
    await connection.beginTransaction();

    // B1: Tạo đơn hàng
    const orderNumber = generateOrderNumber();
    const orderSql = `
      INSERT INTO orders 
      (user_id, order_number, shipping_name, shipping_phone, shipping_address, payment_method, total_amount, status, created_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', NOW())
    `;

    const [orderResult] = await connection.query(orderSql, [
      userId,
      orderNumber,
      shipping_name,
      shipping_phone,
      shipping_address,
      payment_method || "cod",
      total_amount,
    ]);

    const newOrderId = orderResult.insertId;

    // B2: Lưu chi tiết sản phẩm
    const itemValues = items.map((item) => [
      newOrderId,
      item.product_variant_id || null,
      item.product_name,
      item.variant_name || "Tiêu chuẩn",
      item.quantity,
      item.price,
      JSON.stringify(item.services_options || {}),
    ]);

    const itemSql = `
      INSERT INTO order_items 
      (order_id, product_variant_id, product_name, variant_name, quantity, price, services_options) 
      VALUES ?
    `;

    await connection.query(itemSql, [itemValues]);

    // B3: Hoàn tất
    await connection.commit();

    res.status(201).json({
      message: "Đặt hàng thành công",
      orderId: newOrderId,
      orderNumber: orderNumber,
    });
  } catch (error) {
    await connection.rollback(); // Có lỗi thì hủy hết
    console.error(error);
    res.status(500).json({ error: "Lỗi tạo đơn hàng" });
  } finally {
    connection.release(); // Trả kết nối
  }
};

// --- 2. XEM ĐƠN CỦA TÔI (User) ---
exports.getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const sql =
      "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC";
    const [rows] = await db.promise().query(sql, [userId]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Lỗi server" });
  }
};

// --- 3. XEM TẤT CẢ ĐƠN (Admin) ---
exports.getAllOrders = async (req, res) => {
  try {
    // Join bảng users để xem ai đặt
    const sql = `
      SELECT orders.*, users.full_name, users.email 
      FROM orders 
      LEFT JOIN users ON orders.user_id = users.id 
      ORDER BY created_at DESC
    `;
    const [rows] = await db.promise().query(sql);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi lấy danh sách đơn hàng" });
  }
};

// --- 4. CẬP NHẬT TRẠNG THÁI (Admin) ---
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params; // ID đơn hàng
    const { status } = req.body; // Trạng thái mới (VD: shipping)

    const validStatuses = [
      "pending",
      "confirmed",
      "shipping",
      "completed",
      "cancelled",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Trạng thái không hợp lệ" });
    }

    const sql = "UPDATE orders SET status = ? WHERE id = ?";
    const [result] = await db.promise().query(sql, [status, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Không tìm thấy đơn hàng" });
    }

    res.json({ message: `Cập nhật trạng thái thành công: ${status}` });
  } catch (error) {
    res.status(500).json({ error: "Lỗi server" });
  }
};
// 5. USER: Xem chi tiết một đơn hàng cụ thể (Kèm danh sách sản phẩm)
exports.getOrderDetail = async (req, res) => {
  try {
    const userId = req.user.id;
    const orderId = req.params.id;

    // Bước 1: Lấy thông tin chung đơn hàng & Kiểm tra xem đơn này có đúng của User đó không
    const sqlOrder = "SELECT * FROM orders WHERE id = ? AND user_id = ?";
    const [orders] = await db.promise().query(sqlOrder, [orderId, userId]);

    if (orders.length === 0) {
      return res
        .status(404)
        .json({ error: "Không tìm thấy đơn hàng hoặc bạn không có quyền xem" });
    }

    const order = orders[0];

    // Bước 2: Lấy danh sách sản phẩm trong đơn hàng đó (Kèm hình ảnh từ bảng products)
    const sqlItems = `
      SELECT oi.*, p.thumbnail_url 
      FROM order_items oi
      LEFT JOIN products p ON oi.product_name = p.name 
      WHERE oi.order_id = ?
    `;
    const [items] = await db.promise().query(sqlItems, [orderId]);

    // Trả về kết quả gộp
    res.json({
      ...order, // Thông tin chung (tên, địa chỉ, tổng tiền...)
      items: items, // Danh sách món hàng
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi server" });
  }
};

// 6. USER: Tự hủy đơn hàng (Chỉ hủy được khi còn pending)
exports.cancelOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const orderId = req.params.id;

    // Kiểm tra đơn hàng có tồn tại và thuộc về user không
    const [orders] = await db
      .promise()
      .query("SELECT status FROM orders WHERE id = ? AND user_id = ?", [
        orderId,
        userId,
      ]);

    if (orders.length === 0) {
      return res.status(404).json({ error: "Đơn hàng không tồn tại" });
    }

    const order = orders[0];

    // Chỉ cho hủy nếu trạng thái là 'pending' (Chờ xử lý)
    if (order.status !== "pending") {
      return res
        .status(400)
        .json({
          error: "Đơn hàng đã được xử lý hoặc đang giao, không thể hủy.",
        });
    }

    // Cập nhật trạng thái thành 'cancelled'
    await db
      .promise()
      .query("UPDATE orders SET status = 'cancelled' WHERE id = ?", [orderId]);

    res.json({ message: "Đã hủy đơn hàng thành công" });
  } catch (error) {
    res.status(500).json({ error: "Lỗi server" });
  }
};
