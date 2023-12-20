export const prepareDailyTotals = (dailyTotals) => {
    const totalTipOut =
        Number(dailyTotals.barTipOuts) + Number(dailyTotals.runnerTipOuts) + Number(dailyTotals.hostTipOuts);
    const tipsReceived = Number(dailyTotals.nonCashTips) + Number(dailyTotals.cashTips);
    const totalPayrollTips = tipsReceived - totalTipOut;

    return {
        ...dailyTotals,
        totalTipOut,
        tipsReceived,
        totalPayrollTips,
    };
};