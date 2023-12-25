import React, { useContext, useMemo } from 'react';
import { TeamContext } from '../../contexts/TeamContext';
import '../../app/App.css';
import moment from 'moment';
import WeeklyTotalsTableRender from './weeklyTotalsTableRender';
import { titleToPropName, titles, formatUSD } from '../../hooks/salesTotalsLogic';

function WeeklyTotalsTable({ selectedDate, setSelectedDate }) {
	const { team } = useContext(TeamContext);
	const date = moment(selectedDate);

	const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

	const weeklyTotals = useMemo(() => {
		const totals = Array(7)
			.fill(0)
			.map(() => {
				const dayTotal = {};
				Object.values(titleToPropName).forEach((propName) => {
					dayTotal[propName] = 0;
				});
				return dayTotal;
			});

		team.forEach((member) => {
			member.dailyTotals.forEach((total) => {
				const totalDate = moment(total.date);
				const selectedWeekStart = moment(selectedDate).startOf('week');
				const selectedWeekEnd = moment(selectedWeekStart).endOf('week');

				if (totalDate.isSameOrAfter(selectedWeekStart) && totalDate.isSameOrBefore(selectedWeekEnd)) {
					const dayOfWeek = totalDate.day();
					Object.keys(titleToPropName).forEach((key) => {
						totals[dayOfWeek][titleToPropName[key]] += total[titleToPropName[key]] || 0;
					});
				}
			});
		});

		return totals;
	}, [team, selectedDate]);

	const handleDateChange = (date) => {
		setSelectedDate(date);
	};

	const columns = [
		{ field: 'salesTips', headerName: 'Sales / Tips', width: 130 },
		...daysOfWeek.map((day, index) => {
			const date = moment(selectedDate).startOf('week').add(index, 'days').format('MM/DD');
			return { field: day, headerName: `${day} ${date}`, width: 110 };
		}),
		{ field: 'total', headerName: 'Total', width: 100 },
	];

	const rows = titles.map((title, i) => {
		const row = { id: i, salesTips: title };
		weeklyTotals.forEach((total, index) => {
			row[daysOfWeek[index]] = formatUSD(total[titleToPropName[title]]);
		});
		row.total = formatUSD(weeklyTotals.reduce((sum, total) => sum + total[titleToPropName[title]], 0));
		return row;
	});

	return (
		<WeeklyTotalsTableRender
			teamMembers={team}
			date={date}
			handleDateChange={handleDateChange}
			rows={rows}
			columns={columns}
		/>
	);
}



export { WeeklyTotalsTable };