const express = require('express');
const router = express.Router();
const serviceCategoryController = require('../../controllers/service/serviceCategory.controller');
const authMiddleware = require('../../middleware/auth/auth.middleware');
// future: admin middleware laga sakte ho

// create category (admin)
router.post('/', authMiddleware, serviceCategoryController.createCategory);

// get all categories (public)
router.get('/', serviceCategoryController.getAllCategories);

// get category by id
router.get('/:id', serviceCategoryController.getCategoryById);

// update category (admin)
router.put('/:id', authMiddleware, serviceCategoryController.updateCategory);

// activate / deactivate category (admin)
router.patch(
  '/:id/toggle-status',
  authMiddleware,
  serviceCategoryController.toggleCategoryStatus
);

module.exports = router;
