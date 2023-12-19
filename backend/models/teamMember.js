const mongoose = require('mongoose');

const DailyTotalSchema = new mongoose.Schema(
	{
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
	},
	{ _id: false }
); // Prevent creation of id for subdocument

const WeeklyTotalSchema = new mongoose.Schema(
	{
		week: Date,
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
	},
	{ _id: false }
);

const TeamMemberSchema = new mongoose.Schema({
	teamMemberName: String,
	position: String,
	dailyTotals: [DailyTotalSchema],
	weeklyTotals: [WeeklyTotalSchema],
});

// Add pre save middleware to capitalize name
TeamMemberSchema.pre('save', function (next) {
	if (this.teamMemberName && this.isModified('teamMemberName')) {
		this.teamMemberName = this.teamMemberName.charAt(0).toUpperCase() + this.teamMemberName.slice(1);
	}
	next();
});

// Method to update weekly totals
TeamMemberSchema.methods.updateWeeklyTotals = function () {
	const weekStart = new Date();
	weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // Sunday

	const weeklyTotal = this.dailyTotals
		.filter((total) => total.date >= weekStart)
		.reduce(
			(acc, curr) => ({
				week: weekStart,
				foodSales: acc.foodSales + curr.foodSales,
				barSales: acc.barSales + curr.barSales,
				nonCashTips: acc.nonCashTips + curr.nonCashTips,
				cashTips: acc.cashTips + curr.cashTips,
				barTipOuts: acc.barTipOuts + curr.barTipOuts,
				runnerTipOuts: acc.runnerTipOuts + curr.runnerTipOuts,
				hostTipOuts: acc.hostTipOuts + curr.hostTipOuts,
				totalTipOut: acc.totalTipOut + curr.totalTipOut,
				tipsReceived: acc.tipsReceived + curr.tipsReceived,
				totalPayrollTips: acc.totalPayrollTips + curr.totalPayrollTips,
			}),
			{
				week: weekStart,
				foodSales: 0,
				barSales: 0,
				nonCashTips: 0,
				cashTips: 0,
				barTipOuts: 0,
				runnerTipOuts: 0,
				hostTipOuts: 0,
				totalTipOut: 0,
				tipsReceived: 0,
				totalPayrollTips: 0,
			}
		);

	this.weeklyTotals.push(weeklyTotal);
};

const TeamMember = mongoose.model('TeamMember', TeamMemberSchema, 'teamMembers');

module.exports = TeamMember;