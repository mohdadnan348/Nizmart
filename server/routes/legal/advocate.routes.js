const express = require('express');
const router = express.Router();

const advocateController = require('../../controllers/legal/advocate.controller');
const authMiddleware = require('../../middleware/auth/auth.middleware');

// register advocate (self)
router.post('/register', authMiddleware, advocateController.registerAdvocate);

// get all advocates (public)
router.get('/', advocateController.getAllAdvocates);

// get advocate by id (public)
router.get('/:id', advocateController.getAdvocateById);

// update advocate profile (self)
router.put(
  '/profile/update',
  authMiddleware,
  advocateController.updateAdvocateProfile
);

// activate / deactivate advocate (admin)
router.patch(
  '/:id/toggle-status',
  authMiddleware,
  advocateController.toggleAdvocateStatus
);

module.exports = router;
