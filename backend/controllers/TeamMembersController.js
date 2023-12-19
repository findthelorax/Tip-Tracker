const { Team } = require('../models/database');

function validateDailyTotal(dailyTotal) {
	return (
		dailyTotal.date && dailyTotal.foodSales && dailyTotal.barSales && dailyTotal.nonCashTips && dailyTotal.cashTips
	);
}

exports.getTeamMembers = async (req, res) => {
	try {
		const teamMembers = await Team.find();
		res.json(teamMembers);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: 'Server error' });
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

// Server route for handling daily totals submission for a specific team member
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

// Server route for handling daily totals deletion for a specific team member
exports.deleteDailyTotal = async (req, res) => {
	try {
		const { id: teamMemberId, date } = req.params;
		const teamMember = await Team.findById(teamMemberId);

		if (!teamMember) {
			return res.status(404).json({ message: 'Team member not found' });
		}

		const dateString = new Date(date).toISOString();
		teamMember.dailyTotals = teamMember.dailyTotals.filter(
			(dailyTotal) => new Date(dailyTotal.date).toISOString() !== dateString
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

// Route to get weekly totals for a specific team member
exports.getAllWeeklyTotals = async (req, res) => {
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

exports.getWeeklyTotals = async (req, res) => {
	try {
		const memberId = req.params.id;
		const teamMember = await Team.findById(memberId);
		if (!teamMember) {
			return res.status(404).json({ error: 'Team member not found' });
		}
		res.json(teamMember.weeklyTotals);
	} catch (error) {
		console.error('Error getting weekly totals:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

// Delete a specific team member's weekly totals
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

exports.updateWeeklyTotalsAndSaveTeamMemberOnServer = async (req, res) => {
	const teamMember = await TeamMember.findById(req.params.id);

	if (!teamMember) {
		return res.status(404).send('Team member not found');
	}

	teamMember.updateWeeklyTotals();
	await teamMember.save();

	res.send(teamMember);
};

exports.updateWeeklyTotals = async (req, res) => {
	try {
		const memberId = req.params.id;
		const week = req.params.week;
		const teamMember = await Team.findById(memberId);

		if (!teamMember) {
			return res.status(404).json({ error: 'Team member not found' });
		}

		// Fetch weekly totals for the specified week
		const weeklyTotals = teamMember.dailyTotals.filter((total) => total.week === week);

		// Calculate the weekly total
		const weeklyTotal = weeklyTotals.reduce((total, dailyTotal) => {
			return {
				week: total.week, // set the date to the end of the week
				foodSales: (total.foodSales || 0) + dailyTotal.foodSales,
				barSales: (total.barSales || 0) + dailyTotal.barSales,
				nonCashTips: (total.nonCashTips || 0) + dailyTotal.nonCashTips,
				cashTips: (total.cashTips || 0) + dailyTotal.cashTips,
				barTipOuts: (total.barTipOuts || 0) + dailyTotal.barTipOuts,
				runnerTipOuts: (total.runnerTipOuts || 0) + dailyTotal.runnerTipOuts,
				hostTipOuts: (total.hostTipOuts || 0) + dailyTotal.hostTipOuts,
				totalTipOut: (total.totalTipOut || 0) + dailyTotal.totalTipOut,
				tipsReceived: (total.tipsReceived || 0) + dailyTotal.tipsReceived,
				totalPayrollTips: (total.totalPayrollTips || 0) + dailyTotal.totalPayrollTips,
			};
		}, {});

		// Update the team member's weekly totals
		teamMember.weeklyTotals.push(weeklyTotal);
		await teamMember.save();

		res.json(teamMember.weeklyTotals);
	} catch (error) {
		console.error('Error updating weekly totals:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};
