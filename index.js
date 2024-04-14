const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user.routes');
const uploadResource = require('./middleware/upload.middleware'); 
const { authenticateToken, isAdmin } = require('./middleware/auth.middleware');
const resourceRoutes = require('./routes/resource.route'); // Import resource routes
const schoolNewsRoutes = require('./routes/new.routes');
const clubRoutes = require('./routes/club.routes'); // Import club routes
const clubAdmissionRoutes = require('./routes/club-addmission.route'); // Import club admission routes
const app = express();

app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/auth_example', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/resources', authenticateToken, resourceRoutes); // Use authenticateToken middleware for all resource routes
app.use('/api/school-news', schoolNewsRoutes); // Add school news routes
app.use('/api/clubs', clubRoutes); // Add club routes
app.use('/api/club-admissions', clubAdmissionRoutes); // Update route to club admission routes
// Configure Multer for file upload
const multer = require('multer');
const storage = multer.diskStorage({});
const upload = multer({ storage });

// File upload endpoint
app.post('/api/resources/upload', authenticateToken, isAdmin, upload.single('file'), uploadResource);

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
