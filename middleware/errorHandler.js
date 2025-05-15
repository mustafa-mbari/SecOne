const { NODE_ENV } = process.env;

/**
 * Global error handler middleware
 * @param {Error} err - Error object
 * @param {Request} req - Express request
 * @param {Response} res - Express response
 * @param {NextFunction} next - Next middleware
 */
module.exports = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  // Log full error in development
  if (NODE_ENV === "development") {
    console.error("--- ERROR HANDLER MIDDLEWARE ---");
    console.error("Path:", req.path);
    console.error("Status:", statusCode);
    console.error("Message:", message);
    console.error("Stack:", err.stack);
    console.error("--------------------------------");
  }

  // Prevent leaking sensitive data in production
  const response = {
    error: message,
    status: statusCode,
    ...(NODE_ENV === "development" && { stack: err.stack }), // Only show stack in dev
  };

  res.status(statusCode).json(response);
};