// weeklyTotalsRoutes.js
const express = require('express');
const router = express.Router();
const TeamMember = require('../models/teamMember');
const DailyTotals = require('../models/dailyTotals');

router.post('/', async (req, res) => {
    try {
        const dailyTotalsData = req.body.dailyTotals;
        const newDailyTotal = new DailyTotals(dailyTotalsData);
        await newDailyTotal.save();
        res.status(201).json(newDailyTotal);
    } catch (error) {
        console.error('Error adding daily totals:', error);
        res.status(500).json({
            error: `Error adding daily totals: ${
                error.message || 'Internal Server Error'
            }`,
        });
    }
});

router.post('/:id', async (req, res) => {
	try {
		const memberId = req.params.id;
		const dailyTotalsData = req.body;
		
		// Find the team member by ID
		const teamMember = await TeamMember.findById(memberId);

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
			// member.dailyTotals.map((total) => ({
			// 	...total,
			// 	teamMember: total.teamMember,
			// 	position: total.position,
			// 	date: total.date,
			// 	foodSales: total.foodSales,
			// 	barSales: total.barSales,
			// 	nonCashTips: total.nonCashTips,
			// 	cashTips: total.cashTips,
			// }))
			member.dailyTotals.map((total) => {
				const totalObject = total.toObject();
				return {
					...totalObject,
					teamMember: totalObject.teamMember,
					position: totalObject.position,
					date: totalObject.date,
					foodSales: totalObject.foodSales,
					barSales: totalObject.barSales,
					nonCashTips: totalObject.nonCashTips,
					cashTips: totalObject.cashTips,
				};
			})
		);
			console.log('Flattened Daily Totals:', flattenedDailyTotals);
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