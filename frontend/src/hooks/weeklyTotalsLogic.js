import moment from 'moment';

const titleToPropName = {
    'Bar Sales': 'barSales',
    'Food Sales': 'foodSales',
    'Non-Cash Tips': 'nonCashTips',
    'Cash Tips': 'cashTips',
    'Bar Tip Outs': 'barTipOuts',
    'Runner Tip Outs': 'runnerTipOuts',
    'Host Tip Outs': 'hostTipOuts',
    'Total Tip Out': 'totalTipOut',
    'Tips Received': 'tipsReceived',
    'Total Payroll Tips': 'totalPayrollTips',
};

const titles = Object.keys(titleToPropName);

const formatUSD = (value) => {
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });
    return formatter.format(value);
};

function calculateLastWeekBarSales(dailyTotals) {
    const lastWeekStart = moment().subtract(1, 'week').startOf('week');
    const lastWeekEnd = moment().subtract(1, 'week').endOf('week');

    return dailyTotals.reduce((total, dailyTotal) => {
        const totalDate = moment(dailyTotal.date);
        if (totalDate.isSameOrAfter(lastWeekStart) && totalDate.isSameOrBefore(lastWeekEnd)) {
            return total + (Number(dailyTotal.barSales) || 0);
        }
        return total;
    }, 0);
}

function calculateThisWeekBarSales(dailyTotals) {
    const thisWeekStart = moment().startOf('week');
    const thisWeekEnd = moment().endOf('week');

    return dailyTotals.reduce((total, dailyTotal) => {
        const totalDate = moment(dailyTotal.date);
        if (totalDate.isSameOrAfter(thisWeekStart) && totalDate.isSameOrBefore(thisWeekEnd)) {
            return total + (Number(dailyTotal.barSales) || 0);
        }
        return total;
    }, 0);
}

function calculateLastWeekFoodSales(dailyTotals) {
    const lastWeekStart = moment().subtract(1, 'week').startOf('week');
    const lastWeekEnd = moment().subtract(1, 'week').endOf('week');

    return dailyTotals.reduce((total, dailyTotal) => {
        const totalDate = moment(dailyTotal.date);
        if (totalDate.isSameOrAfter(lastWeekStart) && totalDate.isSameOrBefore(lastWeekEnd)) {
            return total + (Number(dailyTotal.foodSales) || 0);
        }
        return total;
    }, 0);
}

function calculateThisWeekFoodSales(dailyTotals) {
    const thisWeekStart = moment().startOf('week');
    const thisWeekEnd = moment().endOf('week');

    return dailyTotals.reduce((total, dailyTotal) => {
        const totalDate = moment(dailyTotal.date);
        if (totalDate.isSameOrAfter(thisWeekStart) && totalDate.isSameOrBefore(thisWeekEnd)) {
            return total + (Number(dailyTotal.foodSales) || 0);
        }
        return total;
    }, 0);
}

function calculateSalesDifferences(dailyTotals) {
    if (!dailyTotals || dailyTotals.length === 0) return {};
    // Calculate the difference, positive, and sx for bar sales
    const lastWeekBarSales = calculateLastWeekBarSales(dailyTotals);
    const thisWeekBarSales = calculateThisWeekBarSales(dailyTotals);
    const differenceBarSales = ((thisWeekBarSales - lastWeekBarSales) / lastWeekBarSales) * 100;
    const positiveBarSales = differenceBarSales >= 0;
    const sxBarSales = { bgcolor: positiveBarSales ? 'success.main' : 'error.main' };

    // Calculate the difference, positive, and sx for food sales
    const lastWeekFoodSales = calculateLastWeekFoodSales(dailyTotals);
    const thisWeekFoodSales = calculateThisWeekFoodSales(dailyTotals); 
    const differenceFoodSales = ((thisWeekFoodSales - lastWeekFoodSales) / lastWeekFoodSales) * 100;
    const positiveFoodSales = differenceFoodSales >= 0;
    const sxFoodSales = { bgcolor: positiveFoodSales ? 'success.main' : 'error.main' };

    return {
        barSales: {
            difference: differenceBarSales,
            positive: positiveBarSales,
            sx: sxBarSales
        },
        foodSales: {
            difference: differenceFoodSales,
            positive: positiveFoodSales,
            sx: sxFoodSales
        }
    };
}

export { titleToPropName, titles, formatUSD, calculateSalesDifferences };