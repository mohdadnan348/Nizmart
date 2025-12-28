const express = require('express');
const router = express.Router();
const walletController = require('../../controllers/user/wallet.controller');
const authMiddleware = require('../../middleware/auth/auth.middleware');
// future: admin middleware add kar sakte ho

// get my wallet
router.get('/me', authMiddleware, walletController.getMyWallet);

// admin/system: add transaction
router.post('/transaction', authMiddleware, walletController.addTransaction);

// admin: get wallet by user id
router.get(
  '/user/:userId',
  authMiddleware,
  walletController.getWalletByUser
);

module.exports = router;
