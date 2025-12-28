const express = require('express');
const router = express.Router();
const roleController = require('../../controllers/user/role.controller');
const authMiddleware = require('../../middleware/auth/auth.middleware');
// future: admin middleware laga sakte ho

// create role
router.post('/', authMiddleware, roleController.createRole);

// get all roles
router.get('/', authMiddleware, roleController.getAllRoles);

// get role by id
router.get('/:id', authMiddleware, roleController.getRoleById);

// update role
router.put('/:id', authMiddleware, roleController.updateRole);

// delete role
router.delete('/:id', authMiddleware, roleController.deleteRole);

module.exports = router;
