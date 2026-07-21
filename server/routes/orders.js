const express = require("express");
const router = express.Router();
const {
  createOrder,
  trackOrderByEmail,
  getOrder,
  getAllOrders,
  updateOrderStatus,
  getDashboardStats,
} = require("../controllers/orderController");
const { protect, admin, optionalAuth } = require("../middleware/auth");
const { orderValidator, handleValidationErrors } = require("../validators/validators");

router.post("/", optionalAuth, orderValidator, handleValidationErrors, createOrder);
router.get("/track/:email", trackOrderByEmail);

router.get("/dashboard", protect, admin, getDashboardStats);
router.get("/", protect, admin, getAllOrders);
router.get("/:id", protect, admin, getOrder);
router.put("/:id", protect, admin, updateOrderStatus);

module.exports = router;
