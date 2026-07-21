const express = require("express");
const router = express.Router();
const { adminLogin, getAdminProfile, getUsers } = require("../controllers/adminAuthController");
const { adminLoginValidator, handleValidationErrors } = require("../validators/validators");
const { protect, admin } = require("../middleware/auth");

router.post("/admin-login", adminLoginValidator, handleValidationErrors, adminLogin);
router.get("/admin-profile", protect, admin, getAdminProfile);
router.get("/users", protect, admin, getUsers);

module.exports = router;
