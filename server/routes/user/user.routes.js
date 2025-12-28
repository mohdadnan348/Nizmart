const express = require('express');
const router = express.Router();
const userController = require('../../controllers/user/user.controller');
const authMiddleware = require('../../middleware/auth/auth.middleware');
// optional: admin middleware later

// admin: get all users
router.get('/', authMiddleware, userController.getAllUsers);

// admin: get user by id
router.get('/:id', authMiddleware, userController.getUserById);

// self: update profile
router.put('/profile/update', authMiddleware, userController.updateProfile);

// admin: activate / deactivate
router.patch('/:id/toggle-status', authMiddleware, userController.toggleUserStatus);

// admin: delete user
router.delete('/:id', authMiddleware, userController.deleteUser);

module.exports = router;
