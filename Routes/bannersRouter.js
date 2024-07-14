// routes/bannerRouter.js
const express = require('express');
const router = express.Router();
const bannerController = require('../Controllers/bannersController.js');
const multer = require('multer');
const path = require('path');


// Set up multer for handling file uploads
// Set up multer for handling file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}`);
    }
  });

const upload = multer({ storage: storage });

// Create a new banner
router.post('/create', upload.array('images',[]), bannerController.createBanner);

// Get all banners
router.get('/', bannerController.getBanners);

// Get banner by ID
router.get('/:id', bannerController.getBannerById);

// Update a banner
router.put('/:id', upload.array('images',[]), bannerController.updateBanner);

// Delete a banner
router.delete('/:id', bannerController.deleteBanner);

module.exports = router;
