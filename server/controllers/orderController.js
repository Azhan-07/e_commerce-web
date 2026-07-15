/**
 * Order Controller
 */

const { successResponse, errorResponse } = require("../utils/responses");
const orderService = require("../services/orderService");

exports.createOrder = async (req, res, next) => {
  try {
    const { shippingAddress, customerName, customerEmail, customerPhone, products, totalPrice } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json(
        errorResponse(400, "Order must contain at least one product")
      );
    }

    if (!customerName || !customerEmail || !customerPhone) {
      return res.status(400).json(
        errorResponse(400, "Customer name, email, and phone are required")
      );
    }

    const order = await orderService.createGuestOrder({
      customerName,
      customerEmail,
      customerPhone,
      products,
      shippingAddress,
      totalPrice,
    });

    return res.status(201).json(
      successResponse(201, "Order created successfully", order)
    );
  } catch (error) {
    next(error);
  }
};

exports.trackOrderByEmail = async (req, res, next) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json(
        errorResponse(400, "Email is required for tracking orders")
      );
    }

    const orders = await orderService.getOrdersByEmail(email);

    return res.status(200).json(
      successResponse(200, "Orders retrieved successfully", orders)
    );
  } catch (error) {
    next(error);
  }
};

exports.getOrder = async (req, res, next) => {
  try {
    const order = await orderService.getOrderById(req.params.id);

    if (!order) {
      return res.status(404).json(
        errorResponse(404, "Order not found")
      );
    }

    return res.status(200).json(
      successResponse(200, "Order retrieved successfully", order)
    );
  } catch (error) {
    next(error);
  }
};

exports.getAllOrders = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const result = await orderService.getAllOrders(page, limit);

    return res.status(200).json(
      successResponse(200, "All orders retrieved successfully", result)
    );
  } catch (error) {
    next(error);
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus, paymentStatus } = req.body;

    if (!orderStatus && !paymentStatus) {
      return res.status(400).json(
        errorResponse(400, "Please provide orderStatus or paymentStatus to update")
      );
    }

    const order = await orderService.updateOrderStatus(
      req.params.id,
      orderStatus,
      paymentStatus
    );

    return res.status(200).json(
      successResponse(200, "Order status updated successfully", order)
    );
  } catch (error) {
    next(error);
  }
};

exports.getDashboardStats = async (req, res, next) => {
  try {
    const stats = await orderService.getDashboardStats();

    return res.status(200).json(
      successResponse(200, "Dashboard statistics retrieved", stats)
    );
  } catch (error) {
    next(error);
  }
};
