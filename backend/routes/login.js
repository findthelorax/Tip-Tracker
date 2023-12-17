const express = require('express');
const router = express.Router();
const LoginController = require('../controllers/LoginController');

router.get('/profile', LoginController.profile);
router.patch('/profile', LoginController.updateProfile);
router.delete('/profile', LoginController.deleteProfile);

router.post('/login', LoginController.login);
router.post('/signup', LoginController.signup);
router.get('/login', LoginController.getLogin);

module.exports = router;