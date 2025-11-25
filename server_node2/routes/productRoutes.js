const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const authMiddleware = require("../middleware/authMiddleware");

// --- 1. CÁC API ĐẶC BIỆT (Phải đặt TRƯỚC cái /:id) ---

// Lấy sản phẩm mới nhất (Limit 8)
// URL: http://localhost:3000/products/new
router.get("/new", productController.getNewProducts);

// Lấy sản phẩm bán chạy
// URL: http://localhost:3000/products/best-selling
router.get("/best-selling", productController.getBestSellingProducts);

// --- 2. CÁC API CƠ BẢN ---

// Lấy danh sách (Có tìm kiếm & phân trang)
router.get("/", productController.getAllProducts);

// Lấy chi tiết 1 sản phẩm (Cái này phải để sau cùng trong nhóm GET)
router.get("/:id", productController.getProductById);

// --- 3. API CÓ BẢO MẬT (Admin mới được dùng) ---
router.post(
  "/",
  authMiddleware.verifyToken,
  authMiddleware.isAdmin,
  productController.createProduct
);
router.put(
  "/:id",
  authMiddleware.verifyToken,
  authMiddleware.isAdmin,
  productController.updateProduct
);
router.delete(
  "/:id",
  authMiddleware.verifyToken,
  authMiddleware.isAdmin,
  productController.deleteProduct
);

module.exports = router;
