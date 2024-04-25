const jwt = require('jsonwebtoken');
const User = require('../model/user.model');

// Middleware to authenticate JWT token
async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, 'secret', async (err, decoded) => {
    if (err) return res.sendStatus(403);

    try {
      // Find the user by username extracted from the decoded token
      const user = await User.findOne({ username: decoded.username });
      if (!user) return res.sendStatus(403);

      // Set req.user with user information including profilePicture
      req.user = {
        _id: user._id,
        fullName: user.fullName,
        username: user.username,
        role: user.role,
        grade: user.grade,
        profilePicture: user.profilePicture // Include profilePicture from user document
      };
      next();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  });
}

// Middleware to check if user is an admin
function isAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access Denied: Admin only' });
  }
  next();
}

// Middleware to check if user is a club admin
function isClubAdmin(req, res, next) {
  if (req.user.role !== 'club_admin') {
    return res.status(403).json({ message: 'Access Denied: Club Admin only' });
  }
  next();
}

// Middleware to check if user has a registral role
function isRegistralRole(req, res, next) {
  if (req.user.role !== 'registral_role') {
    return res.status(403).json({ message: 'Access Denied: Registrals only' });
  }
  next();
}

// Middleware to check if user is a student and validate grade level
function checkGradeLevel(req, res, next) {
  if (req.user.role !== 'student') {
    return res.status(403).json({ message: 'Access Denied: Student only' });
  }
  // Check if the grade level is valid (between 9 and 12)
  if (req.user.grade < 9 || req.user.grade > 12) {
    return res.status(403).json({ message: 'Invalid Grade Level' });
  }
  next();
}

module.exports = { authenticateToken, isRegistralRole, isAdmin, isClubAdmin, checkGradeLevel };
