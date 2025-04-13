const express = require('express');
const router = express.Router();
const authController = require('../Controllers/AuthController');
const { authenticateAdmin, authorizeAdmin } = require('../Middleware/auth');

// Login route
router.post('/login', authController.login);

// Logout route
router.post('/logout', authController.logout);

// Create admin route (only super_admin can access)
router.post(
    '/create',
    authenticateAdmin,
    authorizeAdmin(['super_admin']),
    authController.createAdmin
);

module.exports = router; 