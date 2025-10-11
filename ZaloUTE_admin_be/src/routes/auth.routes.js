const express = require('express');
const authController = require('../controllers/auth.controller');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes (không cần authentication)
router.post('/login', authController.login);

// Protected routes (cần authentication)
router.get('/me', auth, authController.getCurrentAdmin);
router.post('/logout', auth, authController.logout);

// Super admin only routes
router.post('/create-admin', auth, authorize('super_admin'), authController.createAdmin);

module.exports = router;

