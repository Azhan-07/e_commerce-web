const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || "30d",
  });
};

const registerUser = async (fullname, email, password, phone) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("An account with this email already exists");
  }

  const user = await User.create({
    fullname,
    email,
    password,
    phone,
    role: "customer",
  });

  const token = generateToken(user._id, user.role);
  const refreshToken = generateRefreshToken(user._id);

  return {
    _id: user._id,
    fullname: user.fullname,
    email: user.email,
    role: user.role,
    token,
    refreshToken,
  };
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new Error("Invalid email or password");
  }

  if (user.isLocked()) {
    const remainingTime = Math.ceil((user.lockUntil - Date.now()) / 60000);
    throw new Error(`Account locked. Try again in ${remainingTime} minutes`);
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    await user.incrementLoginAttempts();
    throw new Error("Invalid email or password");
  }

  await user.resetLoginAttempts();
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  const token = generateToken(user._id, user.role);
  const refreshToken = generateRefreshToken(user._id);

  return {
    _id: user._id,
    fullname: user.fullname,
    email: user.email,
    role: user.role,
    phone: user.phone,
    token,
    refreshToken,
  };
};

const adminLogin = async (email, password) => {
  const user = await User.findOne({ email, role: "admin" }).select("+password");

  if (!user) {
    throw new Error("Invalid email or password");
  }

  if (user.isLocked()) {
    const remainingTime = Math.ceil((user.lockUntil - Date.now()) / 60000);
    throw new Error(`Account locked. Try again in ${remainingTime} minutes`);
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    await user.incrementLoginAttempts();
    throw new Error("Invalid email or password");
  }

  await user.resetLoginAttempts();
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  const token = generateToken(user._id, user.role);

  return {
    _id: user._id,
    email: user.email,
    fullname: user.fullname,
    role: user.role,
    token,
  };
};

const getUserProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");
  return user;
};

const updateUserProfile = async (userId, updateData) => {
  const allowedFields = ["fullname", "phone", "address"];
  const filtered = {};
  for (const key of allowedFields) {
    if (updateData[key] !== undefined) {
      filtered[key] = updateData[key];
    }
  }

  const user = await User.findByIdAndUpdate(userId, filtered, {
    new: true,
    runValidators: true,
  });

  if (!user) throw new Error("User not found");
  return user;
};

const createAdmin = async (fullname, email, password) => {
  const existing = await User.findOne({ email });
  if (existing) throw new Error("An account with this email already exists");

  const admin = await User.create({
    fullname,
    email,
    password,
    role: "admin",
  });

  return {
    _id: admin._id,
    fullname: admin.fullname,
    email: admin.email,
    role: admin.role,
  };
};

const deleteUser = async (userId, currentAdminId) => {
  if (userId === currentAdminId) {
    throw new Error("You cannot delete your own account");
  }

  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  await User.findByIdAndDelete(userId);
  return user;
};

const getAllUsers = async (page = 1, limit = 20, search = "") => {
  const skip = (page - 1) * limit;
  let query = {};

  if (search) {
    query.$or = [
      { fullname: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  const total = await User.countDocuments(query);
  const users = await User.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  return {
    users,
    page,
    pages: Math.ceil(total / limit),
    total,
  };
};

const getUserOrders = async (userId) => {
  const Order = require("./Order");
  return await Order.find({ user: userId })
    .populate("products.product", "title images price")
    .sort({ createdAt: -1 });
};

const refreshAuthToken = async (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) throw new Error("User not found");

    const token = generateToken(user._id, user.role);
    const newRefreshToken = generateRefreshToken(user._id);

    return { token, refreshToken: newRefreshToken };
  } catch (error) {
    throw new Error("Invalid refresh token");
  }
};

module.exports = {
  generateToken,
  generateRefreshToken,
  registerUser,
  loginUser,
  adminLogin,
  getUserProfile,
  updateUserProfile,
  createAdmin,
  deleteUser,
  getAllUsers,
  getUserOrders,
  refreshAuthToken,
};
