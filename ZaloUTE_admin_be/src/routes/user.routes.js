const express = require('express');
const userController = require('../controllers/user.controller');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Tất cả routes đều cần authentication
router.use(auth);

// User CRUD routes
router.get('/', userController.getAllUsers);
router.get('/stats', userController.getUserStats);
router.get('/search', userController.searchUsers);
router.get('/:id', userController.getUserById);
router.patch('/:id/toggle-status', userController.toggleUserStatus);
router.delete('/:id', userController.deleteUser);

module.exports = router;


