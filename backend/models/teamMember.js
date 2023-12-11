const mongoose = require('mongoose');

const dailyTotalSchema = new mongoose.Schema({
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
    tipsPayroll: Number,
}, { _id: false }); // Prevent creation of id for subdocument

const weeklyTotalSchema = new mongoose.Schema({
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
    tipsPayroll: Number,
}, { _id: false }); // Prevent creation of id for subdocument

const teamMemberSchema = new mongoose.Schema({
    teamMemberName: String,
    position: String,
    dailyTotals: [dailyTotalSchema],
    weeklyTotals: [weeklyTotalSchema],
});

// Add pre save middleware to capitalize name
teamMemberSchema.pre('save', function (next) {
    if (this.teamMemberName && this.isModified('teamMemberName')) {
        this.teamMemberName = this.teamMemberName.charAt(0).toUpperCase() + this.teamMemberName.slice(1);
    }
    next();
});

const TeamMember = mongoose.model('TeamMember', teamMemberSchema);

module.exports = TeamMember;