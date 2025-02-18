const express = require('express');
const { login, renewToken, protected, addUser, getAllUsers, updateUser, deleteUser } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// User Management Routes
router.post('/add-user', addUser); // Create user
router.get('/users', authMiddleware, getAllUsers); // Get all users
router.put('/update-user/:id', authMiddleware, updateUser); // Update user
router.delete('/delete-user/:id', authMiddleware, deleteUser); // Delete user

// Authentication Routes
router.post('/login', login);
router.post('/renew-token', authMiddleware, renewToken);
router.get('/protected', authMiddleware, protected);

module.exports = router;
