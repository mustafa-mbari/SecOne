//    middleware/admin.js
const AppError = require('../utils/AppError');

/**
 * Role-Based Authorization Middleware
 * Restricts access to admin users only
 */
module.exports = (requiredRole = 'admin') => {
  return (req, res, next) => {
    try {
      // 1) Check if user is logged in
      if (!req.user) {
        return next(
          new AppError('You need to be logged in to access this route', 401)
        );
      }

      // 2) Check if user has admin role
      if (req.user.role !== requiredRole) {
        return next(
          new AppError('You do not have permission to perform this action', 403)
        );
      }

      next();
    } catch (err) {
      next(new AppError('Authorization failed', 403, err.message));
    }
  };
};