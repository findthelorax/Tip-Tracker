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

// Add pre save middleware to update weekly totals
TeamMemberSchema.pre('save', function (next) {
    // `this` is the teamMember document about to be saved
    const teamMember = this;

    // Check if dailyTotals array has been modified
    if (teamMember.isModified('dailyTotals')) {
        // Update weekly totals
        teamMember.updateWeeklyTotals();
    }

    next();
});


// // Method to remove a daily total and update weekly totals
// TeamMemberSchema.methods.removeDailyTotal = function (dailyTotalId) {
//     // Remove the daily total
//     this.dailyTotals.id(dailyTotalId).remove();

//     // Update weekly totals
//     this.updateWeeklyTotals();
// };

// // Then, when you want to remove a daily total, you can do something like this:

// const teamMember = await TeamMember.findById(req.params.id);
// teamMember.removeDailyTotal(req.params.dailyTotalId);
// await teamMember.save();


// Method to update weekly totals
TeamMemberSchema.methods.updateWeeklyTotals = function () {
	const weekStart = new Date();
	weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // Sunday

	weekStart.setHours(0, 0, 0, 0);

	const existingWeeklyTotal = this.weeklyTotals.find((total) => total.week.getTime() === weekStart.getTime());
    if (existingWeeklyTotal) {
        throw new Error('A total for the current week already exists.');
    }
	function isSameDayOrAfter(date1, date2) {
		return (
			date1.getFullYear() >= date2.getFullYear() &&
			date1.getMonth() >= date2.getMonth() &&
			date1.getDate() >= date2.getDate()
		);
	}

	const weeklyTotal = this.dailyTotals
		.filter((total) => isSameDayOrAfter(total.date, weekStart))
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

	const existingWeeklyTotalIndex = this.weeklyTotals.findIndex(
		(total) => total.week.getTime() === weekStart.getTime()
	);

	if (existingWeeklyTotalIndex !== -1) {
		this.weeklyTotals[existingWeeklyTotalIndex] = weeklyTotal;
	} else {
		this.weeklyTotals.push(weeklyTotal);
	}
};

TeamMemberSchema.methods.getWeeklyTotals = function (weekStart) {
	const weekEnd = new Date(weekStart);
	weekEnd.setDate(weekEnd.getDate() + 6); // Saturday

	const weeklyTotal = this.weeklyTotals.find((total) => total.week >= weekStart && total.week <= weekEnd);

	return weeklyTotal;
};

const TeamMember = mongoose.model('TeamMember', TeamMemberSchema, 'teamMembers');

module.exports = TeamMember;
