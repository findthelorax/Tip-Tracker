const mongoose = require('mongoose');
const WeeklyTotals = require('./weeklyTotals'); // import the DailyTotal model


const teamMemberSchema = new mongoose.Schema({
    name: String,
    position: String,
	dailyTotals: [{ 	
	teamMember: String,
	position: String,
	date: String,
	foodSales: Number,
	barSales: Number,
	nonCashTips: Number,
	cashTips: Number,
	barTipOuts: Number,
	runnerTipOuts: Number,
	hostTipOuts: Number,
	totalTipOut: Number,
	tipsReceived: Number,
	tipsPayroll: Number, }],
	weeklyTotals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'WeeklyTotals' }],
});

teamMemberSchema.methods.addDailyTotal = function (dailyTotalData) {
    this.dailyTotals.push({
        ...dailyTotalData,
        teamMember: this.name,
        position: this.position,
    });
};

// Add pre save middleware to capitalize name
teamMemberSchema.pre('save', function (next) {
    if (this.name && this.isModified('name')) {
        this.name = this.name.charAt(0).toUpperCase() + this.name.slice(1);
    }
    next();
});

const TeamMember = mongoose.model('TeamMember', teamMemberSchema);

module.exports = TeamMember;