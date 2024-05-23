// registration.routes.js

const express = require('express');
const router = express.Router();
const { createRegistration, approveRegistration, getUnregisteredStudents,  denyRegistration, getRegistrationStatus } = require('../controller/registration.controller');
const { authenticateToken, isRegistralRole, isAdmin } = require('../middleware/auth.middleware');

const multer = require('multer');

// Set up multer storage for file upload
const storage = multer.diskStorage({});
const upload = multer({ storage });
// POST route for creating registration
router.post('/', authenticateToken, upload.single('lastYearGradeResult'), createRegistration);
// GET route to fetch unregistered students
router.get('/unregistered' , getUnregisteredStudents);

// Approve registration endpoint (accessible to users with registral_role)
router.put('/approve/:id', authenticateToken, isAdmin, approveRegistration);

// Deny registration endpoint (accessible to users with registral_role)
router.put('/deny/:id', authenticateToken, isAdmin, denyRegistration);

// Endpoint to get registration status of the current user
router.get('/status', authenticateToken, getRegistrationStatus);

module.exports = router;
