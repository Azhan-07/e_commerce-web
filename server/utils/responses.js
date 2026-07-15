/**
 * Standardized API Response Utility
 */

const successResponse = (statusCode, message, data = null) => {
  return {
    success: true,
    message,
    data,
    statusCode,
  };
};

const errorResponse = (statusCode, message, errors = null) => {
  return {
    success: false,
    message,
    errors,
    statusCode,
  };
};

module.exports = {
  successResponse,
  errorResponse,
};
