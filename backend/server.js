const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/restaurant', {
	useNewUrlParser: true,
});

const teamMemberSchema = new mongoose.Schema({
	name: String,
	position: String,
	dailyTotals: [
		{
			date: { type: Date, default: Date.now },
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
		},
	],
	weeklyTotals: {
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
	},
});

const TeamMember = mongoose.model('TeamMember', teamMemberSchema);

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
		const latestDailyTotals = await DailyTotals.findOne().sort({
			date: -1,
		});

		res.json(latestDailyTotals);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

// Get weekly totals for the restaurant
app.get('/api/weeklyTotals', async (req, res) => {
	try {
        const weeklyTotals = await TeamMember.find({}, 'name position weeklyTotals');
        res.json(weeklyTotals);

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

//! FIX ME
// Update weekly totals for the restaurant
app.post('/api/weeklyTotals', async (req, res) => {
	try {
		const { weeklySales } = req.body;

		// Save the weekly totals to the database
		const newWeeklyTotals = new WeeklyTotals({ ...weeklyTotals });
		await newWeeklyTotals.save();

		// Find the team member by ID
		const teamMember = await TeamMember.findOne({
			name: weeklySales.worker,
		});

		// Filter daily sales within the specified week
		const startDate = new Date(weeklySales.startDate);
		const endDate = new Date(weeklySales.endDate);
		const filteredDailySales = teamMember.dailySales.filter((dailySale) => {
            const saleDate = new Date(dailySale.date);
            return saleDate >= startDate && saleDate <= endDate;
		});

		// Sum up weekly sales
		const weeklyTotals = {
			foodSales: filteredDailySales.reduce(
				(total, sale) => total + (sale.foodSales || 0),
				0
			),
			barSales: filteredDailySales.reduce(
				(total, sale) => total + (sale.barSales || 0),
				0
			),
			nonCashTips: filteredDailySales.reduce(
				(total, sale) => total + (sale.nonCashTips || 0),
				0
			),
			cashTips: filteredDailySales.reduce(
				(total, sale) => total + (sale.cashTips || 0),
				0
			),
		};

		// Update weekly totals for the team member
		teamMember.weeklyTotals = weeklyTotals;
		await teamMember.save();

		res.json(teamMember);

		res.json(newWeeklyTotals);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({ error: 'Internal Server Error' });
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

// Calculate weekly and daily sales for each team member and the restaurant
app.get('/api/calculateSales', async (req, res) => {
	try {
		// Fetch all team members
		const teamMembers = await TeamMember.find();

		// Initialize total sales for the restaurant
		const totalSales = {
			foodSales: 0,
			barSales: 0,
			nonCashTips: 0,
			cashTips: 0,
			barTipOuts: 0,
			runnerTipOuts: 0,
			hostTipOuts: 0,
			totalTipOut: 0,
			tipsReceived: 0,
			tipsPayroll: 0,
		};

		// Calculate weekly and daily sales for each team member
		for (const member of teamMembers) {
			// Initialize weekly totals for the team member
			let weeklyTotals = {
				foodSales: 0,
				barSales: 0,
				nonCashTips: 0,
				cashTips: 0,
				barTipOuts: 0,
				runnerTipOuts: 0,
				hostTipOuts: 0,
				totalTipOut: 0,
				tipsReceived: 0,
				tipsPayroll: 0,
			};

			// Calculate weekly totals by adding daily sales from Sunday to Saturday
			for (const dailySale of member.dailyTotals) {
				const dayOfWeek = new Date(dailySale.date).getDay();
				if (dayOfWeek >= 0 && dayOfWeek <= 5) {
					// Add sales to weekly totals for weekdays (Sunday to Saturday)
					weeklyTotals.foodSales += dailySale.foodSales || 0;
					weeklyTotals.barSales += dailySale.barSales || 0;
					weeklyTotals.nonCashTips += dailySale.nonCashTips || 0;
					weeklyTotals.cashTips += dailySale.cashTips || 0;
				}
				// Add sales to daily totals
				totalSales.foodSales += dailySale.foodSales || 0;
				totalSales.barSales += dailySale.barSales || 0;
				totalSales.nonCashTips += dailySale.nonCashTips || 0;
				totalSales.cashTips += dailySale.cashTips || 0;
			}

			// Update weekly totals for the team member
			member.weeklyTotals = weeklyTotals;
			await member.save();
		}

		res.json({ teamMembers, totalSales });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
