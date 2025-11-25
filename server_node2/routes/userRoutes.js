const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

// --- NHÓM PUBLIC (Không cần Token) ---
router.post("/register", userController.register);
router.post("/verify", userController.verifyAccount); // <--- Mới: Xác thực OTP đăng ký
router.post("/login", userController.login);
router.post("/forgot-password", userController.forgotPassword); // <--- Mới: Quên mật khẩu
router.post("/reset-password", userController.resetPassword); // <--- Mới: Đặt lại mật khẩu

// --- NHÓM PRIVATE (Cần Token) ---
router.get("/profile", authMiddleware.verifyToken, userController.getProfile);
router.put(
  "/profile",
  authMiddleware.verifyToken,
  userController.updateProfile
);
router.put(
  "/change-password",
  authMiddleware.verifyToken,
  userController.changePassword
);

module.exports = router;
