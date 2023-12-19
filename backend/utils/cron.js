const cron = require('node-cron');
const TeamMember = require('../models/teamMember'); // adjust the path to your teamMember module

cron.schedule('0 0 * * *', async () => {
    const teamMembers = await TeamMember.find();

    teamMembers.forEach(async (teamMember) => {
        teamMember.updateWeeklyTotals();
        await teamMember.save();
    });
});