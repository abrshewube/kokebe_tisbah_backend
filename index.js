// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/user.routes');
const uploadResource = require('./middleware/upload.middleware'); 
const { authenticateToken, isAdmin } = require('./middleware/auth.middleware');
const resourceRoutes = require('./routes/resource.route'); // Import resource routes
const schoolNewsRoutes = require('./routes/new.routes');
const clubRoutes = require('./routes/club.routes'); // Import club routes
const clubAdmissionRoutes = require('./routes/club-addmission.route'); // Import club admission routes
const registrationRoutes = require('./routes/registration.routes'); // Import registration routes

// Create Express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect("mongodb+srv://kidusmusie:kidlla77@cluster0.caknzcx.mongodb.net/kokebe?retryWrites=true&w=majority&appName=Cluster0",{
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/resources', authenticateToken, resourceRoutes);
app.use('/api/school-news', schoolNewsRoutes);
app.use('/api/clubs', clubRoutes);
app.use('/api/club-admissions', clubAdmissionRoutes);
app.use('/api/registrations', registrationRoutes); // Add registration routes

// Configure Multer for file upload
const multer = require('multer');
const storage = multer.diskStorage({});
const upload = multer({ storage });

// File upload endpoint
app.post('/api/resources/upload', authenticateToken, isAdmin, upload.single('file'), uploadResource);

// Start the server
app.listen(3000, () => console.log('Server running on http://localhost:3000'));
