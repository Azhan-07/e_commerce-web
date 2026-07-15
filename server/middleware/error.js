/**
 * Global Error Handler Middleware
 */

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || res.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let errors = null;

  // Mongoose Cast Error
  if (err.name === "CastError" && err.kind === "ObjectId") {
    statusCode = 404;
    message = "Resource not found";
  }

  // Mongoose Duplicate Key Error
  if (err.code === 11000) {
    statusCode = 400;
    message = "Duplicate field value entered";
    errors = Object.keys(err.keyPattern);
  }

  // Mongoose Validation Error
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Validation failed";
    errors = Object.values(err.errors).map((val) => val.message);
  }

  // JWT Errors
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
  }

  // Prevent exposing stack traces in production
  const response = {
    success: false,
    message,
    ...(errors && { errors }),
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  };

  res.status(statusCode).json(response);
};

module.exports = errorHandler;
