//controllers/userRoleController.js

const UserRole = require('../models/UserRole');
const AppError = require('../utils/AppError');
const { getUsernameById } = require('../services/userService');


// مسار GET لاسترجاع كل userRoles
exports.getAllUserRole = async (req, res, next) => {
  try {
    const userRoles = await UserRole.getAll();
    res.json({
      success: true,
      count: userRoles.length,
      data: userRoles
    });
  } catch (err) {
    next(new AppError(`Failed to fetch user roles: ${err.message}`, 500));
  }
};

/**
 * Assign role of user
 */
exports.assignRoleToUser = async (req, res, next) => {
  try {
    const { user_id, role_id } = req.body;
    
    if (!user_id || !role_id) {
      throw new AppError('User ID and Role ID are required', 400);
    }

    const userRole = new UserRole(req.body);
    const savedUserRole = await userRole.save();

    // ✅ استرجاع اسم المستخدم بعد الحفظ
    const usernameResult = await getUsernameById(savedUserRole.user_id);
    const username = usernameResult.username;

    res.status(201).json({
      success: true,
      message: `Role assigned successfully, to user: ${username}`,
      data: savedUserRole
    });

  } catch (err) {
    next(new AppError(
      `Role assignment failed: ${err.message}`,
      err.statusCode || 500,
      {
        operation: 'assignRoleToUser',
        user_id: req.body.user_id,
        role_id: req.body.role_id
      }
    ));
  }
};

/**
 * إزالة دور من المستخدم
 */
exports.removeRoleFromUser = async (req, res, next) => {
  try {
    const { user_id, role_id } = req.params;
    
    const deletedUserRole = await UserRole.deleteByUserAndRole(user_id, role_id);

    if (!deletedUserRole) {
      throw new AppError('Role assignment not found', 404);
    }

    res.json({
      success: true,
      message: 'Role removed successfully',
      data: deletedUserRole
    });

  } catch (err) {
    next(new AppError(
      `Failed to remove role: ${err.message}`,
      err.statusCode || 500,
      {
        operation: 'removeRoleFromUser',
        user_id: req.params.user_id,
        role_id: req.params.role_id
      }
    ));
  }
};

/**
* Get all roles of a specific user
 */
exports.getUserRoles = async (req, res, next) => {
  try {
    const roles = await UserRole.getByUserId(req.params.user_id);
    
    if (!roles || roles.length === 0) {
      throw new AppError('There are no roles assigned to this user.', 404);
    }

    res.json({
      success: true,
      count: roles.length,
      data: roles
    });

  } catch (err) {
    next(new AppError(
      `Failed to fetch user roles: ${err.message}`,
      err.statusCode || 500,
      {
        operation: 'getUserRoles',
        user_id: req.params.user_id
      }
    ));
  }
};

/**
* Get all users for a specific role 
*/
exports.getUsersWithRole = async (req, res, next) => {
  try {
    const users = await UserRole.getByRoleId(req.params.role_id);
    
    if (!users || users.length === 0) {
      throw new AppError('There are no users with this role', 404);
    }

    res.json({
      success: true,
      count: users.length,
      data: users
    });

  } catch (err) {
    next(new AppError(
      `Failed to fetch users by role: ${err.message}`,
      err.statusCode || 500,
      {
        operation: 'getUsersWithRole',
        role_id: req.params.role_id
      }
    ));
  }
};