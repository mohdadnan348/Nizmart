const express = require('express');
const router = express.Router();

const controller = require('../../controllers/matrimony/matrimonyProfile.controller');
const authMiddleware = require('../../middleware/auth/auth.middleware');

router.post('/me', authMiddleware, controller.upsertProfile);
router.get('/me', authMiddleware, controller.getMyProfile);
router.get('/', controller.browseProfiles);

module.exports = router;
