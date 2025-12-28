const express = require('express');
const router = express.Router();

const productVariantController = require('../../controllers/retail/productVariant.controller');
const authMiddleware = require('../../middleware/auth/auth.middleware');

// create variant (seller)
router.post('/', authMiddleware, productVariantController.createVariant);

// get variants by product (public)
router.get(
  '/product/:productId',
  productVariantController.getVariantsByProduct
);

// update variant (seller)
router.put(
  '/:id',
  authMiddleware,
  productVariantController.updateVariant
);

// delete variant (seller)
router.delete(
  '/:id',
  authMiddleware,
  productVariantController.deleteVariant
);

module.exports = router;
