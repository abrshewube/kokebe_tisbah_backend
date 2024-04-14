const mongoose = require('mongoose');

const clubApplicationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  club: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Club',
    required: true
  },
  reason: String,
  contribution: String,
  status: {
    type: String,
    enum: ['pending', 'approved', 'denied'],
    default: 'pending'
  }
});

const ClubApplication = mongoose.model('ClubApplication', clubApplicationSchema);

module.exports = ClubApplication;
