const express = require("express");
const router = express.Router({ mergeParams: true });
const { addReview, getReviews, canReview } = require("../controllers/reviewController");
const { protect } = require("../middleware/auth");
const { reviewValidator, handleValidationErrors } = require("../validators/validators");

router.get("/", getReviews);
router.get("/can-review", protect, canReview);
router.post("/", protect, reviewValidator, handleValidationErrors, addReview);

module.exports = router;
