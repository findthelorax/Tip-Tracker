const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	position: {
		type: String,
		required: true,
	},
    dailyTotals: {
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
		},
	weeklyTotals: {
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
	},
});

const TeamMember = mongoose.model('TeamMember', teamMemberSchema);

module.exports = TeamMember;
