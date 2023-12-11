const express = require("express");
const router = express.Router();
const TeamMember = require("../models/teamMember");

function validateDailyTotal(dailyTotal) {
    return (
        dailyTotal.date &&
        dailyTotal.foodSales &&
        dailyTotal.barSales &&
        dailyTotal.nonCashTips &&
        dailyTotal.cashTips
    );
}

router.get("/", async (req, res) => {
    try {
        const teamMembers = await TeamMember.find().lean();
        res.json(teamMembers);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post("/", async (req, res) => {
    const { teamMemberName, position } = req.body;

    if (!teamMemberName || !position) {
        return res
            .status(400)
            .json({ error: "Both name and position are required" });
    }

    const teamMember = new TeamMember({ teamMemberName, position });
    await teamMember.save();

    res.json(teamMember);
});

router.delete("/:id", async (req, res) => {
    const memberId = req.params.id;
    const teamMember = await TeamMember.findById(memberId); // Check if the team member exists
    if (!teamMember) {
        return res.status(404).json({
            success: false,
            message: "Team member not found",
        });
    }
    await TeamMember.findOneAndDelete({ _id: memberId });
    res.json({
        success: true,
        message: "Team member deleted successfully",
    });
});

// Route to get daily totals for a specific team member
router.get("/:id/dailyTotals", async (req, res) => {
    try {
        const { id } = req.params;
        const teamMember = await TeamMember.findById(id).populate(
            "teamMemberName"
        );
        if (!teamMember) {
            return res.status(404).json({ error: "Team member not found" });
        }
        res.json(teamMember.dailyTotals);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// Server route for handling daily totals submission for a specific team member
router.post(`/:id/dailyTotals`, async (req, res) => {
    try {
        const memberId = req.params.id;
        const dailyTotal = req.body;

        // Validate dailyTotal
        if (!validateDailyTotal(dailyTotal)) {
            return res.status(400).json({
                success: false,
                message: "dailyTotal must have all required fields.",
            });
        }

        // Check if a daily total for the same date and teamMember already exists
        const existingEntry = await TeamMember.findOne({
            _id: memberId,
            dailyTotals: { $elemMatch: { date: dailyTotal.date } },
        });

        if (existingEntry) {
            return res.status(400).json({
                success: false,
                message: "A daily total for this date and team member already exists.",
            });
        }

        // Update the team member's daily totals
        await TeamMember.updateOne(
            { _id: memberId },
            { $push: { dailyTotals: dailyTotal } }
        );

        res.status(200).json({
            success: true,
            message: "Daily totals submitted successfully",
        });
    } catch (error) {
        console.error("Error processing dailyTotals request:", error);
        res.status(500).json({
            success: false,
            message: "Failed to submit daily totals",
        });
    }
});

// Endpoint for deleting a specific daily total
router.delete("/:id/dailyTotals/:dailyTotalId", async (req, res) => {
    const memberId = req.params.id;
    const dailyTotalId = req.params.dailyTotalId;

    // Find the team member by ID
    try {
        const result = await TeamMember.updateOne(
            { _id: memberId },
            { $pull: { dailyTotals: { _id: dailyTotalId } } }
        );
    
        if (result.nModified === 0) {
            return res.status(404).json({
                success: false,
                message: "Daily total not found",
            });
        }
    
        res.status(200).json({
            success: true,
            message: "Daily total deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting daily total:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});

router.get('/dailyTotalsAll', async (req, res) => {
    try {
        // Fetch all team members
        const teamMembers = await TeamMember.find().lean();

        // Create an array to store results for all team members
        const allDailyTotals = [];

        // Iterate through each team member
        for (const teamMember of teamMembers) {

            // Fetch dailyTotals is a subdocument in the TeamMember document, so you should fetch it from there
            const dailyTotals = teamMember.dailyTotals;

            // Create an object with team member details and their daily totals
            const teamMemberData = {
                teamMemberName: teamMember.teamMemberName,
                position: teamMember.position,
                dailyTotals: dailyTotals.map(total => ({
                    date: total.date,
                    barSales: total.barSales,
                    foodSales: total.foodSales,
                    nonCashTips: total.nonCashTips,
                    cashTips: total.cashTips,
                    barTipOut: total.barTipOut,
                    runnerTipOut: total.runnerTipOut,
                    hostTipOut: total.hostTipOut,
                    totalTipOut: total.totalTipOut,
                    tipsReceived: total.tipsReceived,
                })),
            };

            // Push the team member data to the array
            allDailyTotals.push(teamMemberData);
        }

        // Send the array of daily totals for all team members in the response
        res.json(allDailyTotals);
    } catch (error) {
        console.error('Error fetching daily totals for all team members:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch daily totals for all team members' });
    }
});

// Route to get weekly totals for a specific team member
router.get("/:id/weeklyTotals", async (req, res) => {
    try {
        const { id } = req.params;
        const teamMember = await TeamMember.findById(id)
            .select("weeklyTotals")
            .lean();

        if (!teamMember) {
            return res.status(404).json({ error: "Team member not found" });
        }
        res.json(teamMember.weeklyTotals);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

router.post("/:id/weeklyTotals", async (req, res) => {
    try {
        const memberId = req.params.id;
        const weeklyTotalsData = req.body;

        await TeamMember.updateOne(
            { _id: memberId },
            { $push: { weeklyTotals: weeklyTotalsData } }
        );

        const teamMember = await TeamMember.findById(memberId);
        res.json(teamMember.weeklyTotals);
    } catch (error) {
        console.error("Error adding weekly totals:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Delete a specific team member's weekly totals
router.delete("/:id/weeklyTotals", async (req, res) => {
    try {
        const memberId = req.params.id;
        const teamMember = await TeamMember.findById(memberId);
        teamMember.weeklyTotals = [];
        await teamMember.save();
        res.json({
            message: `Weekly totals for team member ${memberId} deleted`,
        });
    } catch (error) {
        console.error(
            `Error deleting weekly totals for team member ${memberId}:`,
            error
        );
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get('/weeklyTotalsAll', async (req, res) => {
    try {
        // Fetch all team members
        const teamMembers = await TeamMember.find().lean();

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
            const weeklyTotals = teamMember.dailyTotals.filter(total => {
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
                    tipsPayroll: (total.tipsPayroll || 0) + dailyTotal.tipsPayroll,
                };
            }, {});

            // Create an object with team member details and their weekly total
            const teamMemberData = {
                teamMemberName: teamMember.teamMemberName,
                weeklyTotal: weeklyTotal
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
});

module.exports = router;