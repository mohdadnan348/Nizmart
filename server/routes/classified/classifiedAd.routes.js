const express = require('express');
const router = express.Router();

const controller = require('../../controllers/classified/classifiedAd.controller');
const authMiddleware = require('../../middleware/auth/auth.middleware');

router.post('/', authMiddleware, controller.createAd);
router.get('/', controller.getAllAds);
router.get('/my', authMiddleware, controller.getMyAds);
router.get('/:id', controller.getAdById);
router.put('/:id', authMiddleware, controller.updateAd);
router.patch('/:id/status', authMiddleware, controller.updateAdStatus);

module.exports = router;
