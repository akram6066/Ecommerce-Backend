const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const productController = require('../Controllers/productController.js');


// POST a new product with multiple images
router.post('/create', upload.array('images', []), productController.createProduct);

// GET all products
router.get('/', productController.getAllProducts);
//get catid
router.get('/category/:id', productController.getProductsByCategoryId);
// GET a product by ID
router.get('/', productController.getProductById);

// GET a product by name
router.get('/name/:name', productController.getProductByName);

// PUT update a product by ID with multiple images
router.put('/:id', upload.array('photos', []), productController.updateProductById);

// DELETE a product by ID
router.delete('/:id', productController.deleteProductById);
// Route to get trending products
router.get('/trending', productController.getTrendingProducts);

router.get('/search', productController.searchProducts);

module.exports = router;
