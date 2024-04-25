
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2; // Import Cloudinary
const User = require('../model/user.model');

// Initialize Cloudinary
cloudinary.config({
  cloud_name: 'dcixfqemc',
  api_key: '443894683639552',
  api_secret: 'bhj1-SWNgJSdjnFZE7Yv0jFqTMs'
});




// Function to register a new user
async function register(req, res) {
  try {
    const { fullName, username, password, role, grade } = req.body;
    const profilePicture = req.file; // Uploaded profile picture file

    // Check if the username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Upload profile picture to Cloudinary
    const result = await cloudinary.uploader.upload(profilePicture.path);

    // Create user with profile picture URL
    const user = new User({
      fullName,
      username,
      password: hashedPassword,
      role,
      grade,
      profilePicture: result.secure_url // URL of the uploaded profile picture
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign({
      username: user.username,
      role: user.role,
      fullName: user.fullName,
      _id: user._id,
      grade: user.grade,
      profilePicture: user.profilePicture
    }, 'secret');

    res.status(201).json({ message: 'User registered successfully', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
}




// Function to upload profile picture
async function uploadProfilePicture(req, res) {
  try {
    // Check if file exists in request
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);

    // Update user's profile picture URL in database
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.profilePicture = result.secure_url;
    await user.save();

    res.json({ message: 'Profile picture uploaded successfully', imageUrl: result.secure_url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
}

// Function to update user profile
// Function to update user profile
async function updateProfile(req, res) {
  try {
    const { fullName, grade } = req.body;
    const profilePicture = req.file; // Uploaded profile picture file

    // Find user by ID
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user profile fields
    user.fullName = fullName;
    user.grade = grade;

    // Check if a new profile picture is uploaded
    if (profilePicture) {
      // Upload new profile picture to Cloudinary
      const result = await cloudinary.uploader.upload(profilePicture.path);
      user.profilePicture = result.secure_url;
    }

    await user.save();

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
}


// Function for user login
async function login(req, res) {
  try {
    const { username, password } = req.body;

    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Generate JWT token
const token = jwt.sign({
  username: user.username,
  role: user.role,
  fullName: user.fullName,
  _id: user._id,
  grade: user.grade,
  profilePicture: user.profilePicture
}, 'secret');

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
}

// Function to delete user (restricted to admin role)
async function deleteUser(req, res) {
  try {
    // Check if user making the request is an admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access Denied: Admin only' });
    }

    const userId = req.params.id;

    // Find user by ID and delete
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }


res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
}
// Function to get user ID
async function getUserId(req, res) {
  try {
    // Assuming the decoded user object is stored in req.user by the authMiddleware
    const userId = req.user._id; // Assuming your User model has a field called '_id' for user ID
    console.log("userId", userId);
    res.json({ userId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
}
// Function to get all users (for admin)
async function getAllUsers(req, res) {
  try {
    // Check if the user making the request is an admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access Denied: Admin only' });
    }

    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
}

// Function to update user role (for admin)
async function updateUserRole(req, res) {
  try {
    // Check if the user making the request is an admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access Denied: Admin only' });
    }

    const userId = req.params.id;
    const { role } = req.body;

    // Find user by ID and update role
    const user = await User.findByIdAndUpdate(userId, { role }, { new: true });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User role updated successfully', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
}

module.exports = { register, getAllUsers, updateUserRole ,getUserId,uploadProfilePicture, updateProfile, login, deleteUser };