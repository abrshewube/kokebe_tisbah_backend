const express = require('express');
const router = express.Router();
const userController = require('../controller/user.controller');
const authMiddleware = require('../middleware/auth.middleware');
const multer = require('multer');

// Multer configuration for file upload
const storage = multer.diskStorage({});
const upload = multer({ storage });

// Register endpoint
// Modify the router to handle file uploads
router.post('/register', upload.single('profilePicture'), userController.register);
// Login endpoint
router.post('/login', userController.login);

// Endpoint to upload profile picture
router.post('/upload-profile-picture', authMiddleware.authenticateToken, upload.single('profilePicture'), userController.uploadProfilePicture);

// Modify the router to handle file uploads and authentication
router.put('/update-profile', authMiddleware.authenticateToken, upload.single('profilePicture'), userController.updateProfile);


// Endpoint to delete user (restricted to admin role)
router.delete('/:id', authMiddleware.authenticateToken, userController.deleteUser);

// Endpoint to get user ID from token
router.get('/getUserId', authMiddleware.authenticateToken, userController.getUserId);
// Endpoint to get all users (for admin)
router.get('/all', authMiddleware.authenticateToken,  authMiddleware.isAdmin, userController.getAllUsers);

// Endpoint to update user role (for admin)
router.put('/:id/update-role', authMiddleware.authenticateToken,  authMiddleware.isAdmin, userController.updateUserRole);

module.exports = router;
