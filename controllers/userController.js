//userController.js

const User = require('../models/User');
const AppError = require('../utils/AppError'); // ✅ Import custom error

// ✅ Get all users
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.getAll();
    res.json(users);
  } catch (err) {
    next(new AppError('Error fetching users', 500));
  }
};

// ✅ Create user
exports.createUser = async (req, res, next) => {
  try {
    const user = new User(req.body);
    const savedUser = await user.save();

    res.status(201).json({
      message: `User successfully created with ID: ${savedUser.user_id}`,
      user: savedUser
    });
  } catch (err) {
    console.error("Error during user creation: ", err);
    next(new AppError('Error creating user', 500, err.message));
  }
};

// ✅ Get one user by ID
exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.getById(req.params.id);
    if (!user) {
      return next(new AppError('User not found', 404));
    }
    res.json(user);
  } catch (err) {
    next(new AppError('Error fetching user', 500));
  }
};

// ✅ Update one user by ID
exports.updateUser = async (req, res, next) => {
  try {
    const updatedUser = await User.update(req.params.id, req.body);
    if (!updatedUser) {
      return next(new AppError('User not found', 404));
    }

    res.status(200).json({
      message: `User successfully updated with ID: ${updatedUser.user_id}`,
      user: updatedUser
    });
  } catch (err) {
    console.error("Error during user update: ", err);
    next(new AppError('Error updating user', 500, err.message));
  }
};

// ✅ Delete user (Soft Delete)
exports.deleteUser = async (req, res, next) => {
  try {
    const deletedUser = await User.delete(req.params.id);
    if (!deletedUser) {
      return next(new AppError('User not found', 404));
    }

    res.json({ message: 'User deleted successfully', deletedUser });
  } catch (err) {
    next(new AppError('Error deleting user', 500));
  }
};
