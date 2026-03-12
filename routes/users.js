var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController');

// GET all users
router.get('/', userController.getAllUsers);

// ENABLE user (set status = true)
router.post('/enable', userController.enableUser);

// DISABLE user (set status = false)
router.post('/disable', userController.disableUser);

// GET user by ID
router.get('/:id', userController.getUserById);

// CREATE user
router.post('/', userController.createUser);

// UPDATE user
router.put('/:id', userController.updateUser);

// DELETE user (soft delete)
router.delete('/:id', userController.deleteUser);

// RESTORE user
router.patch('/:id/restore', userController.restoreUser);

module.exports = router;
