const express = require('express');
const router = express.Router();
const { authenticateToken, isAdmin, isClubAdmin } = require('../middleware/auth.middleware');
const { getAllClubs, createClub, deleteClub, assignClubLeader, editClubDetails, approveDenyStudentMembership } = require('../controller/club.controller');

// Get all clubs
router.get('/', getAllClubs);

// Create a club (accessible only to admins)
router.post('/', authenticateToken, isAdmin, createClub);

// Delete a club (accessible only to admins)
router.delete('/:id', authenticateToken, isAdmin, deleteClub);

// Assign club leader (accessible only to admins)
router.post('/assign-leader', authenticateToken, isAdmin, assignClubLeader);

// Edit club details (accessible only to club admins)
router.put('/:id', authenticateToken, isClubAdmin, editClubDetails);

// Approve/deny student membership (accessible only to club admins)
router.post('/membership', authenticateToken, isClubAdmin, approveDenyStudentMembership);

module.exports = router;
