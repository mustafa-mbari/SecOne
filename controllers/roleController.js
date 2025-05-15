const Role = require('../models/Role');
const AppError = require('../utils/AppError');

// ✅ Get all roles
exports.getAllRoles = async (req, res, next) => {
  try {
    const roles = await Role.getAll();
    res.json(roles);
  } catch (err) {
    next(new AppError('Error fetching roles', 500, err.message));
  }
};

// ✅ Get all roles sorted (DESC by role_id)
exports.getAllRolesSort = async (req, res, next) => {
  try {
    const roles = await Role.getAllSort();
    res.json(roles);
  } catch (err) {
    next(new AppError('Error fetching sorted roles', 500, err.message));
  }
};

// ✅ Create a new role
exports.createRole = async (req, res, next) => {
  try {
    const role = new Role(req.body);
    const savedRole = await role.save();

    res.status(201).json({
      message: `Role successfully created with ID: ${savedRole.role_id}`,
      role: savedRole
    });
  } catch (err) {
    console.error("Error during role creation: ", err);
    next(new AppError('Error creating role', 500, err.message));
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