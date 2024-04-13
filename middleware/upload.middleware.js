const cloudinary = require('cloudinary').v2;
const Resource = require('../model/resource.model');

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dcixfqemc', 
  api_key: '443894683639552', 
  api_secret: 'bhj1-SWNgJSdjnFZE7Yv0jFqTMs' 
});

async function uploadResource(req, res, next) {
  try {
    console.log('Received file upload request');
    
    const file = req.file; // Assuming the file is sent as multipart/form-data
    console.log("files are ",file)
    if (!file) {
      console.log('No file uploaded');
      return res.status(400).json({ message: 'No file uploaded' });
    }

    console.log('File received:', file.originalname);

    // Upload file to Cloudinary
    console.log('Uploading file to Cloudinary...');
    const result = await cloudinary.uploader.upload(file.path);
    console.log('File uploaded to Cloudinary:', result.url);

    // Create resource with Cloudinary public ID
    console.log('Creating resource entry in database...');
    const newResource = new Resource({
      title: req.body.title,
      category: req.body.category,
      gradeLevel: req.body.gradeLevel,
      description: req.body.description,
      cloudinaryPublicId: result.public_id
    });
    await newResource.save();

    console.log('Resource entry created:', newResource);

    res.status(201).json({ message: 'File uploaded successfully', resource: newResource });
  } catch (error) {
    console.error('Error:', error);
    console.log(error)
    res.status(500).json({ message: 'Server Error' });
  }
}

module.exports = uploadResource;
