const UserRole = require('../models/UserRole');
const AppError = require('../utils/AppError');

/**
 * تعيين دور للمستخدم
 */
exports.assignRoleToUser = async (req, res, next) => {
  try {
    const { user_id, role_id } = req.body;
    
    if (!user_id || !role_id) {
      throw new AppError('User ID and Role ID are required', 400);
    }

    const userRole = new UserRole({
      user_id,
      role_id,
      assigned_by: req.user.user_id // المستخدم الحالي هو الذي يعين الدور
    });

    const savedUserRole = await userRole.save();

    res.status(201).json({
      success: true,
      message: 'تم تعيين الدور بنجاح',
      data: savedUserRole
    });

  } catch (err) {
    next(new AppError(
      `فشل تعيين الدور: ${err.message}`,
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
      throw new AppError('لم يتم العثور على تعيين الدور', 404);
    }

    res.json({
      success: true,
      message: 'تم إزالة الدور بنجاح',
      data: deletedUserRole
    });

  } catch (err) {
    next(new AppError(
      `فشل إزالة الدور: ${err.message}`,
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
 * الحصول على جميع أدوار مستخدم معين
 */
exports.getUserRoles = async (req, res, next) => {
  try {
    const roles = await UserRole.getByUserId(req.params.user_id);
    
    if (!roles || roles.length === 0) {
      throw new AppError('لا توجد أدوار مسندة لهذا المستخدم', 404);
    }

    res.json({
      success: true,
      count: roles.length,
      data: roles
    });

  } catch (err) {
    next(new AppError(
      `فشل جلب أدوار المستخدم: ${err.message}`,
      err.statusCode || 500,
      {
        operation: 'getUserRoles',
        user_id: req.params.user_id
      }
    ));
  }
};

/**
 * الحصول على جميع المستخدمين لدور معين
 */
exports.getUsersWithRole = async (req, res, next) => {
  try {
    const users = await UserRole.getByRoleId(req.params.role_id);
    
    if (!users || users.length === 0) {
      throw new AppError('لا يوجد مستخدمين بهذا الدور', 404);
    }

    res.json({
      success: true,
      count: users.length,
      data: users
    });

  } catch (err) {
    next(new AppError(
      `فشل جلب المستخدمين بالدور: ${err.message}`,
      err.statusCode || 500,
      {
        operation: 'getUsersWithRole',
        role_id: req.params.role_id
      }
    ));
  }
};