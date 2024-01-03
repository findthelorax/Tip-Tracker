const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const validateRequest = require('../middlewares/validateRequest');
const authenticate = require('../middlewares/authenticate');

router.post('/signup', validateRequest(userController.signupSchema), userController.signup);
router.post('/login', validateRequest(userController.loginSchema), userController.login);

// Add authenticate middleware to routes that need authentication
// router.get('/profile', authenticate, userController.getProfile);

module.exports = router;