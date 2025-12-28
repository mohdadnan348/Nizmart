const express = require('express');
const router = express.Router();
const restaurantController = require('../../controllers/food/restaurant.controller');
const authMiddleware = require('../../middleware/auth/auth.middleware');
// future: admin middleware add kar sakte ho

// register restaurant (owner)
router.post('/register', authMiddleware, restaurantController.registerRestaurant);

// get all restaurants (public)
router.get('/', restaurantController.getAllRestaurants);

// get restaurant by id (public)
router.get('/:id', restaurantController.getRestaurantById);

// update restaurant (owner)
router.put(
  '/:id',
  authMiddleware,
  restaurantController.updateRestaurant
);

// open / close restaurant (owner)
router.patch(
  '/toggle-open',
  authMiddleware,
  restaurantController.toggleOpenStatus
);

// activate / deactivate restaurant (admin)
router.patch(
  '/:id/toggle-status',
  authMiddleware,
  restaurantController.toggleActiveStatus
);

module.exports = router;
