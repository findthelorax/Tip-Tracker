import React, { useContext, useMemo } from 'react';
import { TeamContext } from '../contexts/TeamContext';
import '../app/App.css';
import moment from 'moment';
import WeeklyTotalsTableRender from '../sections/weeklyTotals/weeklyTotalsTableRender';
import WeeklyTipsRender from '../sections/weeklyTotals/weeklyTipsRender';
import { titleToPropName, titles, formatUSD } from '../hooks/salesTotalsLogic';

function WeeklyTotalsTable({ selectedDate, setSelectedDate }) {
	const { team } = useContext(TeamContext);
	const date = moment(selectedDate);

	const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

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
		{ field: 'salesTips', headerName: 'Sales / Tips', flex: 1 },
		...daysOfWeek.map((day, index) => {
			const date = moment(selectedDate).startOf('week').add(index, 'days').format('MM/DD');
			return { field: day, headerName: `${day} ${date}`, flex: 1 };
		}),
		{ field: 'total', headerName: 'Total', flex: 1 },
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

function WeeklyTipsTable({ selectedDate, setSelectedDate }) {
	const { team } = useContext(TeamContext);
	const date = moment(selectedDate);

	const handleDateChange = (date) => {
		setSelectedDate(date);
	};

	let tips = useMemo(() => {
		return team
			.filter((member) => {
				const memberDate = moment(member.date);
				const selectedWeekStart = moment(selectedDate).startOf('week');
				const selectedWeekEnd = moment(selectedWeekStart).endOf('week');

				return memberDate.isSameOrAfter(selectedWeekStart) && memberDate.isSameOrBefore(selectedWeekEnd);
			})
			.sort((a, b) => {
				const positions = ['bartender', 'host', 'runner', 'server'];
				const positionA = positions.indexOf(a.position);
				const positionB = positions.indexOf(b.position);

				if (positionA !== positionB) {
					return positionA - positionB;
				}

				return a.teamMemberName.localeCompare(b.teamMemberName);
			})
			.map((member) => {
				let memberTips = {
					name: member.teamMemberName,
					position: member.position,
				};

				Object.keys(titleToPropName).forEach((key) => {
					memberTips[key] = formatUSD(
						member.dailyTotals.reduce((sum, total) => sum + total[titleToPropName[key]] || 0, 0)
					);
				});
				return memberTips;
			});
	}, [team, selectedDate]);

	const columns = [
		{ field: 'name', headerName: 'Name', flex: 1 },
		{ field: 'position', headerName: 'Position', flex: 1 },
		...Object.keys(titleToPropName).map((title) => ({ field: title, headerName: title, flex: 1 })),
	];

	const rows = tips.map((tip, index) => ({ id: index, ...tip }));

	return (
		<WeeklyTipsRender
			teamMembers={team}
			date={date}
			handleDateChange={handleDateChange}
			rows={rows}
			columns={columns}
		/>
	);
}

export { WeeklyTotalsTable, WeeklyTipsTable };