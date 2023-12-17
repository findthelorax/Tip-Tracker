const express = require("express");
const router = express.Router();
const DatabaseController = require('../controllers/DatabaseController');

router.get('/getDatabases', DatabaseController.getDatabases);
router.delete('/deleteDatabase/:databaseName', DatabaseController.deleteDatabase);

module.exports = router;