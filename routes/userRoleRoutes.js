//route/userRoleRoutes.js

const express = require('express');
const router = express.Router();
const userRoleController = require('../controllers/userRoleController');


// 🔐 You can add authentication middleware if needed
// const { authenticate } = require('../middlewares/authMiddleware');

// ✅ طباعة أسماء الدوال المتوفرة داخل الـ Controller
console.log('Controller methods:', Object.keys(userRoleController));

// 🟢 Assign a role to a user
router.post('/', userRoleController.assignRoleToUser);

// 🔴 Remove a role from a user
router.delete('/:user_id/:role_id', userRoleController.removeRoleFromUser);

// 📄 Get all roles assigned to a user
router.get('/user/:user_id', userRoleController.getUserRoles);

// 📄 Get all users assigned to a role
router.get('/role/:role_id', userRoleController.getUsersWithRole);

// مسار GET لاسترجاع كل userRoles
router.get('/', userRoleController.getAllUserRole);


module.exports = router;
