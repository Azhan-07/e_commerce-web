const { validationResult } = require("express-validator");
const authService = require("../services/authService");
const { successResponse, errorResponse } = require("../utils/responses");

exports.register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errorResponse(400, "Validation failed", errors.array()));
    }

    const { fullname, email, password, phone } = req.body;
    const result = await authService.registerUser(fullname, email, password, phone);
    return res.status(201).json(successResponse(201, "Registration successful", result));
  } catch (error) {
    return res.status(400).json(errorResponse(400, error.message));
  }
};

exports.login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errorResponse(400, "Validation failed", errors.array()));
    }

    const { email, password } = req.body;
    const result = await authService.loginUser(email, password);
    return res.status(200).json(successResponse(200, "Login successful", result));
  } catch (error) {
    return res.status(401).json(errorResponse(401, error.message));
  }
};

exports.adminLogin = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errorResponse(400, "Validation failed", errors.array()));
    }

    const { email, password } = req.body;
    const result = await authService.adminLogin(email, password);
    return res.status(200).json(successResponse(200, "Admin login successful", result));
  } catch (error) {
    return res.status(401).json(errorResponse(401, error.message));
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    const user = await authService.getUserProfile(req.user._id);
    return res.status(200).json(successResponse(200, "Profile retrieved", user));
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const user = await authService.updateUserProfile(req.user._id, req.body);
    return res.status(200).json(successResponse(200, "Profile updated", user));
  } catch (error) {
    next(error);
  }
};

exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await authService.getUserOrders(req.user._id);
    return res.status(200).json(successResponse(200, "Orders retrieved", orders));
  } catch (error) {
    next(error);
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json(errorResponse(400, "Refresh token required"));
    }
    const tokens = await authService.refreshAuthToken(refreshToken);
    return res.status(200).json(successResponse(200, "Token refreshed", tokens));
  } catch (error) {
    return res.status(401).json(errorResponse(401, "Invalid refresh token"));
  }
};

exports.createAdmin = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errorResponse(400, "Validation failed", errors.array()));
    }

    const { fullname, email, password } = req.body;
    const admin = await authService.createAdmin(fullname, email, password);
    return res.status(201).json(successResponse(201, "Admin created successfully", admin));
  } catch (error) {
    return res.status(400).json(errorResponse(400, error.message));
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await authService.deleteUser(req.params.id, req.user._id);
    return res.status(200).json(successResponse(200, "User deleted successfully", user));
  } catch (error) {
    return res.status(400).json(errorResponse(400, error.message));
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search || "";
    const result = await authService.getAllUsers(page, limit, search);
    return res.status(200).json(successResponse(200, "Users retrieved", result));
  } catch (error) {
    next(error);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const user = await authService.getUserProfile(req.params.id);
    const orders = await authService.getUserOrders(req.params.id);
    return res.status(200).json(successResponse(200, "User retrieved", { user, orders }));
  } catch (error) {
    next(error);
  }
};

module.exports = exports;
