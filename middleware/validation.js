// middleware/validation.js
const { body, validationResult } = require('express-validator');
const AppError = require('../utils/AppError');

exports.validateUser = [
  body('username').trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Invalid email address'),
  body('password_hash').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('first_name').notEmpty().withMessage('First name is required'),
  body('last_name').notEmpty().withMessage('Last name is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// Common validation error handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => err.msg);
    return next(new AppError(errorMessages.join(', '), 400));
  }
  next();
};

// User registration validation
exports.validateRegister = [
  body('username')
    .trim()
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 3 }).withMessage('Username must be at least 3 characters')
    .isAlphanumeric().withMessage('Username must be alphanumeric'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
    
  body('password_hash')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
    .matches(/[0-9]/).withMessage('Password must contain at least one number'),
    
  body('first_name')
    .trim()
    .notEmpty().withMessage('First name is required')
    .isLength({ max: 50 }).withMessage('First name too long'),
    
  body('last_name')
    .trim()
    .notEmpty().withMessage('Last name is required')
    .isLength({ max: 50 }).withMessage('Last name too long'),
    
  handleValidationErrors
];

// User login validation
exports.validateLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format'),
    
  body('password_hash')
    .notEmpty().withMessage('Password is required'),
    
  handleValidationErrors
];


// User update validation
exports.validateUserUpdate = [
  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
    
  body('password_hash')
    .optional()
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    
  body('first_name')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('First name too long'),
    
  body('last_name')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('Last name too long'),
    
  handleValidationErrors
];

exports.validateRole = [
  body('role_name')
    .trim()
    .notEmpty().withMessage('Role name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Must be 2-50 characters')
    .matches(/^[a-zA-Z0-9 ]+$/).withMessage('Only alphanumeric characters allowed'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 255 }).withMessage('Maximum 255 characters'),

  body('level')
    .optional()
    .isInt({ min: 0, max: 10 }).withMessage('Must be 0-10'),

  body('is_active')
    .optional()
    .isBoolean().withMessage('Must be true/false'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const formattedErrors = errors.array().map(err => ({ 
        field: err.path, 
        message: err.msg 
      }));
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: formattedErrors
      });
    }
    next();
  }
];
