import React from 'react';
import DailyTotalsTable from '../dailyTotals/dailyTotalsTable';
import { WeeklyTotalsTable } from '../weeklyTotals/weeklyTotalsTable';
import { MonthlyTotalsTable } from '../salesTables/monthlyTotals/monthlyTotalsTable';

function TimePeriodTable({ timePeriod }) {
	switch (timePeriod) {
		case 'day':
			return <DailyTotalsTable />;
		case 'week':
			return <WeeklyTotalsTable />;
		case 'month':
			return <MonthlyTotalsTable />;
		default:
			return <DailyTotalsTable />;
	}
}

export default TimePeriodTable;