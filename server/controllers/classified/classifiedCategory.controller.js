const ClassifiedCategory = require('../../models/classifieds/ClassifiedCategory.model');

/**
 * CREATE CATEGORY (ADMIN)
 */
exports.createCategory = async (req, res) => {
  try {
    const category = await ClassifiedCategory.create({
      name: req.body.name,
      icon: req.body.icon,
      isActive: true,
    });

    res.status(201).json({
      message: 'Category created successfully',
      category,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET ALL CATEGORIES (PUBLIC)
 */
exports.getCategories = async (req, res) => {
  try {
    const categories = await ClassifiedCategory.find({ isActive: true });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
