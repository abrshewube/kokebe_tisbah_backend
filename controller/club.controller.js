const Club = require('../models/club.model');
const User = require('../models/user.model');

// Get all clubs
async function getAllClubs(req, res) {
  try {
    const clubs = await Club.find().populate('leader', 'username'); // Populate leader field with username
    res.status(200).json({ clubs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
}

// Create a club (accessible only to admins)
async function createClub(req, res) {
  try {
    const { name, description } = req.body;
    const newClub = new Club({ name, description });
    await newClub.save();
    res.status(201).json({ message: 'Club created successfully', club: newClub });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
}

// Delete a club (accessible only to admins)
async function deleteClub(req, res) {
  try {
    const { id } = req.params;
    const deletedClub = await Club.findByIdAndDelete(id);
    if (!deletedClub) {
      return res.status(404).json({ message: 'Club not found' });
    }
    res.status(200).json({ message: 'Club deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
}

// Assign club leader (accessible only to admins)
async function assignClubLeader(req, res) {
  try {
    const { clubId, userId } = req.body;
    const club = await Club.findById(clubId);
    const user = await User.findById(userId);
    if (!club || !user) {
      return res.status(404).json({ message: 'Club or user not found' });
    }
    club.leader = userId;
    await club.save();
    res.status(200).json({ message: 'Club leader assigned successfully', club });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
}

// Edit club details (accessible only to club admins)
async function editClubDetails(req, res) {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const club = await Club.findById(id);
    if (!club) {
      return res.status(404).json({ message: 'Club not found' });
    }
    // Check if the user is a club admin
    if (!club.admins.includes(req.user._id)) {
      return res.status(403).json({ message: 'Access Denied: Only club admins can edit club details' });
    }
    club.name = name;
    club.description = description;
    await club.save();
    res.status(200).json({ message: 'Club details updated successfully', club });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
}

module.exports = { getAllClubs, createClub, deleteClub, assignClubLeader, editClubDetails };
