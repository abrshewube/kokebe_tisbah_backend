const express = require('express');
const router = express.Router();
const userController = require('../controller/user.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Register endpoint
router.post('/register', userController.register);

// Login endpoint
router.post('/login', userController.login);
// Endpoint to get user ID from token
router.get('/getUserId', authMiddleware.authenticateToken, userController.getUserId);

module.exports = router;
