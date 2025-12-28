const express = require('express');
const router = express.Router();

const productCategoryController = require('../../controllers/retail/productCategory.controller');
const authMiddleware = require('../../middleware/auth/auth.middleware');

// create category (admin)
router.post('/', authMiddleware, productCategoryController.createCategory);

// get all categories (public)
router.get('/', productCategoryController.getAllCategories);

// get category by id
router.get('/:id', productCategoryController.getCategoryById);

// update category (admin)
router.put('/:id', authMiddleware, productCategoryController.updateCategory);

// activate / deactivate category (admin)
router.patch(
  '/:id/toggle-status',
  authMiddleware,
  productCategoryController.toggleCategoryStatus
);

module.exports = router;
