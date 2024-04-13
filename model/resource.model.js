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
  cloudinaryPublicId: String  // Store the public ID of the uploaded file in Cloudinary
});

const Resource = mongoose.model('Resource', resourceSchema);

module.exports = Resource;
