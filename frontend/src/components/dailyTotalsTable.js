import React, { useContext, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Paper } from '@mui/material';
import { FormattedDate } from './utils/dateUtils';
import { DailyTotalsContext } from './contexts/DailyTotalsContext';

const columnNames = {
	date: 'Date',
	foodSales: 'Food Sales',
	barSales: 'Bar Sales',
	nonCashTips: 'Non-Cash Tips',
	cashTips: 'Cash Tips',
	barTipOuts: 'Bar Tip Outs',
	runnerTipOuts: 'Runner Tip Outs',
	hostTipOuts: 'Host Tip Outs',
	totalTipOut: 'Total Tip Out',
	tipsReceived: 'Tips Received',
	totalPayrollTips: 'Total Payroll Tips',
};

function DailyTotalsTable({ team, deleteDailyTotal }) {
	const { refreshDailyTotals } = useContext(DailyTotalsContext);

	useEffect(() => {
	}, [refreshDailyTotals]);

	const rows = team.flatMap((teamMember) =>
		teamMember.dailyTotals.map((dailyTotal, index) => ({
			id: `${dailyTotal.date}-${index}`,
			date: dailyTotal.date,
			teamMemberName: teamMember.teamMemberName,
			teamMemberPosition: teamMember.position,
			...dailyTotal,
		}))
	);

	const columns = [
		{ field: 'teamMemberName', headerName: 'Team Member Name', width: 150 },
		{ field: 'teamMemberPosition', headerName: 'Position', width: 150 },
		...Object.entries(columnNames).map(([key, name]) => ({
			field: key,
			headerName: name,
			width: 150,
			valueFormatter: ({ value }) =>
				key !== 'date'
					? Number(value || 0).toLocaleString('en-US', {
						style: 'currency',
						currency: 'USD',
					})
					: FormattedDate(value),
		})),
	];
	
	columns.push({
		field: 'delete',
		headerName: 'Action',
		sortable: false,
		width: 100,
		renderCell: (params) => (
			<Button
				variant="contained"
				sx={{ bgcolor: 'error.main', color: 'white' }}
				onClick={() => deleteDailyTotal(params.row.teamMember, params.row.date)}
			>
				Delete
			</Button>
		),
	});

	return (
		<div style={{ height: 400, width: '100%' }}>
			<Paper elevation={3}>
				<DataGrid rows={rows} columns={columns} pageSize={5} />
			</Paper>
		</div>
	);
}

export default DailyTotalsTable;