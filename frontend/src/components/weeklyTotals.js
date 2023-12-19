import React, { useContext, useMemo } from 'react';
import { TeamContext } from '../contexts/TeamContext';
import '../app/App.css';
import moment from 'moment';
import WeeklyTotalsRender from '../sections/weeklyTotals/weeklyTotalsRender';
import WeeklyTipsRender from '../sections/weeklyTotals/weeklyTipsRender';
import { WeeklyBarSalesCardRender, WeeklyFoodSalesCardRender } from '../sections/weeklyTotals/weeklyTotalsCardsRender';

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

function WeeklyTotalsTable({selectedDate, setSelectedDate}) {
	const { team } = useContext(TeamContext);
	const date = moment(selectedDate.toISOString());

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
		{ field: 'salesTips', headerName: 'Sales / Tips', width: 150 },
		...daysOfWeek.map((day, index) => {
			const date = moment(selectedDate).startOf('week').add(index, 'days').format('MM/DD');
			return { field: day, headerName: `${day} (${date})`, width: 150 };
		}),
		{ field: 'total', headerName: 'Total', width: 150 },
	];

	const rows = titles.map((title, i) => {
		const row = { id: i, salesTips: title };
		weeklyTotals.forEach((total, index) => {
			row[daysOfWeek[index]] = formatUSD(total[titleToPropName[title]]);
		});
		row.total = formatUSD(weeklyTotals.reduce((sum, total) => sum + total[titleToPropName[title]], 0));
		return row;
	});

	return <WeeklyTotalsRender date={date} handleDateChange={handleDateChange} rows={rows} columns={columns} />;
}

function WeeklyTipsTable({ team, selectedDate, setSelectedDate}) {
	const date = moment(selectedDate.toISOString());

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
		{ field: 'name', headerName: 'Name', width: 150 },
		{ field: 'position', headerName: 'Position', width: 150 },
		...Object.keys(titleToPropName).map((title) => ({ field: title, headerName: title, width: 150 })),
	];

	const rows = tips.map((tip, index) => ({ id: index, ...tip }));

	return <WeeklyTipsRender date={date} handleDateChange={handleDateChange} rows={rows} columns={columns} />;
}

function WeeklyFoodSalesCard({ team, selectedDate }) {
    const teamMembers = useMemo(() => {
        const selectedWeekStart = moment(selectedDate).startOf('week');
        const selectedWeekEnd = moment(selectedWeekStart).endOf('week');

		return team.map(member => {
			const weeklyTotals = member.dailyTotals.filter(total => {
				const totalDate = moment(total.date);
				return totalDate.isSameOrAfter(selectedWeekStart) && totalDate.isSameOrBefore(selectedWeekEnd);
			});
			return { ...member, weeklyTotals };
		});
	}, [team, selectedDate]);

    return (
        <WeeklyFoodSalesCardRender teamMembers={teamMembers} selectedDate={selectedDate}/>
    );
}
function WeeklyBarSalesCard({ team, selectedDate }) {
    const teamMembers = useMemo(() => {
        const selectedWeekStart = moment(selectedDate).startOf('week');
        const selectedWeekEnd = moment(selectedWeekStart).endOf('week');

		return team.map(member => {
			const weeklyTotals = member.dailyTotals.filter(total => {
				const totalDate = moment(total.date);
				return totalDate.isSameOrAfter(selectedWeekStart) && totalDate.isSameOrBefore(selectedWeekEnd);
			});
			return { ...member, weeklyTotals };
		});
	}, [team, selectedDate]);

    return (
        <WeeklyBarSalesCardRender teamMembers={teamMembers} selectedDate={selectedDate}/>
    );
}

export { WeeklyTotalsTable, WeeklyTipsTable, WeeklyBarSalesCard, WeeklyFoodSalesCard };