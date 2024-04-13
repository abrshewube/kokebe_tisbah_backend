const express = require('express');
const router = express.Router();
const Resource = require('../model/resource.model');
const { authenticateToken, checkGradeLevel } = require('../middleware/auth.middleware');

// Route to get resources based on user's grade level and category
router.get('/', authenticateToken, checkGradeLevel, async (req, res) => {
  try {
    const { category } = req.query;
    const gradeLevel = req.user.grade;

    // Fetch resources based on grade level and category
    const resources = await Resource.find({ category, gradeLevel });

    res.status(200).json({ resources });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
