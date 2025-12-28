const express = require('express');
const router = express.Router();

const controller = require('../../controllers/matrimony/interest.controller');
const authMiddleware = require('../../middleware/auth/auth.middleware');

router.post('/', authMiddleware, controller.sendInterest);
router.get('/received', authMiddleware, controller.getReceivedInterests);
router.patch('/:id', authMiddleware, controller.updateInterestStatus);

module.exports = router;
