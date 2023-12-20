const { Team } = require('../models/database');
const moment = require('moment-timezone');
require('dotenv').config();

function validateDailyTotal(dailyTotal) {
	return (
		dailyTotal.date && dailyTotal.foodSales && dailyTotal.barSales && dailyTotal.nonCashTips && dailyTotal.cashTips
	);
}

exports.getTeamMember = async (req, res) => {
	const memberId = req.params.id;
	if (!memberId) {
		return res.status(400).json({
			success: false,
			message: 'Member ID is required',
		});
	}
	try {
		const teamMember = await Team.findById(memberId);
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

	if (!teamMemberName || !position) {
		return res.status(400).json({ error: 'Both name and position are required' });
	}

	try {
		const updatedMember = await Team.findByIdAndUpdate(req.params.id, { teamMemberName, position }, { new: true });

		if (!updatedMember) {
			return res.status(404).json({ error: 'Team member not found' });
		}

		res.json(updatedMember);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

exports.deleteTeamMember = async (req, res) => {
	const memberId = req.params.id;
	const teamMember = await Team.findById(memberId);
	if (!teamMember) {
		return res.status(404).json({
			success: false,
			message: 'Team member not found',
		});
	}
	try {
		const deleted = await Team.findByIdAndDelete(memberId);
		if (!deleted) throw new Error('Deletion failed');
		res.json({ message: `Team member ${memberId} deleted` });
	} catch (error) {
		console.error(`Error deleting team member ${memberId}:`, error);
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

// Route to get daily totals for a specific team member
exports.getDailyTotals = async (req, res) => {
	try {
		const { id } = req.params;
		const teamMember = await Team.findById(id);

		if (!teamMember) {
			return res.status(404).json({ error: 'Team member not found' });
		}
		res.json(teamMember.dailyTotals);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: error.message });
	}
};

// Creat daily totals for a specific team member
exports.createDailyTotal = async (req, res) => {
	try {
		const memberId = req.params.id;
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
			_id: memberId,
			dailyTotals: { $elemMatch: { date: dailyTotal.date } },
		});

		if (existingEntry) {
			return res.status(400).json({
				success: false,
				message: 'A daily total for this date and team member already exists.',
			});
		}

		// Update the team member's daily totals
		await Team.updateOne({ _id: memberId }, { $push: { dailyTotals: dailyTotal } });

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
		const { id: teamMemberId, date } = req.params;
		const teamMember = await Team.findById(teamMemberId);

		if (!teamMember) {
			return res.status(404).json({ message: 'Team member not found' });
		}

		// Parse the date string from the client using moment and the timezone from .env
		const dateString = moment(date).local().format();

		teamMember.dailyTotals = teamMember.dailyTotals.filter(
			(dailyTotal) => moment(dailyTotal.date).local().format() !== dateString
		);

		try {
			await teamMember.save();
		} catch (saveError) {
			console.error('Error saving team member:', saveError);
			throw saveError;
		}

		res.status(200).json({
			success: true,
			message: 'Daily total deleted successfully',
		});
	} catch (error) {
		console.error('Error deleting daily total:', error);
		res.status(500).json({
			success: false,
			message: 'Internal Server Error',
		});
	}
};

// Route to get all weekly totals for a specific team member
exports.getOneTMWeeklyTotals = async (req, res) => {
	try {
		const { id } = req.params;
		const teamMember = await Team.findById(id).select('weeklyTotals');

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
		const teamMember = await Team.findById(req.params.id);

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
		const memberId = req.params.id;
		const week = req.params.week;
		const weeklyTotalsData = { ...req.body, week };

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
		const memberId = req.params.id;
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
        const teamMember = await Team.findById(req.params.id);

        if (!teamMember) {
            return res.status(404).json({ message: 'Team member not found' });
        }

        // Create a new date using moment and set it to the start of the week
		const weekStart = moment().local().startOf('week').toDate();

		const existingWeeklyTotal = teamMember.weeklyTotals.find(
			(total) => moment(total.week).local().isSame(weekStart, 'day')
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
		const weekStart = moment(req.params.week).local().startOf('day').toDate();
		
        // Check for existing weekly total for the same week
        const existingWeeklyTotal = await Team.findOne({ _id: req.params.id, 'weeklyTotals.week': weekStart });
        if (existingWeeklyTotal) {
            return res.status(400).json({ message: 'Weekly total for this week already exists' });
        }

        const result = await Team.updateOne(
            { _id: req.params.id, 'weeklyTotals.week': weekStart },
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