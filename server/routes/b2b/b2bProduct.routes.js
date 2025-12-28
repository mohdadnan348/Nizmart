const express = require('express');
const router = express.Router();

const b2bProductController = require('../../controllers/b2b/b2bProduct.controller');
const authMiddleware = require('../../middleware/auth/auth.middleware');

// create product (company owner)
router.post('/', authMiddleware, b2bProductController.createProduct);

// get all products (public)
router.get('/', b2bProductController.getAllProducts);

// get products by company (public)
router.get(
  '/company/:companyId',
  b2bProductController.getProductsByCompany
);

// get product by id (public)
router.get('/:id', b2bProductController.getProductById);

// update product (company owner)
router.put('/:id', authMiddleware, b2bProductController.updateProduct);

// activate / deactivate product (company owner)
router.patch(
  '/:id/toggle-status',
  authMiddleware,
  b2bProductController.toggleProductStatus
);

module.exports = router;
