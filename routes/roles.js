var express = require('express');
var router = express.Router();
const roleController = require('../controllers/roleController');
const userController = require('../controllers/userController');

// GET all roles
router.get('/', roleController.getAllRoles);

// GET users by role ID
router.get('/:id/users', userController.getUsersByRole);

// GET role by ID
router.get('/:id', roleController.getRoleById);

// CREATE role
router.post('/', roleController.createRole);

// UPDATE role
router.put('/:id', roleController.updateRole);

// DELETE role
router.delete('/:id', roleController.deleteRole);

module.exports = router;
