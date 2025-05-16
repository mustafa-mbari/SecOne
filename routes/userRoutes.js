//userRoutes.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { 
  validateRegister, 
  validateUserUpdate 
} = require('../middleware/validation');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

// Public routes
router.post('/', validateRegister, userController.createUser); // POST /users

// Protected routes (require authentication)
router.use(authMiddleware);

router.get('/', userController.getAllUsers);          // GET /users
router.get('/sort', userController.getAllSort);       // GET /users/sort
router.get('/:id', userController.getUserById);       // GET /users/:id

// Admin-only routes
router.use(adminMiddleware);

router.put('/:id', validateUserUpdate, userController.updateUser); // PUT /users/:id
router.delete('/:id', userController.deleteUser);     // DELETE /users/:id

module.exports = router;
