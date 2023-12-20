import moment from 'moment-timezone';

const today = moment().local();
const localDate = today.format('YYYY-MM-DD');

export const initialDailyTotals = {
    date: localDate,
    foodSales: '',
    barSales: '',
    nonCashTips: '',
    cashTips: '',
    barTipOuts: 0,
    runnerTipOuts: 0,
    hostTipOuts: 0,
    totalTipOut: 0,
    tipsReceived: 0,
    totalPayrollTips: 0,
};