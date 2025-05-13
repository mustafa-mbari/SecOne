//userRoutes.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// 🔽 All requird routes ..
router.get('/', userController.getAllUsers);          // GET /users
router.get('/:id', userController.getUserById);       // GET /users/:id         ex: GET /users/4
router.post('/', userController.createUser);          // POST /users
router.put('/:id', userController.updateUser);        // PUT /users/:id
router.delete('/:id', userController.deleteUser);     // DELETE /users/:id

module.exports = router;

