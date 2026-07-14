const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const {
  register,
  login,
  getMe,
  updateProfile,
  toggleWishlist,
  getWishlist,
  addToRecentlyViewed,
  getUsers,
} = require("../controllers/authController");
const { protect, admin } = require("../middleware/auth");

router.post(
  "/register",
  [
    body("fullname").trim().notEmpty().withMessage("Full name is required"),
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  register
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  login
);

router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);
router.put("/wishlist/:productId", protect, toggleWishlist);
router.get("/wishlist", protect, getWishlist);
router.post("/recently-viewed/:productId", protect, addToRecentlyViewed);
router.get("/users", protect, admin, getUsers);

module.exports = router;
