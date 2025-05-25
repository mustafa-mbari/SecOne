// middleware/errorHandler.js

const AppError = require('../utils/AppError');
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
  const message = err.message || 'Internal Server Error';
  const isOperational = err instanceof AppError || err.isOperational;

  // Log error details only in development or for unexpected errors
  if (NODE_ENV === 'development' || !isOperational) {
    console.error('--- ERROR HANDLER MIDDLEWARE ---');
    console.error('Time:', new Date().toISOString());
    console.error('Path:', req.originalUrl);
    console.error('Method:', req.method);
    console.error('Status:', statusCode);
    console.error('Message:', message);
    if (err.details) console.error('Details:', err.details);
    console.error('Stack:', err.stack);
    console.error('--------------------------------');
  }

  // Prepare clean response
  const response = {
    success: false,
    error: message,
    ...(err.details && { details: err.details }),
    ...(NODE_ENV === 'development' && { stack: err.stack }),
  };

  res.status(statusCode).json(response);
};
