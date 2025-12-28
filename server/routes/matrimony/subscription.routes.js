const express = require('express');
const router = express.Router();

const controller = require('../../controllers/matrimony/subscription.controller');
const authMiddleware = require('../../middleware/auth/auth.middleware');

router.post('/', authMiddleware, controller.subscribe);
router.get('/my', authMiddleware, controller.getMySubscription);

module.exports = router;
