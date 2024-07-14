const Category = require('../Models/categoriesModel.js');

// Create a new category
exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const category = new Category({ name, description });

    // Handle multiple photo uploads
    if (req.files && req.files.length > 0) {
      category.photos = req.files.map(file => file.path);
    }

    await category.save();
    res.status(201).json({ message: 'Category created successfully', category });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get a single category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.status(200).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update a category by ID
exports.updateCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { name, description } = req.body;
    const updateData = { name, description };

    // Handle multiple photo uploads
    if (req.files && req.files.length > 0) {
      updateData.photos = req.files.map(file => file.path);
    }

    const updatedCategory = await Category.findByIdAndUpdate(categoryId, updateData, { new: true });
    if (!updatedCategory) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.status(200).json({ message: 'Category updated successfully', updatedCategory });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete a category by ID
exports.deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const deletedCategory = await Category.findByIdAndDelete(categoryId);
    if (!deletedCategory) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.status(200).json("Category deleted Successfully")
    // res.status(200).json({ message: 'Category deleted successfully', deletedCategory });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};
