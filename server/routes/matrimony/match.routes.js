const express = require('express');
const router = express.Router();

const controller = require('../../controllers/matrimony/match.controller');
const authMiddleware = require('../../middleware/auth/auth.middleware');

router.post('/', authMiddleware, controller.createMatch);
router.get('/my', authMiddleware, controller.getMyMatches);

module.exports = router;
