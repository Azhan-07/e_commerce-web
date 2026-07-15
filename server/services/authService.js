/**
 * Admin Authentication Service
 */

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

const adminLogin = async (email, password) => {
  const user = await User.findOne({ email, role: "admin" }).select("+password");

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  const token = generateToken(user._id);

  return {
    _id: user._id,
    email: user.email,
    fullname: user.fullname,
    role: user.role,
    token,
  };
};

const verifyAdminToken = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.role !== "admin") {
      throw new Error("Not authorized as admin");
    }

    return user;
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};

module.exports = {
  generateToken,
  adminLogin,
  verifyAdminToken,
};
