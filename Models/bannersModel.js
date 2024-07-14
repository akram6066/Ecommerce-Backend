// models/banner.js
const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  images: [
    {
      type: String, // Assuming images are stored as URLs
      required: true,
    },
  ],
});

const Banner = mongoose.model('Banner', bannerSchema);

module.exports = Banner;
