const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const teamRoutes = require('./routes/teamRoutes'); // Adjust the path based on your project structure
const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());
app.use('/api/teamRoutes', teamRoutes); // Mount the team routes

mongoose.connect('mongodb://localhost:27017/tip-tracker');

app.get('/api/team', async (req, res) => {
	const teamMembers = await TeamMember.find();
	res.json(teamMembers);
});

app.post('/api/team', async (req, res) => {
	const { name, position } = req.body;

	if (!name || !position) {
		return res
			.status(400)
			.json({ error: 'Both name and position are required' });
	}

	const newMember = new TeamMember({ name, position });
	await newMember.save();

	res.json(newMember);
});

const TeamMember = require('../backend/models/teamMember');

app.delete('/api/team/:id', async (req, res) => {
	const memberId = req.params.id;
	try {
		// Find and remove the team member by ID
		//* consider: await TeamMember.findOneAndDelete({ _id: memberId });
		await TeamMember.findOneAndDelete({ _id: memberId });
		res.json({
			success: true,
			message: 'Team member deleted successfully',
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

const dailyTotalsSchema = new mongoose.Schema({
	date: {
		type: Date,
		default: Date.now,
	},
	foodSales: Number,
	barSales: Number,
	nonCashTips: Number,
	cashTips: Number,
	barTipOuts: Number,
	runnerTipOuts: Number,
	hostTipOuts: Number,
	totalTipOut: Number,
	tipsReceived: Number,
	tipsPayroll: Number,
});

const weeklyTotalsSchema = new mongoose.Schema({
	startDate: {
		type: Date,
		default: Date.now,
	},
	endDate: {
		type: Date,
		default: Date.now,
	},
	foodSales: Number,
	barSales: Number,
	nonCashTips: Number,
	cashTips: Number,
	barTipOuts: Number,
	runnerTipOuts: Number,
	hostTipOuts: Number,
	totalTipOut: Number,
	tipsReceived: Number,
	tipsPayroll: Number,
});

const DailyTotals = mongoose.model('DailyTotals', dailyTotalsSchema);
const WeeklyTotals = mongoose.model('WeeklyTotals', weeklyTotalsSchema);

// Get daily totals for the restaurant
app.get('/api/dailyTotals', async (req, res) => {
	try {
		// Fetch daily totals from the database or calculate it as needed
		// For simplicity, let's assume you have a separate collection for daily totals
		// and fetch the latest entry.
		const latestDailyTotals = await DailyTotals.find();

		res.json(latestDailyTotals);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

// Update daily totals for the restaurant
app.post('/api/dailyTotals', async (req, res) => {
	try {
		const { dailyTotals } = req.body;

		// Save the daily totals to the database
		const newDailyTotals = new DailyTotals({ ...dailyTotals });
		await newDailyTotals.save();

		res.json(newDailyTotals);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

// Update daily sales for a team member
app.post('/api/team/:id/dailyTotals', async (req, res) => {
	try {
		const memberId = req.params.id;
		const { dailyTotals } = req.body;
		
		// Find the team member by ID
		const teamMember = await TeamMember.findById(memberId);
		
		// Update daily sales for the team member
		teamMember.dailyTotals.push(dailyTotals);
		await teamMember.save();
		
		res.json(teamMember);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({ error: 'Internal Server Error' });
});
app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
