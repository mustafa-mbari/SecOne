//controllers/roleController.js

const Role = require('../models/Role');
const AppError = require('../utils/AppError');

/**
 * Get all active roles
 * @returns {Array} List of roles
 */
exports.getAllRoles = async (req, res, next) => {
  try {
    const roles = await Role.getAll();
    
    if (!roles || roles.length === 0) {
      return res.status(200).json({
        success: true,
        count: 0,
        message: 'No roles found',
        data: []
      });
    }

    res.status(200).json({
      success: true,
      count: roles.length,
      data: roles
    });
    
  } catch (err) {
    console.error('RoleController.getAllRoles error:', {
      error: err.message,
      stack: err.stack,
      timestamp: new Date().toISOString()
    });
    
    next(new AppError(
      'Failed to fetch roles list',
      500,
      {
        operation: 'getAllRoles',
        errorDetails: err.message
      }
    ));
  }
};

exports.getAllRolesSort = async (req, res, next) => {
  try {
    const roles = await Role.getAllSort();
    res.status(200).json({
      success: true,
      count: roles.length,
      data: roles
    });
  } catch (err) {
    next(new AppError('Error fetching sorted roles', 500));
  }
};

/**
 * Create a new role
 * @param {Object} req.body - Role data
 * @returns {Object} Created role
 */
exports.createRole = async (req, res, next) => {
  try {
    // Validate required fields
    if (!req.body.role_name) {
      throw new AppError('Role name is required', 400);

    } else if (!req.body.description) {
      throw new AppError('Description is required', 400);

    } else if (!(await Role.isActiveUser(req.body.created_by))) {
      throw new AppError('User not found or not active', 400);
    }

    const role = new Role(req.body);
    const savedRole = await role.save();

    res.status(201).json({
      success: true,
      message: 'Role created successfully',
      data: savedRole
    });
  } catch (err) {
    console.error('RoleController.createRole error:', err);
    next(new AppError(
      err.message || 'Error creating role',
      err.statusCode || 500
    ));
  }
};

// ✅ Get role by ID
exports.getRoleById = async (req, res, next) => {
  try {
    const role = await Role.getById(req.params.id);
    if (!role) {
      return next(new AppError('Role not found', 404));
    }
    res.json(role);
  } catch (err) {
    next(new AppError('Error fetching role', 500));
  }
};

// ✅ Update role by ID
exports.updateRole = async (req, res, next) => {
  try {
    const updatedRole = await Role.update(req.params.id, req.body);
    if (!updatedRole) {
      return next(new AppError('Role not found', 404));
    }

    res.status(200).json({
      message: `Role successfully updated with ID: ${updatedRole.role_id}`,
      role: updatedRole
    });
  } catch (err) {
    console.error("Error during role update: ", err);
    next(new AppError('Error updating role', 500, err.message));
  }
};

// ✅ Delete role (Soft Delete)
exports.deleteRole = async (req, res, next) => {
  try {
    const deletedRole = await Role.delete(req.params.id);
    if (!deletedRole) {
      return next(new AppError('Role not found', 404));
    }

    res.json({ message: 'Role deleted successfully', deletedRole });
  } catch (err) {
    next(new AppError('Error deleting role', 500));
  }
};