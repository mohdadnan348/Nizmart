const Restaurant = require('../../models/food/Restaurant.model');

/**
 * REGISTER RESTAURANT (SELF / OWNER)
 */
exports.registerRestaurant = async (req, res) => {
  try {
    const existing = await Restaurant.findOne({ owner: req.user.userId });
    if (existing) {
      return res.status(400).json({ message: 'Restaurant already registered' });
    }

    const restaurant = await Restaurant.create({
      owner: req.user.userId,
      ...req.body,
    });

    res.status(201).json({
      message: 'Restaurant registered successfully',
      restaurant,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET ALL RESTAURANTS (PUBLIC)
 */
exports.getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({
      isActive: true,
      isOpen: true,
    }).sort({ createdAt: -1 });

    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET RESTAURANT BY ID (PUBLIC)
 */
exports.getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * UPDATE RESTAURANT (OWNER)
 */
exports.updateRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.userId },
      req.body,
      { new: true }
    );

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    res.json({
      message: 'Restaurant updated successfully',
      restaurant,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * TOGGLE OPEN / CLOSE (OWNER)
 */
exports.toggleOpenStatus = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({
      owner: req.user.userId,
    });

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    restaurant.isOpen = !restaurant.isOpen;
    await restaurant.save();

    res.json({
      message: `Restaurant is now ${
        restaurant.isOpen ? 'OPEN' : 'CLOSED'
      }`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ACTIVATE / DEACTIVATE RESTAURANT (ADMIN)
 */
exports.toggleActiveStatus = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    restaurant.isActive = !restaurant.isActive;
    await restaurant.save();

    res.json({
      message: `Restaurant ${
        restaurant.isActive ? 'activated' : 'deactivated'
      } successfully`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
