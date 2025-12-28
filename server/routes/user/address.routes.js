const express = require('express');
const router = express.Router();
const addressController = require('../../controllers/user/address.controller');
const authMiddleware = require('../../middleware/auth/auth.middleware');

// add address
router.post('/', authMiddleware, addressController.addAddress);

// get my addresses
router.get('/', authMiddleware, addressController.getMyAddresses);

// update address
router.put('/:id', authMiddleware, addressController.updateAddress);

// delete address
router.delete('/:id', authMiddleware, addressController.deleteAddress);

module.exports = router;
