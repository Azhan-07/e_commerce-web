/**
 * Order Routes
 * Guest checkout - no customer authentication needed
 * Admin management - requires admin authentication
 */

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
const { protect, admin } = require("../middleware/auth");
const { orderValidator, handleValidationErrors } = require("../validators/validators");

// Public routes - guest checkout
router.post("/", orderValidator, handleValidationErrors, createOrder);
router.get("/track/:email", trackOrderByEmail);

// Admin routes
router.get("/dashboard", protect, admin, getDashboardStats);
router.get("/", protect, admin, getAllOrders);
router.get("/:id", protect, admin, getOrder);
router.put("/:id", protect, admin, updateOrderStatus);

module.exports = router;

