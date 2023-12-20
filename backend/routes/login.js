const express = require('express');
const router = express.Router();
const LoginController = require('../controllers/LoginController');
const { authenticate, requireRole } = require('../utils/auth');

router.get('/profile', authenticate, LoginController.profile);
router.patch('/profile', authenticate, LoginController.updateProfile);
router.delete('/profile', authenticate, LoginController.deleteProfile);

router.post('/login', LoginController.login);
router.get('/login', LoginController.getLogin);
router.post('/signup', LoginController.signup);

router.post('/logout', LoginController.logout);

module.exports = router;