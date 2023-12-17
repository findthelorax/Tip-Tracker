const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');

router.post('/', UserController.addUser);
router.get('/:userId', UserController.getUser);
router.get('/', UserController.getAllUsers);
router.delete('/:userId', UserController.deleteUser);

module.exports = router;