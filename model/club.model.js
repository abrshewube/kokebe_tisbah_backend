const mongoose = require('mongoose');

const clubSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    leader: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    status: {
        type: String,
        enum: ['pending', 'approved', 'denied'],
        default: 'pending'
    },
    category: {
        type: String,
        required: true
    },
    establishedDate: {
        type: Date,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    website: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        required: true
    },
    contactNumber: {
        type: String,
        required: true
    },
    events: [{
        type: String
    }],
    socialMediaLinks: {
        facebook: String,
        twitter: String,
        instagram: String
    },
    logoUrl: {
        type: String,
        default: ''
    },
    coverPhotoUrl: {
        type: String,
        default: ''
    },
    missionStatement: {
        type: String,
        default: ''
    }
});

const Club = mongoose.model('Club', clubSchema);

module.exports = Club;
