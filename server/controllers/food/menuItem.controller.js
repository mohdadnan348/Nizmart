const MenuItem = require('../../models/food/MenuItem.model');
const FoodCategory = require('../../models/food/FoodCategory.model');
const Restaurant = require('../../models/food/Restaurant.model');

/**
 * CREATE MENU ITEM (RESTAURANT OWNER)
 */
exports.createMenuItem = async (req, res) => {
  try {
    const {
      restaurant,
      category,
      name,
      description,
      price,
      isVeg,
      image,
    } = req.body;

    // check restaurant ownership
    const rest = await Restaurant.findOne({
      _id: restaurant,
      owner: req.user.userId,
    });
    if (!rest) {
      return res.status(403).json({ message: 'Not allowed for this restaurant' });
    }

    // check category belongs to restaurant
    const foodCategory = await FoodCategory.findOne({
      _id: category,
      restaurant,
    });
    if (!foodCategory) {
      return res.status(400).json({ message: 'Invalid food category' });
    }

    const menuItem = await MenuItem.create({
      restaurant,
      category,
      name,
      description,
      price,
      isVeg,
      image,
    });

    res.status(201).json({
      message: 'Menu item created successfully',
      menuItem,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET MENU ITEMS BY RESTAURANT (PUBLIC)
 */
exports.getMenuByRestaurant = async (req, res) => {
  try {
    const items = await MenuItem.find({
      restaurant: req.params.restaurantId,
      isAvailable: true,
    })
      .populate('category', 'name')
      .sort({ createdAt: -1 });

    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET MENU ITEMS BY CATEGORY (PUBLIC)
 */
exports.getMenuByCategory = async (req, res) => {
  try {
    const items = await MenuItem.find({
      category: req.params.categoryId,
      isAvailable: true,
    }).sort({ createdAt: -1 });

    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * UPDATE MENU ITEM (RESTAURANT OWNER)
 */
exports.updateMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id).populate('restaurant');

    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    if (item.restaurant.owner.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not allowed' });
    }

    Object.assign(item, req.body);
    await item.save();

    res.json({
      message: 'Menu item updated successfully',
      item,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ENABLE / DISABLE MENU ITEM (RESTAURANT OWNER)
 */
exports.toggleAvailability = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id).populate('restaurant');

    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    if (item.restaurant.owner.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not allowed' });
    }

    item.isAvailable = !item.isAvailable;
    await item.save();

    res.json({
      message: `Menu item ${
        item.isAvailable ? 'available' : 'unavailable'
      } now`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
