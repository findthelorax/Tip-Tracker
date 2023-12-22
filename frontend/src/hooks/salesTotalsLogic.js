import moment from 'moment';
import { success, error } from '../theme/colors';

const titleToPropName = {
    'Food Sales': 'foodSales',
    'Bar Sales': 'barSales',
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

function calculateYesterdaySales(dailyTotals, salesType) {
    const yesterday = moment().subtract(1, 'day').startOf('day');

    return dailyTotals.reduce((total, dailyTotal) => {
        const totalDate = moment(dailyTotal.date).startOf('day');
        if (totalDate.isSame(yesterday, 'day')) {
            return total + (Number(dailyTotal[salesType]) || 0);
        }
        return total;
    }, 0);
}

function calculateTodaySales(dailyTotals, salesType) {
    const today = moment().startOf('day');

    return dailyTotals.reduce((total, dailyTotal) => {
        const totalDate = moment(dailyTotal.date).startOf('day');
        if (totalDate.isSame(today, 'day')) {
            return total + (Number(dailyTotal[salesType]) || 0);
        }
        return total;
    }, 0);
}

function calculateLastWeekSales(weeklyTotals, salesType) {
    const lastWeekStart = moment().subtract(1, 'week').startOf('week');
    const lastWeekEnd = moment().subtract(1, 'week').endOf('week');

    return weeklyTotals.reduce((total, weeklyTotal) => {
        const totalDate = moment(weeklyTotal.date);
        if (totalDate.isSameOrAfter(lastWeekStart) && totalDate.isSameOrBefore(lastWeekEnd)) {
            return total + (Number(weeklyTotal[salesType]) || 0);
        }
        return total;
    }, 0);
}

function calculateThisWeekSales(weeklyTotals, salesType) {
    const thisWeekStart = moment().startOf('week');
    const thisWeekEnd = moment().endOf('week');

    return weeklyTotals.reduce((total, weeklyTotal) => {
        const totalDate = moment(weeklyTotal.date);
        if (totalDate.isSameOrAfter(thisWeekStart) && totalDate.isSameOrBefore(thisWeekEnd)) {
            return total + (Number(weeklyTotal[salesType]) || 0);
        }
        return total;
    }, 0);
}


function calculateWeeklySalesDifferences(weeklyTotals) {
    if (!weeklyTotals || weeklyTotals.length === 0) return {};

    const salesTypes = ['barSales', 'foodSales'];
    const differences = {};

    salesTypes.forEach(salesType => {
        const lastWeekSales = calculateLastWeekSales(weeklyTotals, salesType);
        console.log("🚀 ~ file: salesTotalsLogic.js:85 ~ calculateWeeklySalesDifferences ~ lastWeekSales:", lastWeekSales)
        const thisWeekSales = calculateThisWeekSales(weeklyTotals, salesType);
        console.log("🚀 ~ file: salesTotalsLogic.js:87 ~ calculateWeeklySalesDifferences ~ thisWeekSales:", thisWeekSales)
        let differenceSales = 0;
        if (lastWeekSales !== 0) {
            differenceSales = ((thisWeekSales - lastWeekSales) / lastWeekSales) * 100;
            console.log("🚀 ~ file: salesTotalsLogic.js:91 ~ calculateWeeklySalesDifferences ~ differenceSales:", differenceSales)
        } else if (thisWeekSales > 0) {
            differenceSales = 100;
        }
        const positiveSales = differenceSales >= 0;
        const sxSales = { bgcolor: positiveSales ? success.main : error.main };
        console.log("🚀 ~ file: salesTotalsLogic.js:97 ~ calculateWeeklySalesDifferences ~ positiveSales:", positiveSales)

        differences[salesType] = {
            difference: differenceSales,
            positive: positiveSales,
            sx: sxSales
        };
    });

    return differences;
}

function calculateDailySalesDifferences(dailyTotals) {
    if (!dailyTotals || dailyTotals.length === 0) return {};

    const salesTypes = ['barSales', 'foodSales'];
    const differences = {};

    salesTypes.forEach(salesType => {
        const yesterdaySales = calculateYesterdaySales(dailyTotals, salesType);
        console.log("🚀 ~ file: salesTotalsLogic.js:115 ~ calculateDailySalesDifferences ~ yesterdaySales:", yesterdaySales)
        const todaySales = calculateTodaySales(dailyTotals, salesType);
        console.log("🚀 ~ file: salesTotalsLogic.js:117 ~ calculateDailySalesDifferences ~ todaySales:", todaySales)
        let differenceSales = 0;
        if (yesterdaySales !== 0) {
            differenceSales = ((todaySales - yesterdaySales) / yesterdaySales) * 100;
        } else if (todaySales > 0) {
            differenceSales = 100;
        }
        const positiveSales = differenceSales >= 0;
        const sxSales = { bgcolor: positiveSales ? success.main : error.main };
        console.log("🚀 ~ file: salesTotalsLogic.js:128 ~ calculateDailySalesDifferences ~ positiveSales:", positiveSales)

        differences[salesType] = {
            difference: differenceSales,
            positive: positiveSales,
            sx: sxSales
        };
    });

    return differences;
}

export { titleToPropName, titles, formatUSD, calculateDailySalesDifferences, calculateWeeklySalesDifferences };