// AppError.js

/**
 * Custom error class to handle application-specific errors in a structured way.
 */
class AppError extends Error {
  /**
   * @param {string} message - A human-readable error message.
   * @param {number} statusCode - HTTP status code (default is 500).
   * @param {Object|string|null} details - Optional details or metadata for debugging or client response.
   */
  constructor(message, statusCode = 500, details = null) {
    super(message);

    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true; // For distinguishing trusted errors

    // Capture stack trace (optional for production)
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Factory method for creating a 400 Bad Request error.
   */
  static badRequest(message = 'Bad Request', details = null) {
    return new AppError(message, 400, details);
  }

  /**
   * Factory method for creating a 404 Not Found error.
   */
  static notFound(message = 'Not Found', details = null) {
    return new AppError(message, 404, details);
  }

  /**
   * Factory method for creating a 401 Unauthorized error.
   */
  static unauthorized(message = 'Unauthorized', details = null) {
    return new AppError(message, 401, details);
  }

  /**
   * Factory method for creating a 403 Forbidden error.
   */
  static forbidden(message = 'Forbidden', details = null) {
    return new AppError(message, 403, details);
  }

  /**
   * Factory method for creating a 500 Internal Server Error.
   */
  static internal(message = 'Internal Server Error', details = null) {
    return new AppError(message, 500, details);
  }
}

module.exports = AppError;
