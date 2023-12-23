const { Team } = require('../models/database');
const moment = require('moment');
require('dotenv').config();

function validateDailyTotal(dailyTotal) {
	dailyTotal.date = moment.utc(dailyTotal.date).hours(12).toDate();
	return (
		dailyTotal.date && dailyTotal.foodSales && dailyTotal.barSales && dailyTotal.nonCashTips && dailyTotal.cashTips
	);
}

exports.getTeamMember = async (req, res) => {
	const teamMemberId = req.params.teamMemberId;
	if (!teamMemberId) {
		return res.status(400).json({
			success: false,
			message: 'Team member ID is required',
		});
	}
	try {
		const teamMember = await Team.findById(teamMemberId);
		if (!teamMember) {
			return res.status(404).json({
				success: false,
				message: 'Team member not found',
			});
		}
		return res.status(200).json({
			success: true,
			data: teamMember,
		});
	} catch (err) {
		console.log(err);
		return res.status(400).json({
			success: false,
			error: err,
		});
	}
};

exports.createTeamMember = async (req, res) => {
	const { teamMemberName, position } = req.body;

	if (!teamMemberName || !position) {
		return res.status(400).json({ error: 'Both name and position are required' });
	}

	const newMember = new Team({ teamMemberName, position });

	try {
		const savedMember = await newMember.save();
		res.status(201).json(savedMember);
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
};

exports.updateTeamMember = async (req, res) => {
	const { teamMemberName, position } = req.body;
	const teamMemberId = req.params.teamMemberId;

	if (!teamMemberName || !position) {
		return res.status(400).json({ error: 'Both name and position are required' });
	}

	try {
		const updatedMember = await Team.findByIdAndUpdate(teamMemberId, { teamMemberName, position }, { new: true });

		if (!updatedMember) {
			return res.status(404).json({ error: 'Team member not found' });
		}

		res.json(updatedMember);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

exports.deleteTeamMember = async (req, res) => {
	const teamMemberId = req.params.teamMemberId;
	const teamMember = await Team.findById(teamMemberId);
	if (!teamMember) {
		return res.status(404).json({
			success: false,
			message: 'Team member not found',
		});
	}
	try {
		const deleted = await Team.findByIdAndDelete(teamMemberId);
		if (!deleted) throw new Error('Deletion failed');
		res.json({ message: `Team member ${teamMember.teamMemberName} (${teamMember.position}) was deleted` });
	} catch (error) {
		console.error(`Error deleting team member ${teamMemberId}:`, error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

// Get All Team Members
exports.getTeamMembers = async (req, res) => {
	try {
		const teamMembers = await Team.find();
		res.json(teamMembers);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: 'Server error' });
	}
};

// Get All Daily Totals
exports.getAllDailyTotals = async (req, res, next) => {
    try {
        const teamMembers = await Team.find({});
        const dailyTotalsAll = teamMembers.flatMap(teamMember => teamMember.dailyTotals);
        res.json(dailyTotalsAll);
    } catch (error) {
        console.error(`Error getting daily totals: ${error.message}`);
        next(error);
    }
};

// Get All Weekly Totals
exports.getAllWeeklyTotals = async (req, res, next) => {
    try {
        const teamMembers = await Team.find({});
        const weeklyTotalsAll = teamMembers.flatMap(teamMember => teamMember.weeklyTotals);
        res.json(weeklyTotalsAll);
    } catch (error) {
        console.error(`Error getting weekly totals: ${error.message}`);
        next(error);
    }
};

// Route to get daily totals for a specific team member
exports.getDailyTotals = async (req, res) => {
	try {
		const { teamMemberId } = req.params;
		const teamMember = await Team.findById(teamMemberId);

		if (!teamMember) {
			return res.status(404).json({ error: 'Team member not found' });
		}
		res.json(teamMember.dailyTotals);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: error.message });
	}
};

// Create daily totals for a specific team member
exports.createDailyTotal = async (req, res) => {
	try {
		const { teamMemberId } = req.params;
		const dailyTotal = req.body;

		// Validate dailyTotal
		if (!validateDailyTotal(dailyTotal)) {
			return res.status(400).json({
				success: false,
				message: 'dailyTotal must have all required fields.',
			});
		}

		// Check if a daily total for the same date and teamMember already exists
		const existingEntry = await Team.findOne({
			_id: teamMemberId,
			dailyTotals: { $elemMatch: { date: dailyTotal.date } },
		});

		if (existingEntry) {
			return res.status(400).json({
				success: false,
				message: 'A daily total for this date and team member already exists.',
			});
		}

		// Find the team member
		const teamMember = await Team.findById(teamMemberId);

		// Update the team member's daily totals
		teamMember.addDailyTotal(dailyTotal);
		teamMember.updateWeeklyTotals();

		// Mark the dailyTotals field as modified
		teamMember.markModified('dailyTotals');

		// Save the team member
		await teamMember.save();

		res.status(200).json({
			success: true,
			message: 'Daily totals submitted successfully',
		});
	} catch (error) {
		console.error('Error processing dailyTotals request:', error);
		res.status(500).json({
			success: false,
			message: 'Failed to submit daily totals',
		});
	}
};

// Delete daily totals for a specific team member
exports.deleteDailyTotal = async (req, res) => {
	try {
		const { teamMemberId, dailyTotalId } = req.params;
		console.log(`teamMemberId: ${teamMemberId}, dailyTotalId: ${dailyTotalId}`);

		const teamMember = await Team.findById(teamMemberId);
		console.log('teamMember:', teamMember);
		if (!teamMember) {
			return res.status(404).send({ message: 'Team member not found' });
		}

		const dailyTotalIndex = teamMember.dailyTotals.findIndex(
			(dailyTotal) => dailyTotal._id.toString() === dailyTotalId
		);
		if (dailyTotalIndex === -1) {
			return res.status(404).send({ message: 'Daily total not found' });
		}

		teamMember.dailyTotals.splice(dailyTotalIndex, 1);
		teamMember.updateWeeklyTotals();
		teamMember.markModified('dailyTotals');

		try {
			await teamMember.save();
			res.send({ message: 'Daily total deleted successfully' });
		} catch (err) {
			console.error('Error deleting daily total:', error);
			next(error);
		}
	} catch (error) {
		console.error('Error deleting daily total:', error);
		res.status(500).json({ message: 'Internal Server Error' });
	}
};

// Update daily totals for a specific team member
exports.updateDailyTotal = async (req, res) => {
	try {
		const { teamMemberId, dailyTotalId } = req.params;
		const updatedDailyTotal = req.body;

		// Validate updatedDailyTotal
		if (!validateDailyTotal(updatedDailyTotal)) {
			return res.status(400).json({
				success: false,
				message: 'updatedDailyTotal must have all required fields.',
			});
		}

		const teamMember = await Team.findById(teamMemberId);

		if (!teamMember) {
			return res.status(404).json({ message: 'Team member not found' });
		}

		// Find the daily total to update
		const dailyTotal = teamMember.dailyTotals.id(dailyTotalId);

		if (!dailyTotal) {
			return res.status(404).json({ message: 'Daily total not found' });
		}

		// Update the daily total
		dailyTotal.set(updatedDailyTotal);
		teamMember.updateWeeklyTotals();
		teamMember.markModified('dailyTotals');

		try {
			await teamMember.save();
		} catch (saveError) {
			console.error('Error saving team member:', saveError);
			throw saveError;
		}

		res.status(200).json({
			success: true,
			message: 'Daily total updated successfully',
		});
	} catch (error) {
		console.error('Error updating daily total:', error);
		res.status(500).json({
			success: false,
			message: 'Internal Server Error',
		});
	}
};

// Route to get all weekly totals for a specific team member
exports.getOneTMWeeklyTotals = async (req, res) => {
	try {
		const { teamMemberId } = req.params;
		const teamMember = await Team.findById(teamMemberId).select('weeklyTotals');

		if (!teamMember) {
			return res.status(404).json({ error: 'Team member not found' });
		}
		res.json(teamMember.weeklyTotals);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: error.message });
	}
};

// Route to get a specific team member's weekly totals for a specific week
exports.getOneWeeklyTotals = async (req, res) => {
	try {
		const teamMember = await Team.findById(req.params.teamMemberId);

		if (!teamMember) {
			return res.status(404).json({ message: 'Team member not found' });
		}

		// Parse the week parameter into a Date object
		const weekStart = moment(req.params.week);

		const weeklyTotal = teamMember.getWeeklyTotals(weekStart);

		if (!weeklyTotal) {
			return res.status(404).json({ message: 'Weekly total not found' });
		}

		res.status(200).json(weeklyTotal);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Route to create a specific team member's weekly totals for a specific week
exports.createWeeklyTotals = async (req, res) => {
	try {
		const memberId = req.params.teamMemberId;
		const week = req.params.week;
		const weeklyTotalsData = { ...req.body, week };
		console.log("🚀 ~ file: TeamMembersController.js:335 ~ exports.createWeeklyTotals= ~ weeklyTotalsData:", weeklyTotalsData)

		await Team.updateOne({ _id: memberId }, { $push: { weeklyTotals: weeklyTotalsData } });

		const teamMember = await Team.findById(memberId);
		res.json(teamMember.weeklyTotals);
	} catch (error) {
		console.error('Error adding weekly totals:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

// Delete a specific team member's weekly totals for a specific week
exports.deleteWeeklyTotals = async (req, res) => {
	try {
		const memberId = req.params.teamMemberId;
		const week = req.params.week;
		const teamMember = await Team.findById(memberId);

		// Filter out the week to be deleted
		// teamMember.weeklyTotals = teamMember.weeklyTotals.filter(total => total.week !== week);
		teamMember.weeklyTotals = teamMember.weeklyTotals.filter((total) => total.week !== week.toString());
		await teamMember.save();
		res.json({
			message: `Weekly totals for the week ${week} for team member ${memberId} deleted`,
		});
	} catch (error) {
		console.error(`Error deleting weekly totals for team member ${memberId}:`, error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

exports.updateWeeklyTotalsPut = async (req, res) => {
	try {
		const teamMember = await Team.findById(req.params.teamMemberId);

		if (!teamMember) {
			return res.status(404).json({ message: 'Team member not found' });
		}

		// Create a new date using moment and set it to the start of the week
		const weekStartLocal = moment().local().startOf('week').toDate();
		console.log("🚀 ~ file: TeamMembersController.js:375 ~ exports.updateWeeklyTotalsPut= ~ weekStartLocal:", weekStartLocal)
		const weekStart = moment().startOf('week').toDate();
		console.log("🚀 ~ file: TeamMembersController.js:377 ~ exports.updateWeeklyTotalsPut= ~ weekStart:", weekStart)

		const existingWeeklyTotal = teamMember.weeklyTotals.find((total) =>
			moment(total.week).local().isSame(weekStart, 'day')
		);
		if (existingWeeklyTotal) {
			return res.status(400).json({ message: 'Weekly total for this week already exists' });
		}

		teamMember.updateWeeklyTotals();

		await teamMember.save();

		res.status(200).json(teamMember);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

exports.updateWeeklyTotalsPatch = async (req, res) => {
	try {
		// Parse the date string from the client using moment
		const weekStartLocal = moment(req.params.week).local().startOf('day').toDate();
		console.log("🚀 ~ file: TeamMembersController.js:400 ~ exports.updateWeeklyTotalsPatch= ~ weekStartLocal:", weekStartLocal)
		const weekStart = moment(req.params.week).startOf('day').toDate();
		console.log("🚀 ~ file: TeamMembersController.js:402 ~ exports.updateWeeklyTotalsPatch= ~ weekStart:", weekStart)

		// Check for existing weekly total for the same week
		const existingWeeklyTotal = await Team.findOne({
			_id: req.params.teamMemberId,
			'weeklyTotals.week': weekStart,
		});
		if (existingWeeklyTotal) {
			return res.status(400).json({ message: 'Weekly total for this week already exists' });
		}

		const result = await Team.updateOne(
			{ _id: req.params.teamMemberId, 'weeklyTotals.week': weekStart },
			{
				$set: {
					'weeklyTotals.$[elem].foodSales': req.body.foodSales,
					'weeklyTotals.$[elem].barSales': req.body.barSales,
					'weeklyTotals.$[elem].nonCashTips': req.body.nonCashTips,
					'weeklyTotals.$[elem].cashTips': req.body.cashTips,
					'weeklyTotals.$[elem].barTipOuts': req.body.barTipOuts,
					'weeklyTotals.$[elem].runnerTipOuts': req.body.runnerTipOuts,
					'weeklyTotals.$[elem].hostTipOuts': req.body.hostTipOuts,
					'weeklyTotals.$[elem].totalTipOut': req.body.totalTipOut,
					'weeklyTotals.$[elem].tipsReceived': req.body.tipsReceived,
					'weeklyTotals.$[elem].totalPayrollTips': req.body.totalPayrollTips,
				},
			},
			{
				arrayFilters: [{ 'elem.week': weekStart }],
			}
		);

		if (result.nModified === 0) {
			return res.status(404).json({ message: 'Weekly total not found' });
		}

		res.status(200).json({ message: 'Weekly total updated' });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
