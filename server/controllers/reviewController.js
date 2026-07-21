const { successResponse, errorResponse } = require("../utils/responses");
const reviewService = require("../services/reviewService");

exports.addReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const review = await reviewService.addReview(
      req.user._id,
      req.params.id,
      rating,
      comment
    );
    return res.status(201).json(successResponse(201, "Review added successfully", review));
  } catch (error) {
    next(error);
  }
};

exports.getReviews = async (req, res, next) => {
  try {
    const data = await reviewService.getReviews(req.params.id);
    return res.status(200).json(successResponse(200, "Reviews retrieved successfully", data));
  } catch (error) {
    next(error);
  }
};

exports.canReview = async (req, res, next) => {
  try {
    const eligible = await reviewService.canReview(req.user._id, req.params.id);
    return res.status(200).json(successResponse(200, "Review eligibility checked", { canReview: eligible }));
  } catch (error) {
    next(error);
  }
};
