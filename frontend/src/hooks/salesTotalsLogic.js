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

function isDateInRange(date, start, end) {
    const dateMoment = moment(date);
    const startOfDay = moment(date).startOf('day');
    const endOfDay = moment(date).endOf('day');
    return dateMoment.isBetween(startOfDay, endOfDay, 'day', '[]');
}

function calculateSales(totals, salesType, start, end) {
    if (!Array.isArray(totals)) {
        console.error('Invalid argument: totals must be an array');
        return 0;
    }

    return totals.reduce((total, totalItem) => {
        if (isDateInRange(totalItem.date, start, end)) {
            return total + (Number(totalItem[salesType]) || 0);
        }
        return total;
    }, 0);
}

function calculateYesterdaySales(dailyTotals, salesType) {
    console.log("🚀 ~ file: salesTotalsLogic.js:44 ~ calculateYesterdaySales ~ dailyTotals:", dailyTotals)
    const yesterdayStart = moment().subtract(1, 'day').startOf('day');
    const yesterdayEnd = moment().subtract(1, 'day').endOf('day');
    return calculateSales(dailyTotals, salesType, yesterdayStart, yesterdayEnd);
}

function calculateTodaySales(dailyTotals, salesType) {
    const todayStart = moment().startOf('day');
    const todayEnd = moment().endOf('day');
    return calculateSales(dailyTotals, salesType, todayStart, todayEnd);
}

function calculateLastWeekSales(weeklyTotals, salesType) {
    console.log("🚀 ~ file: salesTotalsLogic.js:57 ~ calculateLastWeekSales ~ weeklyTotals:", weeklyTotals)
    const lastWeekStart = moment().subtract(1, 'week').startOf('week');
    const lastWeekEnd = moment().subtract(1, 'week').endOf('week');
    return calculateSales(weeklyTotals, salesType, lastWeekStart, lastWeekEnd);
}

function calculateThisWeekSales(weeklyTotals, salesType) {
    const thisWeekStart = moment().startOf('week');
    const thisWeekEnd = moment().endOf('week');
    return calculateSales(weeklyTotals, salesType, thisWeekStart, thisWeekEnd);
}

function calculateWeeklySalesDifferences(weeklyTotals) {
    // console.log("🚀 ~ file: salesTotalsLogic.js:64 ~ calculateWeeklySalesDifferences ~ weeklyTotals:", weeklyTotals)
    if (!weeklyTotals || weeklyTotals.length === 0) return {};

    const salesTypes = ['barSales', 'foodSales'];
    const differences = {};

    salesTypes.forEach(salesType => {
        const lastWeekSales = calculateLastWeekSales(weeklyTotals, salesType);
        const thisWeekSales = calculateThisWeekSales(weeklyTotals, salesType);
        let differenceSales = 0;
        if (lastWeekSales !== 0) {
            differenceSales = ((thisWeekSales - lastWeekSales) / lastWeekSales) * 100;
        } else if (thisWeekSales > 0) {
            differenceSales = 100;
        }
        const positiveSales = differenceSales >= 0;
        const sxSales = { bgcolor: positiveSales ? success.main : error.main };

        differences[salesType] = {
            difference: differenceSales,
            positive: positiveSales,
            sx: sxSales
        };
    });

    return differences;
}

function calculateDailySalesDifferences(dailyTotals) {
    console.log("🚀 ~ file: salesTotalsLogic.js:93 ~ calculateDailySalesDifferences ~ dailyTotals:", dailyTotals)
    if (!dailyTotals || dailyTotals.length === 0) return {};

    const salesTypes = ['barSales', 'foodSales'];
    const differences = {};

    salesTypes.forEach(salesType => {
        const yesterdaySales = calculateYesterdaySales(dailyTotals, salesType);
        const todaySales = calculateTodaySales(dailyTotals, salesType);
        let differenceSales = 0;
        if (yesterdaySales !== 0) {
            differenceSales = ((todaySales - yesterdaySales) / yesterdaySales) * 100;
        } else if (todaySales > 0) {
            differenceSales = 100;
        }
        const positiveSales = differenceSales >= 0;
        const sxSales = { bgcolor: positiveSales ? success.main : error.main };

        differences[salesType] = {
            difference: differenceSales,
            positive: positiveSales,
            sx: sxSales
        };
    });

    return differences;
}

export { titleToPropName, titles, formatUSD, calculateDailySalesDifferences, calculateWeeklySalesDifferences };