/**
 * Order Service
 */

const Order = require("../models/Order");

const createGuestOrder = async (orderData) => {
  const order = new Order({
    customerName: orderData.customerName,
    customerEmail: orderData.customerEmail,
    customerPhone: orderData.customerPhone,
    products: orderData.products.map((item) => ({
      product: item.product,
      title: item.title,
      image: item.image,
      price: item.price,
      size: item.size,
      color: item.color,
      quantity: item.quantity,
    })),
    shippingAddress: orderData.shippingAddress,
    totalPrice: orderData.totalPrice,
    orderStatus: "processing",
    paymentStatus: "pending",
    estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  });

  return await order.save();
};

const getOrdersByEmail = async (email) => {
  return await Order.find({ customerEmail: email.toLowerCase() })
    .populate("products.product", "title images")
    .sort({ createdAt: -1 });
};

const getOrderById = async (orderId) => {
  return await Order.findById(orderId)
    .populate("products.product", "title images price")
    .lean();
};

const getAllOrders = async (page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  const total = await Order.countDocuments();
  const orders = await Order.find({})
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  return {
    orders,
    page,
    pages: Math.ceil(total / limit),
    total,
  };
};

const updateOrderStatus = async (orderId, orderStatus, paymentStatus) => {
  const order = await Order.findById(orderId);
  if (!order) throw new Error("Order not found");

  if (orderStatus) order.orderStatus = orderStatus;
  if (paymentStatus) order.paymentStatus = paymentStatus;

  if (orderStatus === "delivered" && !paymentStatus) {
    order.paymentStatus = "paid";
  }

  return await order.save();
};

const getDashboardStats = async () => {
  const Product = require("../models/Product");
  const User = require("../models/User");

  const totalOrders = await Order.countDocuments();
  const totalProducts = await Product.countDocuments();
  const totalAdmins = await User.countDocuments();

  const revenue = await Order.aggregate([
    { $match: { paymentStatus: "paid" } },
    { $group: { _id: null, total: { $sum: "$totalPrice" } } },
  ]);

  const pendingOrders = await Order.countDocuments({ orderStatus: "pending" });

  const recentOrders = await Order.find({})
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

  const monthlySales = await Order.aggregate([
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        total: { $sum: "$totalPrice" },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": -1, "_id.month": -1 } },
    { $limit: 12 },
  ]);

  const topProducts = await Order.aggregate([
    { $unwind: "$products" },
    {
      $group: {
        _id: "$products.product",
        totalQuantity: { $sum: "$products.quantity" },
        totalRevenue: { $sum: { $multiply: ["$products.price", "$products.quantity"] } },
      },
    },
    { $sort: { totalQuantity: -1 } },
    { $limit: 5 },
  ]);

  return {
    totalOrders,
    totalProducts,
    totalAdmins,
    revenue: revenue[0]?.total || 0,
    pendingOrders,
    recentOrders,
    monthlySales,
    topProducts,
  };
};

module.exports = {
  createGuestOrder,
  getOrdersByEmail,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  getDashboardStats,
};
