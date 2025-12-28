const ProductCategory = require('../../models/retail/ProductCategory.model');

/**
 * CREATE PRODUCT CATEGORY (ADMIN)
 */
exports.createCategory = async (req, res) => {
  try {
    const { name, parentCategory } = req.body;

    const existing = await ProductCategory.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    const category = await ProductCategory.create({
      name,
      parentCategory: parentCategory || null,
    });

    res.status(201).json({
      message: 'Product category created successfully',
      category,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET ALL CATEGORIES (PUBLIC)
 */
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await ProductCategory.find({ isActive: true })
      .populate('parentCategory', 'name')
      .sort({ createdAt: -1 });

    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET CATEGORY BY ID
 */
exports.getCategoryById = async (req, res) => {
  try {
    const category = await ProductCategory.findById(req.params.id).populate(
      'parentCategory',
      'name'
    );

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * UPDATE CATEGORY (ADMIN)
 */
exports.updateCategory = async (req, res) => {
  try {
    const category = await ProductCategory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json({
      message: 'Product category updated successfully',
      category,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ACTIVATE / DEACTIVATE CATEGORY (ADMIN)
 */
exports.toggleCategoryStatus = async (req, res) => {
  try {
    const category = await ProductCategory.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    category.isActive = !category.isActive;
    await category.save();

    res.json({
      message: `Category ${
        category.isActive ? 'activated' : 'deactivated'
      } successfully`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
