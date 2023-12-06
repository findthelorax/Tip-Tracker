// weeklyTotalsRoutes.js
const express = require('express');
const router = express.Router();
const TeamMember = require('../models/teamMember');
const DailyTotals = require('../models/dailyTotals');

router.post('/:id', async (req, res) => {
	try {
		const memberId = req.params.id;
		const dailyTotalsData = req.body;
		
		// Find the team member by ID
		// const teamMember = await TeamMember.findById(memberId);

		const teamMember = await TeamMember.find();
		console.log(teamMember);
		console.log(memberId);
		const newDailyTotals = new DailyTotals({
			teamMember: teamMember.name,
			position: teamMember.position,
			...dailyTotalsData,
		});

		await newDailyTotals.save();

		teamMember.dailyTotals.push(newDailyTotals);

		// Save the updated team member
		await teamMember.save();

		res.json(newDailyTotals);
	} catch (error) {
		console.error('Error adding daily totals:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

router.get('/all', async (req, res) => {
	try {
		// Fetch daily totals for all team member
		const allDailyTotals = await TeamMember.find({}, 'dailyTotals');

		// Flatten the array and return
		const flattenedDailyTotals = allDailyTotals.flatMap((member) =>
			member.dailyTotals.map((total) => ({
				...total,
				teamMember: total.teamMember,
				position: total.position,
				date: total.date,
				foodSales: total.foodSales
					? total.foodSales.toLocaleString('en-US', {
							style: 'currency',
							currency: 'USD',
					  })
					: 'N/A',
				barSales: total.barSales
					? total.barSales.toLocaleString('en-US', {
							style: 'currency',
							currency: 'USD',
					  })
					: 'N/A',
				nonCashTips: total.nonCashTips
					? total.nonCashTips.toLocaleString('en-US', {
							style: 'currency',
							currency: 'USD',
					  })
					: 'N/A',
				cashTips: total.cashTips
					? total.cashTips.toLocaleString('en-US', {
							style: 'currency',
							currency: 'USD',
					  })
					: 'N/A',
			}))
		);

		res.json(flattenedDailyTotals);
	} catch (error) {
		console.error('Error fetching daily totals:', error);
		res.status(500).json({
			error: `Error fetching daily totals: ${
				error.message || 'Internal Server Error'
			}`,
		});
	}
});

module.exports = router;
