const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const teamMembersRoutes = require('./routes/teamMembers');
const weeklyTotalsRoutes = require('./routes/weeklyTotals');
const dailyTotalsRoutes = require('./routes/dailyTotals');
const TeamMember = require('./models/teamMember');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use('/api/teamMembers', teamMembersRoutes);
app.use('/api/weeklyTotals', weeklyTotalsRoutes);
app.use('/api/dailyTotals', dailyTotalsRoutes);

mongoose.connect('mongodb://localhost:27017/tip-tracker');

app.get('/api/listDatabases', async (req, res) => {
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

app.delete('/api/deleteDatabase/:databaseName', async (req, res) => {
	const { databaseName } = req.params;

	try {
		if (!databaseName) {
			return res.status(400).json({ error: 'Invalid database name' });
		}

		await mongoose.connection.db.dropDatabase();

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

app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({ error: error.message || 'Internal Server Error' });
});
app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
