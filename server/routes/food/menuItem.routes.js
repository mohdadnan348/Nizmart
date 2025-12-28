const express = require('express');
const router = express.Router();
const menuItemController = require('../../controllers/food/menuItem.controller');
const authMiddleware = require('../../middleware/auth/auth.middleware');

// create menu item (restaurant owner)
router.post('/', authMiddleware, menuItemController.createMenuItem);

// get menu by restaurant (public)
router.get(
  '/restaurant/:restaurantId',
  menuItemController.getMenuByRestaurant
);

// get menu by category (public)
router.get(
  '/category/:categoryId',
  menuItemController.getMenuByCategory
);

// update menu item (restaurant owner)
router.put('/:id', authMiddleware, menuItemController.updateMenuItem);

// enable / disable menu item
router.patch(
  '/:id/toggle-availability',
  authMiddleware,
  menuItemController.toggleAvailability
);

module.exports = router;
