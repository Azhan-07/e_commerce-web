const { body, validationResult } = require("express-validator");

const registerValidator = [
  body("fullname")
    .trim()
    .notEmpty()
    .withMessage("Full name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be 2-100 characters"),
  body("email")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .matches(/\d/)
    .withMessage("Password must contain at least one number"),
  body("phone")
    .optional()
    .matches(/^[\d+\-\s()]+$/)
    .withMessage("Invalid phone number format"),
];

const loginValidator = [
  body("email")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("Password is required"),
];

const adminLoginValidator = [
  body("email")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

const createAdminValidator = [
  body("fullname")
    .trim()
    .notEmpty()
    .withMessage("Full name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be 2-100 characters"),
  body("email")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

const productValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Product title is required")
    .isLength({ max: 200 })
    .withMessage("Title cannot exceed 200 characters"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Product description is required")
    .isLength({ max: 2000 })
    .withMessage("Description cannot exceed 2000 characters"),
  body("price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  body("discount")
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage("Discount must be between 0 and 100"),
  body("category")
    .notEmpty()
    .withMessage("Category is required")
    .isIn(["shirts", "hoodies", "jeans", "shoes", "jackets", "accessories", "tshirts", "pants", "dresses", "shorts"])
    .withMessage("Invalid category"),
  body("gender")
    .notEmpty()
    .withMessage("Gender is required")
    .isIn(["men", "women", "kids", "unisex"])
    .withMessage("Invalid gender"),
  body("stock")
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative number"),
];

const orderValidator = [
  body("customerName")
    .trim()
    .notEmpty()
    .withMessage("Customer name is required")
    .isLength({ max: 100 })
    .withMessage("Customer name is too long"),
  body("customerEmail")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),
  body("customerPhone")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .matches(/^[\d+\-\s()]+$/)
    .withMessage("Invalid phone number format"),
  body("products")
    .isArray({ min: 1 })
    .withMessage("Order must contain at least one product"),
  body("totalPrice")
    .isFloat({ min: 0 })
    .withMessage("Total price must be a positive number"),
  body("shippingAddress.address")
    .trim()
    .notEmpty()
    .withMessage("Address is required"),
  body("shippingAddress.city")
    .trim()
    .notEmpty()
    .withMessage("City is required"),
  body("shippingAddress.country")
    .trim()
    .notEmpty()
    .withMessage("Country is required"),
];

const reviewValidator = [
  body("rating")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),
  body("comment")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Comment cannot exceed 1000 characters"),
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};

module.exports = {
  registerValidator,
  loginValidator,
  adminLoginValidator,
  createAdminValidator,
  productValidator,
  orderValidator,
  reviewValidator,
  handleValidationErrors,
};
