const express = require("express");
const router = express.Router();
const {
  register,
  login,
  adminLogin,
  getProfile,
  updateProfile,
  getMyOrders,
  refreshToken,
  createAdmin,
  deleteUser,
  getAllUsers,
  getUserById,
} = require("../controllers/userController");
const { protect, admin } = require("../middleware/auth");
const {
  registerValidator,
  loginValidator,
  adminLoginValidator,
  createAdminValidator,
  handleValidationErrors,
} = require("../validators/validators");

router.post("/register", registerValidator, handleValidationErrors, register);
router.post("/login", loginValidator, handleValidationErrors, login);
router.post("/admin-login", adminLoginValidator, handleValidationErrors, adminLogin);
router.post("/refresh-token", refreshToken);

router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.get("/my-orders", protect, getMyOrders);

router.get("/admin/users", protect, admin, getAllUsers);
router.get("/admin/users/:id", protect, admin, getUserById);
router.post("/admin/create-admin", protect, admin, createAdminValidator, handleValidationErrors, createAdmin);
router.delete("/admin/users/:id", protect, admin, deleteUser);

module.exports = router;
