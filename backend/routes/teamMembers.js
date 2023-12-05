const express = require("express");
const router = express.Router();
const TeamMember = require("../models/teamMember");
const DailyTotals = require("../models/dailyTotals");

// Route to add a new team member
router.post("/add", async (req, res) => {
    try {
        const newTeamMember = new TeamMember(req.body);
        await newTeamMember.save();
        res.status(201).json(newTeamMember);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



router.post("/:id/dailyTotals", async (req, res) => {
    try {
        const memberId = req.params.id;
        const dailyTotalsData = req.body;

        // Find the team member by ID
        const teamMember = await TeamMember.findById(memberId);

        // Add daily totals to the team member
        teamMember.dailyTotals.push(dailyTotalsData);

        // Save the updated team member
        await teamMember.save();

        const newDailyTotals = new DailyTotals({
            teamMember: teamMember._id,
            ...dailyTotalsData,
        });

        await newDailyTotals.save();

        res.json(newDailyTotals);

        res.json(teamMember);
    } catch (error) {
        console.error("Error adding daily totals:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


router.post("/:id/weeklyTotals", async (req, res) => {
    try {
        const memberId = req.params.id;
        const weeklyTotalsData = req.body;

        // Find the team member by ID
        const teamMember = await TeamMember.findById(memberId);

        // Update the weekly totals for the team member
        teamMember.weeklyTotals = weeklyTotalsData;

        // Save the updated team member
        await teamMember.save();

        res.json(teamMember);
    } catch (error) {
        console.error("Error adding weekly totals:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// // Add the following new route for fetching daily totals for all workers
// router.get("/dailyTotalsAll", async (req, res) => {
//     try {
//         // Fetch daily totals for all workers
//         const allDailyTotals = await TeamMember.find({}, "dailyTotals");

//         // Flatten the array and return
//         const flattenedDailyTotals = allDailyTotals.flatMap(
//             (member) => member.dailyTotals
//         );

//         res.json(flattenedDailyTotals);
//     } catch (error) {
//         console.error("Error fetching daily totals for all workers:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// });

router.get('/dailyTotalsAll', async (req, res) => {
    try {
        // Fetch all team members
        const teamMembers = await TeamMember.find();

        // Create an array to store results for all team members
        const allDailyTotals = [];

        // Iterate through each team member
        for (const teamMember of teamMembers) {
            // Fetch daily totals for the current team member
            const dailyTotals = await DailyTotals.find({ teamMember: teamMember._id });

            // Create an object with team member details and their daily totals
            const teamMemberData = {
                worker: teamMember.name,
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

module.exports = router;