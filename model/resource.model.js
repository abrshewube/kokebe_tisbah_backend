const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: String,
  category: {
    type: String,
    enum: ['text book', 'teacher guide', 'teacher notes', 'worksheets', 'exams']
  },
  gradeLevel: {
    type: Number,
    min: 9,
    max: 12
  },
  description: String,
  cloudinaryUrl: String // Store the Cloudinary URL of the uploaded file
});

const Resource = mongoose.model('Resource', resourceSchema);

module.exports = Resource;
