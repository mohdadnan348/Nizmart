const FoodCategory = require('../../models/food/FoodCategory.model');
const Restaurant = require('../../models/food/Restaurant.model');

/**
 * CREATE FOOD CATEGORY (RESTAURANT OWNER)
 */
exports.createFoodCategory = async (req, res) => {
  try {
    const { restaurant, name } = req.body;

    // ensure restaurant belongs to logged-in owner
    const rest = await Restaurant.findOne({
      _id: restaurant,
      owner: req.user.userId,
    });
    if (!rest) {
      return res.status(403).json({ message: 'Not allowed for this restaurant' });
    }

    const existing = await FoodCategory.findOne({ restaurant, name });
    if (existing) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    const category = await FoodCategory.create({
      restaurant,
      name,
    });

    res.status(201).json({
      message: 'Food category created successfully',
      category,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET FOOD CATEGORIES BY RESTAURANT (PUBLIC)
 */
exports.getCategoriesByRestaurant = async (req, res) => {
  try {
    const categories = await FoodCategory.find({
      restaurant: req.params.restaurantId,
      isActive: true,
    }).sort({ createdAt: -1 });

    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * UPDATE FOOD CATEGORY (RESTAURANT OWNER)
 */
exports.updateFoodCategory = async (req, res) => {
  try {
    const category = await FoodCategory.findById(req.params.id).populate(
      'restaurant'
    );

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    if (category.restaurant.owner.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not allowed' });
    }

    Object.assign(category, req.body);
    await category.save();

    res.json({
      message: 'Food category updated successfully',
      category,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ACTIVATE / DEACTIVATE CATEGORY (RESTAURANT OWNER)
 */
exports.toggleCategoryStatus = async (req, res) => {
  try {
    const category = await FoodCategory.findById(req.params.id).populate(
      'restaurant'
    );

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    if (category.restaurant.owner.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not allowed' });
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
