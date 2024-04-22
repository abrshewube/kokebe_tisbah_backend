const SchoolNews = require('../model/news.model');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
    cloud_name: 'dcixfqemc', 
    api_key: '443894683639552', 
    api_secret: 'bhj1-SWNgJSdjnFZE7Yv0jFqTMs' 
});

// Controller function to create a new school news with image upload
async function createSchoolNews(req, res) {
  try {
    const { title, description } = req.body;
    const image = req.file.path; // Assuming Multer middleware is used for file upload
    const isAdmin = req.user.role === 'admin'; // Check if user is admin

    if (!isAdmin) {
      return res.status(403).json({ message: 'Access Denied: Only admins can create news' });
    }

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(image);

    const newSchoolNews = new SchoolNews({
      title,
      description,
      image: result.secure_url // Store the secure URL of the uploaded image
    });

    await newSchoolNews.save();

    res.status(201).json({ message: 'School news created successfully', news: newSchoolNews });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
}

// Controller function to get details of a specific school news item
async function getSchoolNewsDetails(req, res) {
  try {
    const { id } = req.params;
    const newsItem = await SchoolNews.findById(id);

    if (!newsItem) {
      return res.status(404).json({ message: 'News not found' });
    }

    res.status(200).json({ news: newsItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
}

// Controller function to get all school news
async function getAllSchoolNews(req, res) {
  try {
    const allSchoolNews = await SchoolNews.find().sort({ createdAt: -1 });

    res.status(200).json({ news: allSchoolNews });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
}

// Controller function to delete a school news
async function deleteSchoolNews(req, res) {
  try {
    const { id } = req.params;
    const isAdmin = req.user.role === 'admin'; // Check if user is admin

    if (!isAdmin) {
      return res.status(403).json({ message: 'Access Denied: Only admins can delete news' });
    }

    const deletedNews = await SchoolNews.findByIdAndDelete(id);

    if (!deletedNews) {
      return res.status(404).json({ message: 'News not found' });
    }

    res.status(200).json({ message: 'News deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
}

// Controller function to update a school news
async function updateSchoolNews(req, res) {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const isAdmin = req.user.role === 'admin'; // Check if user is admin

    if (!isAdmin) {
      return res.status(403).json({ message: 'Access Denied: Only admins can edit news' });
    }

    const updatedNews = await SchoolNews.findByIdAndUpdate(id, { title, description }, { new: true });

    if (!updatedNews) {
      return res.status(404).json({ message: 'News not found' });
    }

    res.status(200).json({ message: 'News updated successfully', news: updatedNews });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
}
module.exports = { createSchoolNews,getSchoolNewsDetails, getAllSchoolNews,deleteSchoolNews,updateSchoolNews };
