const mongoose = require('mongoose');

const dailyTotalsSchema = new mongoose.Schema({
	teamMember: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'TeamMember',
		required: true,
	},
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
	tipsPayroll: Number,
});

const DailyTotals = mongoose.model('DailyTotals', dailyTotalsSchema);

module.exports = DailyTotals;
