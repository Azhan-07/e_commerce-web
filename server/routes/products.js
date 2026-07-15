/**
 * Product Routes
 * Public: GET endpoints for browsing
 * Admin: POST/PUT/DELETE for management
 */

const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getNewArrivals,
  getBestSellers,
} = require("../controllers/productController");
const { protect, admin } = require("../middleware/auth");
const upload = require("../middleware/upload");
const { productValidator, handleValidationErrors } = require("../validators/validators");

// Public routes - no authentication required
router.get("/featured", getFeaturedProducts);
router.get("/new-arrivals", getNewArrivals);
router.get("/best-sellers", getBestSellers);
router.get("/", getProducts);
router.get("/:id", getProduct);

// Admin routes - require authentication
router.post(
  "/",
  protect,
  admin,
  upload.array("images", 5),
  productValidator,
  handleValidationErrors,
  createProduct
);

router.put(
  "/:id",
  protect,
  admin,
  upload.array("images", 5),
  productValidator,
  handleValidationErrors,
  updateProduct
);

router.delete("/:id", protect, admin, deleteProduct);

module.exports = router;
