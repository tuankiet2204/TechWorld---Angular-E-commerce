const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const authMiddleware = require("../middleware/authMiddleware");

// 1. Đặt hàng (Ai cũng được, miễn có login)
router.post("/", authMiddleware.verifyToken, orderController.createOrder);
// User xem chi tiết đơn hàng (Đặt TRƯỚC các route của Admin để tránh xung đột)
router.get("/:id", authMiddleware.verifyToken, orderController.getOrderDetail);

// User tự hủy đơn hàng
router.put(
  "/:id/cancel",
  authMiddleware.verifyToken,
  orderController.cancelOrder
);

// 2. Xem lịch sử mua hàng của mình
router.get(
  "/my-orders",
  authMiddleware.verifyToken,
  orderController.getMyOrders
);

// 3. Admin xem tất cả đơn hàng
router.get(
  "/",
  authMiddleware.verifyToken,
  authMiddleware.isAdmin,
  orderController.getAllOrders
);

// 4. Admin cập nhật trạng thái đơn hàng (Duyệt đơn)
router.put(
  "/:id/status",
  authMiddleware.verifyToken,
  authMiddleware.isAdmin,
  orderController.updateOrderStatus
);

module.exports = router;
