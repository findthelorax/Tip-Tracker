const mongoose = require('mongoose');

const weeklyTotalsSchema = new mongoose.Schema({
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
	totalPayrollTips: Number,
});

const WeeklyTotals = mongoose.model('WeeklyTotals', weeklyTotalsSchema);

module.exports = WeeklyTotals;