// registration.model.js

const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  grade: {
    type: Number,
    required: true,
    min: 9,
    max: 12
  },
  lastYearSection: {
    type: String,
    required: true
  },
  lastYearGradeResult: {
    type: String,
    required: true
  },
  registrationStatus: {
    type: String,
    enum: ['pending', 'approved', 'denied'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid'],
    default: 'pending'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Registration = mongoose.model('Registration', registrationSchema);

module.exports = Registration;
