const TeamMember = require('../models/teamMember');
const { User, Team } = require('../models/database');

function validateDailyTotal(dailyTotal) {
	return (
		dailyTotal.date && dailyTotal.foodSales && dailyTotal.barSales && dailyTotal.nonCashTips && dailyTotal.cashTips
	);
}

exports.getTeamMembers = async (req, res) => {
    try {
        const teamMembers = await Team.find().lean();
        res.json(teamMembers);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.createTeamMember = async (req, res) => {
    const { teamMemberName, position } = req.body;

    if (!teamMemberName || !position) {
        return res
            .status(400)
            .json({ error: "Both name and position are required" });
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
        return res.status(400).json({ error: "Both name and position are required" });
    }

    try {
        const updatedMember = await TeamMember.findByIdAndUpdate(
            req.params.id,
            { teamMemberName, position },
            { new: true } // This option returns the updated document
        );

        if (!updatedMember) {
            return res.status(404).json({ error: "Team member not found" });
        }

        res.json(updatedMember);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteTeamMember = async (req, res) => {
	const memberId = req.params.id;
	const teamMember = await Team.findById(memberId); // Check if the team member exists
	if (!teamMember) {
		return res.status(404).json({
			success: false,
			message: 'Team member not found',
		});
	}
	await Team.findOneAndDelete({ _id: memberId });
	res.json({
		success: true,
		message: 'Team member deleted successfully',
	});
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
exports.getWeeklyTotals = async (req, res) => {
	try {
		const { id } = req.params;
		const teamMember = await Team.findById(id).select('weeklyTotals').lean();

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
		const weeklyTotalsData = req.body;

		await Team.updateOne({ _id: memberId }, { $push: { weeklyTotals: weeklyTotalsData } });

		const teamMember = await Team.findById(memberId);
		res.json(teamMember.weeklyTotals);
	} catch (error) {
		console.error('Error adding weekly totals:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

// Delete a specific team member's weekly totals
exports.deleteWeeklyTotals = async (req, res) => {
	try {
		const memberId = req.params.id;
		const teamMember = await Team.findById(memberId);
		teamMember.weeklyTotals = [];
		await teamMember.save();
		res.json({
			message: `Weekly totals for team member ${memberId} deleted`,
		});
	} catch (error) {
		console.error(`Error deleting weekly totals for team member ${memberId}:`, error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

exports.getWeeklyTotalsAll = async (req, res) => {
	try {
		// Fetch all team members
		const teamMembers = await Team.find().lean();

		// Create an array to store results for all team members
		const allWeeklyTotals = [];

		// Get the start and end dates of the current week
		const currentDate = new Date();
		const firstDayOfWeek = currentDate.getDate() - currentDate.getDay(); // Sunday
		const lastDayOfWeek = firstDayOfWeek + 6; // Saturday

		const startOfWeek = new Date(currentDate.setDate(firstDayOfWeek));
		startOfWeek.setHours(0, 0, 0, 0); // set time to 00:00:00.000

		const endOfWeek = new Date(currentDate.setDate(lastDayOfWeek));
		endOfWeek.setHours(23, 59, 59, 999); // set time to 23:59:59.999

		// Iterate through each team member
		for (const teamMember of teamMembers) {
			// Fetch weekly totals for the current team member
			const weeklyTotals = teamMember.dailyTotals.filter((total) => {
				const date = new Date(total.date);
				return date >= startOfWeek && date <= endOfWeek;
			});

			// Calculate the weekly total
			const weeklyTotal = weeklyTotals.reduce((total, dailyTotal) => {
				return {
					date: endOfWeek, // set the date to the end of the week
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

			// Create an object with team member details and their weekly total
			const teamMemberData = {
				teamMemberName: teamMember.teamMemberName,
				weeklyTotal: weeklyTotal,
			};
			// Push the team member data to the array
			allWeeklyTotals.push(teamMemberData);
		}

		// Send the array of daily totals for all team members in the response
		res.json(allWeeklyTotals);
	} catch (error) {
		console.error('Error fetching weekly totals for all team members:', error);
		res.status(500).json({ success: false, message: 'Failed to fetch weekly totals for all team members' });
	}
};