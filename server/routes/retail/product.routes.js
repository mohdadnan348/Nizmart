const express = require('express');
const router = express.Router();

const productController = require('../../controllers/retail/product.controller');
const authMiddleware = require('../../middleware/auth/auth.middleware');

// create product (seller)
router.post('/', authMiddleware, productController.createProduct);

// get all products (public)
router.get('/', productController.getAllProducts);

// get products by category (public)
router.get(
  '/category/:categoryId',
  productController.getProductsByCategory
);

// get product by id (public)
router.get('/:id', productController.getProductById);

// update product (seller)
router.put('/:id', authMiddleware, productController.updateProduct);

// activate / deactivate product (seller)
router.patch(
  '/:id/toggle-status',
  authMiddleware,
  productController.toggleProductStatus
);

module.exports = router;
