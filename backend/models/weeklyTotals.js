const mongoose = require('mongoose');

const weeklyTotalsSchema = new mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
    teamMember: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TeamMember',
        required: true,
    },
    position: String,
	startDate: Date,
	endDate: Date,
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

const WeeklyTotals = mongoose.model('WeeklyTotals', weeklyTotalsSchema);

module.exports = WeeklyTotals;