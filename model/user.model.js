const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: String,
  username: String,
  password: String,
  role: {
    type: String,
    default: 'student' // Default role is set to 'student'
  },
  grade: Number,
});

const User = mongoose.model('User', userSchema);

module.exports = User;
