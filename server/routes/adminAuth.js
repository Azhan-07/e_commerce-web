/**
 * Admin Authentication Routes
 * Only admin login endpoint - no customer registration/login
 */

const express = require("express");
const router = express.Router();
const { adminLogin, getAdminProfile } = require("../controllers/adminAuthController");
const { adminLoginValidator, handleValidationErrors } = require("../validators/validators");
const { protect, admin } = require("../middleware/auth");

// Admin login - no validation middleware here, let controller handle it
router.post("/admin-login", adminLoginValidator, handleValidationErrors, adminLogin);

// Get admin profile
router.get("/admin-profile", protect, admin, getAdminProfile);

module.exports = router;
