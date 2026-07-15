/**
 * Admin Authentication Controller
 * Only admins can login through this endpoint
 */

const { validationResult } = require("express-validator");
const { adminLogin } = require("../services/authService");
const { successResponse, errorResponse } = require("../utils/responses");

exports.adminLogin = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(
        errorResponse(400, "Validation failed", errors.array())
      );
    }

    const { email, password } = req.body;

    const adminUser = await adminLogin(email, password);

    return res.status(200).json(
      successResponse(200, "Admin login successful", adminUser)
    );
  } catch (error) {
    return res.status(401).json(
      errorResponse(401, error.message || "Authentication failed")
    );
  }
};

exports.getAdminProfile = async (req, res, next) => {
  try {
    return res.status(200).json(
      successResponse(200, "Admin profile retrieved", {
        _id: req.user._id,
        email: req.user.email,
        fullname: req.user.fullname,
        role: req.user.role,
      })
    );
  } catch (error) {
    next(error);
  }
};

module.exports = exports;
