const Product = require('../Models/productsModel');
const Category = require('../Models/categoriesModel');

exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, salePrice, salePriceDate, isTrending, units, catID } = req.body;
    const images = req.files.map(file => file.path);

    const category = await Category.findById(catID);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const newProduct = new Product({
      name,
      description,
      images,
      price,
      salePrice,
      salePriceDate,
      isTrending,
      units,
      catID: category._id
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('catID', 'name');
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('catID', 'name');
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};



exports.getTrendingProducts = async (req, res) => {
  try {
    const trendingProducts = await Product.find({ isTrending: true }).populate('catID', 'name');
    res.status(200).json(trendingProducts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Search products by letters (partial match) and by name
// exports.searchProducts = async (req, res) => {
//   const { name, letter, partial } = req.query;

//   try {
//     let products;

//     if (name) {
//       // Exact name search
//       products = await Product.find({ name: name });
//     } else if (letter) {
//       // Search by first letter
//       const regex = new RegExp(`^${letter}`, 'i'); // case-insensitive
//       products = await Product.find({ name: regex });
//     } else if (partial) {
//       // Partial name search
//       const regex = new RegExp(partial, 'i'); // case-insensitive
//       products = await Product.find({ name: regex });
//     } else {
//       // If no query params, return all products
//       products = await Product.find();
//     }

//     res.status(200).json(products);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
exports.searchProducts = async (req, res) => {
  const { name, letter, partial } = req.query;

  try {
    let products;

    if (name) {
      // Exact name search
      products = await Product.find({ name: name });
    } else if (letter) {
      // Search by first letter
      const regex = new RegExp(`^${letter}`, 'i'); // case-insensitive
      products = await Product.find({ name: regex });
    } else if (partial) {
      // Partial name search
      const regex = new RegExp(partial, 'i'); // case-insensitive
      products = await Product.find({ name: regex });
    } else {
      // If no query params, return all products
      products = await Product.find();
    }

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getProductsByCategoryId = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const products = await Product.find({ catID: categoryId });

    // Check if category has no products
    if (products.length === 0) {
      return res.status(404).json({ error: 'No products found for this category' });
    }

    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Controller function to get products by category ID
// export const getProductsByCategory = async (req, res) => {
//   try {
//     const { catID } = req.params; // Get the catID from the request parameters
//     const products = await Product.find({ catID }); // Find products by catID
//     res.status(200).json(products); // Send the products as a response
//   } catch (error) {
//     res.status(500).json({ message: error.message }); // Send an error response if something goes wrong
//   }
// };

exports.getProductByName = async (req, res) => {
  try {
    const products = await Product.find({ name: { $regex: new RegExp(req.params.name, 'i') } }).populate('catID', 'name');
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};


exports.updateProductById = async (req, res) => {
  try {
    const { name, description, price, salePrice, salePriceDate, isTrending, units, catID } = req.body;
    const images = req.files.map(file => file.path);

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
      name,
      description,
      images,
      price,
      salePrice,
      salePriceDate,
      isTrending,
      units,
      catID
    }, { new: true });

    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(updatedProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteProductById = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(deletedProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
