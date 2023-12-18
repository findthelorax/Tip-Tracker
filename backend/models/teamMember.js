const mongoose = require('mongoose');

const DailyTotalSchema = new mongoose.Schema({
    date: Date,
    foodSales: Number,
    barSales: Number,
    nonCashTips: Number,
    cashTips: Number,
    barTipOuts: Number,
    runnerTipOuts: Number,
    hostTipOuts: Number,
    totalTipOut: Number,
    tipsReceived: Number,
    totalPayrollTips: Number,
}, { _id: false }); // Prevent creation of id for subdocument

const TeamMemberSchema = new mongoose.Schema({
    teamMemberName: String,
    position: String,
    dailyTotals: [DailyTotalSchema],
});

// Add pre save middleware to capitalize name
TeamMemberSchema.pre('save', function (next) {
    if (this.teamMemberName && this.isModified('teamMemberName')) {
        this.teamMemberName = this.teamMemberName.charAt(0).toUpperCase() + this.teamMemberName.slice(1);
    }
    next();
});

const TeamMember = mongoose.model('TeamMember', TeamMemberSchema, 'teamMembers');

module.exports = TeamMember;