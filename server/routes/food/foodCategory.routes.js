const express = require('express');
const router = express.Router();
const foodCategoryController = require('../../controllers/food/foodCategory.controller');
const authMiddleware = require('../../middleware/auth/auth.middleware');

// create food category (restaurant owner)
router.post('/', authMiddleware, foodCategoryController.createFoodCategory);

// get categories by restaurant (public)
router.get(
  '/restaurant/:restaurantId',
  foodCategoryController.getCategoriesByRestaurant
);

// update category (restaurant owner)
router.put(
  '/:id',
  authMiddleware,
  foodCategoryController.updateFoodCategory
);

// activate / deactivate category (restaurant owner)
router.patch(
  '/:id/toggle-status',
  authMiddleware,
  foodCategoryController.toggleCategoryStatus
);

module.exports = router;
