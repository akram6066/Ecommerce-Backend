const express = require('express');
const router = express.Router();
const multer = require('multer');
const { createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory } = require('../Controllers/categoryControllers.js');

// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Configure Multer with file size limit (e.g., 10MB)
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // Maximum file size in bytes (e.g., 10MB)
});

// POST route to create a new category
router.post('/create', upload.array('photos', []), createCategory); // Handle multiple photos

// GET route to get all categories
router.get('/', getAllCategories);

// GET route to get a single category by ID
router.get('/:id', getCategoryById);

// PUT route to update a category by ID
router.put('/:id', upload.array('photos', []), updateCategory); // Handle multiple photos

// DELETE route to delete a category by ID
router.delete('/:id', deleteCategory);

module.exports = router;
