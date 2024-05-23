// registration.controller.js
const cloudinary = require('cloudinary').v2;
const Registration = require('../model/registration.model');

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dcixfqemc', 
  api_key: '443894683639552', 
  api_secret: 'bhj1-SWNgJSdjnFZE7Yv0jFqTMs' 
});

async function createRegistration(req, res) {
  try {
    const { fullName, grade, lastYearSection } = req.body;
    const createdBy = req.user._id; // Assuming req.user is populated with authenticated user details

    // Check if a registration with the same information already exists
    const existingRegistration = await Registration.findOne({ fullName, grade, lastYearSection });

    if (existingRegistration) {
      return res.status(400).json({ message: 'Registration already exists' });
    }

    // Upload lastYearGradeResult file to Cloudinary
    const file = req.file.path;
    const uploadedResult = await cloudinary.uploader.upload(file);

    const newRegistration = new Registration({
      fullName,
      grade,
      lastYearSection,
      lastYearGradeResult: uploadedResult.secure_url, // Store the secure URL of the uploaded file
      createdBy
    });

    await newRegistration.save();

    res.status(201).json({ message: 'Registration submitted successfully', registration: newRegistration });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
}


async function getUnregisteredStudents(req, res) {
  try {
    // Fetch students who are not registered yet
    const unregisteredStudents = await Registration.find({ registrationStatus: 'pending' });

    res.status(200).json({ unregisteredStudents });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
}



async function approveRegistration(req, res) {
  try {
    const { id } = req.params;

    const updatedRegistration = await Registration.findByIdAndUpdate(id, { registrationStatus: 'approved' }, { new: true });

    if (!updatedRegistration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    // Check if the user is allowed to approve registrations
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access Denied: Registral Role only' });
    }

    res.status(200).json({ message: 'Registration approved successfully', registration: updatedRegistration });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
}

async function denyRegistration(req, res) {
  try {
    const { id } = req.params;

    const updatedRegistration = await Registration.findByIdAndUpdate(id, { registrationStatus: 'denied' }, { new: true });

    if (!updatedRegistration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    // Check if the user is allowed to deny registrations
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access Denied: Registral Role only' });
    }

    res.status(200).json({ message: 'Registration denied successfully', registration: updatedRegistration });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
}

async function getRegistrationStatus(req, res) {
  try {
    const userId = req.user._id;

    const registration = await Registration.findOne({ createdBy: userId });

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    // Check if the user is allowed to view the registration status
   

    // if (!allowedRoles.includes(req.user.role)) {
    //   return res.status(403).json({ message: 'Access Denied' });
    // }

    res.status(200).json({ registration });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
}

module.exports = { createRegistration, getUnregisteredStudents,approveRegistration, denyRegistration, getRegistrationStatus };
