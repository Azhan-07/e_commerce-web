const express = require("express");
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrder,
  getAllOrders,
  updateOrderStatus,
  getDashboardStats,
} = require("../controllers/orderController");
const { protect, admin } = require("../middleware/auth");

router.use(protect);
router.post("/", createOrder);
router.get("/my-orders", getMyOrders);
router.get("/dashboard", admin, getDashboardStats);
router.get("/:id", getOrder);

router.use(admin);
router.get("/", getAllOrders);
router.put("/:id", updateOrderStatus);

module.exports = router;
