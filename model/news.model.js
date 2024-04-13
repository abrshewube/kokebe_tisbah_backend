const mongoose = require('mongoose');

const schoolNewsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String, // Store the URL of the uploaded image
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const SchoolNews = mongoose.model('SchoolNews', schoolNewsSchema);

module.exports = SchoolNews;
