//userRoutes.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Public routes
router.post('/', userController.createUser); // POST /users

router.get('/', userController.getAllUsers);          // GET /users
router.get('/sort', userController.getAllSort);       // GET /users/sort
router.get('/:id', userController.getUserById);       // GET /users/:id

router.put('/:id', userController.updateUser); // PUT /users/:id
router.delete('/:id', userController.deleteUser);     // DELETE /users/:id

module.exports = router;
