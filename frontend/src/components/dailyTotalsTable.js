import React, { useContext, useEffect } from 'react';
import { Button } from '@mui/material';
import { DailyTotalsContext } from '../contexts/DailyTotalsContext';
import { FormattedDate } from '../utils/utils';
import DailyTotalsTableRender from '../sections/dailyTotals/dailyTotalsTableRender';
import { TeamContext } from '../contexts/TeamContext';

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

function DailyTotalsTable() {
	const { refreshDailyTotals } = useContext(DailyTotalsContext);
    const { deleteDailyTotal } = useContext(DailyTotalsContext);
	const { team } = useContext(TeamContext);

	useEffect(() => {}, [refreshDailyTotals]);

	const rows = team.flatMap((teamMember) =>
		teamMember.dailyTotals.map((dailyTotal) => ({
			_id: teamMember._id,
			date: FormattedDate(dailyTotal.date),
			key: `${teamMember._id}-${FormattedDate(dailyTotal.date)}`,
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
				onClick={() => deleteDailyTotal(params.row, params.row.date)}
			>
				Delete
			</Button>
		),
	});

	return (
		<DailyTotalsTableRender rows={rows} columns={columns} deleteDailyTotal={deleteDailyTotal} />
	);
}

export default DailyTotalsTable;