const express = require("express");
const router = express.Router();
const TeamMember = require("../models/teamMember");
// const DailyTotals = require("../models/dailyTotals");

router.get("/", async (req, res) => {
    try {
        const teamMembers = await TeamMember.find();
        res.json(teamMembers);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post("/", async (req, res) => {
    const { name, position } = req.body;

    if (!name || !position) {
        return res
            .status(400)
            .json({ error: "Both name and position are required" });
    }

    const teamMember = new TeamMember({ name, position });
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
            "name"
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
        const dailyTotals = req.body.dailyTotals;

        if (!Array.isArray(dailyTotals)) {
            return res.status(400).json({
                success: false,
                message: "dailyTotals must be an array.",
            });
        }

        // Validate each entry in dailyTotals
        for (const entry of dailyTotals) {
            if (
                !entry.date ||
                !entry.foodSales ||
                !entry.barSales ||
                !entry.nonCashTips ||
                !entry.cashTips
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Each dailyTotals entry must have all required fields.",
                });
            }

            // Check if a daily total for the same date and teamMember already exists
            const existingEntry = await TeamMember.findOne({
                _id: memberId,
                "dailyTotals.date": entry.date,
            });
            if (existingEntry) {
                return res.status(400).json({
                    success: false,
                    message:
                        "A daily total for this date and team member already exists.",
                });
            }
        }

        // Find the team member by ID
        const teamMember = await TeamMember.findById(memberId);

        if (!teamMember) {
            return res.status(404).json({
                success: false,
                message: "Team member not found",
            });
        }

        teamMember.dailyTotals.push(...dailyTotals);

        // Save the updated team member
        await teamMember.save();

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

// Add a new API endpoint for deleting a specific daily total
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

// Route to get weekly totals for a specific team member
router.get("/:id/weeklyTotals", async (req, res) => {
    try {
        const { id } = req.params;
        const teamMember = await TeamMember.findById(id).populate(
            "weeklyTotals"
        );
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

        const teamMember = await TeamMember.findById(memberId);

        const newWeeklyTotals = new WeeklyTotals({
            teamMember: teamMember._id,
            ...weeklyTotalsData,
        });

        await newWeeklyTotals.save();

        res.json(newWeeklyTotals);
    } catch (error) {
        console.error("Error adding weekly totals:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Delete a specific team member's weekly totals
router.delete("/:id/weeklyTotals", async (req, res) => {
    try {
        const memberId = req.params.id;
        await WeeklyTotals.deleteMany({ teamMember: memberId });
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

module.exports = router;