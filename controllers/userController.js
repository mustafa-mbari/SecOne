//userController.js

const User = require('../models/User');
const AppError = require('../utils/AppError');

/**
 * Get all users
 * @returns {Array} List of all active users
 */
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.getAll();
    
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
    
  } catch (err) {
    next(new AppError(
      'Failed to fetch users list',
      500,
      {
        operation: 'getAllUsers',
        errorDetails: err.message
      }
    ));
  }
};

/**
 * Get all users sorted by ID (descending)
 * @returns {Array} Sorted list of users
 */
exports.getAllSort = async (req, res, next) => {
  try {
    const users = await User.getAllSort();
    
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
    
  } catch (err) {
    next(new AppError(
      'Failed to fetch sorted users',
      500,
      {
        operation: 'getAllSort',
        errorDetails: err.message
      }
    ));
  }
};

/**
 * Create a new user
 * @param {Object} req.body - User data
 * @returns {Object} Created user data
 */
exports.save = async (req, res, next) => {
  try {
    // Validate required fields
    if (!req.body.username || !req.body.email || !req.body.password_hash) {
      throw new AppError('Username, email and password are required', 400);
    }

    const user = new User(req.body);
    const savedUser = await user.save();

    res.status(201).json({
      success: true,
      message: `User created successfully - ID: ${savedUser.user_id}`,
      data: savedUser
    });
    
  } catch (err) {
    next(new AppError(
      `User creation failed: ${err.message}`,
      500,
      {
        operation: 'createUser',
        attemptedData: req.body,
        errorDetails: err.message
      }
    ));
  }
};

exports.createUser = async (req, res, next) => {
  try {
    // Validate required fields
    const requiredFields = [
      'username', 'email', 'password_hash',
      'first_name', 'last_name', 'created_by'
    ];
    
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      throw new AppError(
        `Missing required fields: ${missingFields.join(', ')}`,
        400
      );
    }

    // Create user with or without verification token
    const user = new User({
      ...req.body,
      verification_token: req.body.verification_token || undefined
    });

    const savedUser = await user.save();

    res.status(201).json({
      success: true,
      message: `User created successfully with ID: ${savedUser.user_id}`,
      data: {
        id: savedUser.user_id,
        username: savedUser.username,
        email: savedUser.email,
        name: `${savedUser.first_name} ${savedUser.last_name}`
      }
    });
    
  } catch (err) {
    console.error('Error in createUser:', err);
    
    // Handle specific database errors
    let errorMessage = 'User creation failed';
    if (err.code === '23505') { // Unique violation
      if (err.constraint.includes('username')) {
        errorMessage = 'Username already exists';
      } else if (err.constraint.includes('email')) {
        errorMessage = 'Email already exists';
      }
    } else if (err.code === '23502') { // Not null violation
      errorMessage = `Missing required value: ${err.column}`;
    }

    next(new AppError(
      errorMessage,
      400,
      {
        operation: 'createUser',
        dbError: err.message,
        dbCode: err.code
      }
    ));
  }
};

/**
 * Get user by ID
 * @param {Number} req.params.id - User ID
 * @returns {Object} User data
 */
exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.getById(req.params.id);
    
    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.status(200).json({
      success: true,
      data: user
    });
    
  } catch (err) {
    next(new AppError(
      `Failed to fetch user: ${err.message}`,
      err.statusCode || 500,
      {
        operation: 'getUserById',
        userId: req.params.id,
        errorDetails: err.message
      }
    ));
  }
};

/**
 * Update user data
 * @param {Number} req.params.id - User ID
 * @param {Object} req.body - Data to update
 * @returns {Object} Updated user data
 */
exports.updateUser = async (req, res, next) => {
  try {
    const updatedUser = await User.update(req.params.id, req.body);
    
    if (!updatedUser) {
      throw new AppError('User not found', 404);
    }

    res.status(200).json({
      success: true,
      message: `User updated successfully - ID: ${updatedUser.user_id}`,
      data: updatedUser
    });
    
  } catch (err) {
    next(new AppError(
      `User update failed: ${err.message}`,
      500,
      {
        operation: 'updateUser',
        userId: req.params.id,
        attemptedUpdates: req.body,
        errorDetails: err.message
      }
    ));
  }
};

/**
 * Soft delete user
 * @param {Number} req.params.id - User ID
 * @returns {Object} Deleted user data
 */
exports.deleteUser = async (req, res, next) => {
  try {
    const deletedUser = await User.delete(req.params.id);
    
    if (!deletedUser) {
      throw new AppError('User not found', 404);
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
      data: deletedUser
    });
    
  } catch (err) {
    next(new AppError(
      `User deletion failed: ${err.message}`,
      500,
      {
        operation: 'deleteUser',
        userId: req.params.id,
        errorDetails: err.message
      }
    ));
  }
};