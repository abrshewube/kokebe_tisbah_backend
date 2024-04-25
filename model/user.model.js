const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: String,
  username: String,
  password: String,
  role: {
    type: String,
    default: 'student'
  },
  grade: Number,
  profilePicture: String // Add profilePicture field to store the URL of the profile picture
});

const User = mongoose.model('User', userSchema);

module.exports = User;
