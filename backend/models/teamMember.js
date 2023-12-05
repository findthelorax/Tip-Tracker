const mongoose = require("mongoose");

const weeklyTotalsSchema = new mongoose.Schema({
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    foodSales: { type: Number, required: true },
    barSales: { type: Number, required: true },
    totalSales: { type: Number, required: true },
    nonCashTips: { type: Number, required: true },
    cashTips: { type: Number, required: true },
	barTipOuts: { type: Number, required: false },
	runnerTipOuts: { type: Number, required: false },
	hostTipOuts: { type: Number, required: false },
	totalTipOut: { type: Number, required: false },
	tipsReceived: { type: Number, required: false },
	tipsPayroll: { type: Number, required: false },
});

const teamMemberSchema = new mongoose.Schema({
    name: String,
    position: String,
    dailyTotals: {
        type: [{
            teamMember: String,
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
        }],
        default: [],
    },
	weeklyTotals: {
        type: [{
            startDate: Date,
			endDate: Date,
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
        }],
        default: [],
    },
});

const TeamMember = mongoose.model("TeamMember", teamMemberSchema);

module.exports = TeamMember;
