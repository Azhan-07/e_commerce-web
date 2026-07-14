const Order = require("../models/Order");
const Cart = require("../models/Cart");

exports.createOrder = async (req, res, next) => {
  try {
    const { shippingAddress } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ message: "No items in cart" });
    }

    const order = await Order.create({
      user: req.user._id,
      products: cart.products.map((item) => ({
        product: item.product,
        title: item.title,
        image: item.image,
        price: item.price,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
      })),
      shippingAddress,
      totalPrice: cart.total,
    });

    cart.products = [];
    cart.total = 0;
    await cart.save();

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("products.product")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "fullname email")
      .populate("products.product");
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    next(error);
  }
};

exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({})
      .populate("user", "fullname email")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.orderStatus = req.body.orderStatus || order.orderStatus;
    order.paymentStatus = req.body.paymentStatus || order.paymentStatus;

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    next(error);
  }
};

exports.getDashboardStats = async (req, res, next) => {
  try {
    const Order = require("../models/Order");
    const User = require("../models/User");
    const Product = require("../models/Product");

    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments();

    const revenue = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);

    const recentOrders = await Order.find({})
      .populate("user", "fullname email")
      .sort({ createdAt: -1 })
      .limit(5);

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

    res.json({
      totalProducts,
      totalOrders,
      totalUsers,
      revenue: revenue[0]?.total || 0,
      recentOrders,
      monthlySales,
    });
  } catch (error) {
    next(error);
  }
};
