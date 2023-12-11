const express = require("express");
const router = express.Router();
mongoose = require('mongoose');

router.get('/getDatabases', async (req, res) => {
    try {
        const admin = mongoose.connection.getClient().db().admin();
        const databaseList = await admin.listDatabases();

        const filteredDatabases = databaseList.databases.filter(
            (db) =>
                db.name !== 'admin' &&
                db.name !== 'config' &&
                db.name !== 'local'
        );

        res.status(200).json({ databases: filteredDatabases });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: error.message || 'Internal Server Error',
        });
    }
});

router.delete('/deleteDatabase/:databaseName', async (req, res) => {
	const { databaseName } = req.params;

	try {
		if (!databaseName) {
			return res.status(400).json({ error: 'Invalid database name' });
		}

        const client = mongoose.connection.getClient();
        const db = client.db(databaseName);
        await db.dropDatabase();

		res.status(200).json({
			message: `Database ${databaseName} deleted successfully`,
		});
	} catch (error) {
		console.error('Error deleting database:', error);
		res.status(500).json({
			error: `Error deleting database: ${
				error.message || 'Internal Server Error'
			}`,
		});
	}
});

module.exports = router;