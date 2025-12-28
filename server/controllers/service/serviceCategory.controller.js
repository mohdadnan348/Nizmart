const ServiceCategory = require('../../models/service/ServiceCategory.model');

/**
 * CREATE SERVICE CATEGORY (ADMIN)
 */
exports.createCategory = async (req, res) => {
  try {
    const { name, icon, description } = req.body;

    const existing = await ServiceCategory.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    const category = await ServiceCategory.create({
      name,
      icon,
      description,
    });

    res.status(201).json({
      message: 'Service category created successfully',
      category,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET ALL SERVICE CATEGORIES (PUBLIC)
 */
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await ServiceCategory.find({ isActive: true }).sort({
      createdAt: -1,
    });

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
    const category = await ServiceCategory.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * UPDATE SERVICE CATEGORY (ADMIN)
 */
exports.updateCategory = async (req, res) => {
  try {
    const category = await ServiceCategory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json({
      message: 'Service category updated successfully',
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
    const category = await ServiceCategory.findById(req.params.id);

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
