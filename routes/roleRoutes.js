//roleRoutes.js

const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const { validateRole } = require('../middleware/validation');

// Verify the controller methods exist
console.log('Controller methods:', {
  getAllRoles: typeof roleController.getAllRoles,
  createRole: typeof roleController.createRole,
  getRoleById: typeof roleController.getRoleById,
  updateRole: typeof roleController.updateRole,
  deleteRole: typeof roleController.deleteRole
});

// Routes
router.get('/', roleController.getAllRoles);
router.post('/', validateRole, roleController.createRole);
router.get('/sort', roleController.getAllRolesSort);
router.get('/:id', roleController.getRoleById);
router.put('/:id', validateRole, roleController.updateRole);
router.delete('/:id', roleController.deleteRole);

module.exports = router;