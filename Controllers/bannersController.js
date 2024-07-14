// controllers/bannerController.js
const Banner = require('../Models/bannersModel.js');

// Create a new banner
exports.createBanner = async (req, res) => {
  try {
    const { name, description } = req.body;
    const images = req.files.map(file => file.path);  // Save file paths to the images array
    const newBanner = new Banner({ name, description, images });
    const savedBanner = await newBanner.save();
    res.status(201).json(savedBanner);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// Get all banners
exports.getBanners = async (req, res) => {
  try {
    const banners = await Banner.find();
    res.status(200).json(banners);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get banner by ID
exports.getBannerById = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) return res.status(404).json({ message: 'Banner not found' });
    res.status(200).json(banner);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a banner
// Update a banner
exports.updateBanner = async (req, res) => {
  try {
    const images = req.files.map(file => file.path);  // Save file paths to the images array
    const updatedData = { ...req.body, images };
    const updatedBanner = await Banner.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    if (!updatedBanner) return res.status(404).json({ message: 'Banner not found' });
    res.status(200).json(updatedBanner);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a banner
exports.deleteBanner = async (req, res) => {
  try {
    const deletedBanner = await Banner.findByIdAndDelete(req.params.id);
    if (!deletedBanner) return res.status(404).json({ message: 'Banner not found' });
    res.status(200).json({ message: 'Banner deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
