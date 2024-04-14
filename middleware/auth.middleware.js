const jwt = require('jsonwebtoken');
const User = require('../model/user.model');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, 'secret', async (err, decoded) => {
    if (err) return res.sendStatus(403);

    try {
      const user = await User.findOne({ username: decoded.username });
      if (!user) return res.sendStatus(403);

      req.user = user;
      next();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  });
}

function isAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access Denied: Admin only' });
  }
  next();
}

function isClubAdmin(req, res, next) {
  if (req.user.role !== 'club_admin') {
    return res.status(403).json({ message: 'Access Denied: Club Admin only' });
  }
  next();
}

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

module.exports = { authenticateToken, isAdmin,isClubAdmin, checkGradeLevel };
