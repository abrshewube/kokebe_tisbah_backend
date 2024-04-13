const express = require('express');
const router = express.Router();
const userController = require('../controller/user.controller');

// Register endpoint
router.post('/register', userController.register);

// Login endpoint
router.post('/login', userController.login);

module.exports = router;
