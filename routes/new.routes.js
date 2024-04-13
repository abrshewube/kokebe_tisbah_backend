const express = require('express');
const router = express.Router();
const { createSchoolNews, getAllSchoolNews,deleteSchoolNews,updateSchoolNews } = require('../controller/news.controller');
const { authenticateToken, isAdmin } = require('../middleware/auth.middleware');
const multer = require('multer');

// Set up multer storage for file upload
const storage = multer.diskStorage({});
const upload = multer({ storage });

// Create school news endpoint with image upload (accessible only to admins)
router.post('/', authenticateToken, isAdmin, upload.single('image'), createSchoolNews);

// Get all school news endpoint
router.get('/', getAllSchoolNews);

// Delete school news endpoint (accessible only to admins)
router.delete('/:id', authenticateToken, isAdmin, deleteSchoolNews);

// Update school news endpoint (accessible only to admins)
router.put('/:id', authenticateToken, isAdmin, updateSchoolNews);


module.exports = router;
