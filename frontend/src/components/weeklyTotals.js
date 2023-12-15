import React, { useContext, useMemo } from 'react';
import { Typography, Paper } from '@mui/material';
import { TeamContext } from './contexts/TeamContext';
import { DailyTotalsContext } from './contexts/DailyTotalsContext';
import { DataGrid } from '@mui/x-data-grid';
import './app/App.css';
import { FormattedDate, CalculateTipOuts, ExportToCsvButton, ExportToExcelButton } from './utils/utils';

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

function WeeklyTotals() {
	const { refreshDailyTotals, dailyTotalsAll } = useContext(DailyTotalsContext);
	const { team } = useContext(TeamContext);

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
				const dayOfWeek = new Date(total.date).getDay();
				Object.keys(titleToPropName).forEach((key) => {
					totals[dayOfWeek][titleToPropName[key]] += total[titleToPropName[key]] || 0;
				});
			});
		});

		return totals;
	}, [team]);

	const columns = [
		{ field: 'salesTips', headerName: 'Sales / Tips', width: 150 },
		...daysOfWeek.map((day) => ({ field: day, headerName: day, width: 150 })),
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

	return (
		<div style={{ height: 400, width: '100%' }}>
			<Typography variant="h5" component="h2">
				Weekly Totals
			</Typography>
			<div style={{ display: 'flex', justifyContent: 'flex-end' }}>
				<ExportButton data={rows} />
				<ExportToExcelButton data={rows} />
			</div>
			<DataGrid rows={rows} columns={columns} pageSize={5} />
		</div>
	);
}

function TipsCard({ team }) {
	const { refreshDailyTotals, dailyTotalsAll } = useContext(DailyTotalsContext);
	let tips = [...team]
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

	const columns = [
		{ field: 'name', headerName: 'Name', width: 150 },
		{ field: 'position', headerName: 'Position', width: 150 },
		...Object.keys(titleToPropName).map((title) => ({ field: title, headerName: title, width: 150 })),
	];

	const rows = tips.map((tip, index) => ({ id: index, ...tip }));

	return (
		<div style={{ height: 400, width: '100%' }}>
			<Typography variant="h5" component="h2">
				Weekly Tips
			</Typography>
			<div style={{ display: 'flex', justifyContent: 'flex-end' }}>
				<ExportButton data={rows} />
				<ExportToExcelButton data={rows} />
			</div>
			<DataGrid rows={rows} columns={columns} pageSize={5} />
		</div>
	);
}

export { WeeklyTotals, TipsCard };
