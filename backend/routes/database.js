const express = require("express");
const router = express.Router();
const DatabaseController = require('../controllers/DatabaseController');
const { authenticate, requireRole } = require('../utils/auth');

router.get('/getDatabases', authenticate, requireRole('admin', 'root'), DatabaseController.getDatabases);
router.delete('/deleteDatabase/:databaseName', authenticate, requireRole('admin', 'root'), DatabaseController.deleteDatabase);

module.exports = router;