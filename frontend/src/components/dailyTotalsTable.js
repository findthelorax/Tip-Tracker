import React, { useContext, useEffect } from 'react';
import { Button } from '@mui/material';
import moment from 'moment';
import { DailyTotalsContext } from '../contexts/DailyTotalsContext';
import DailyTotalsTableRender from '../sections/dailyTotals/dailyTotalsTableRender';
import { TeamContext } from '../contexts/TeamContext';
import { useFetchDailyTotals } from '../hooks/fetchDailyTotals';

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
	const { fetchDailyTotals } = useFetchDailyTotals();

	useEffect(() => {
		fetchDailyTotals();
	}, [refreshDailyTotals, fetchDailyTotals]);

	const rows = team.flatMap((teamMember) =>
		teamMember.dailyTotals.map((dailyTotal) => {
			const localDate = moment.utc(dailyTotal.date).add(moment().utcOffset(), 'minutes').format('MMM D, YYYY');
			return {
				teamMemberId: teamMember._id,
				_id: dailyTotal._id,
				date: localDate,
				key: `${teamMember._id}-${dailyTotal._id}`,
				teamMemberName: teamMember.teamMemberName,
				teamMemberPosition: teamMember.position,
				...dailyTotal,
			};
		})
	);

	const columns = [
		{ field: 'teamMemberName', headerName: 'Name', width: 150 },
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
					: moment(value).format('MMM D, YYYY'),
		})),
	];

	columns.push({
		field: 'delete',
		headerName: 'Action',
		sortable: false,
		width: 100,
		renderCell: (params) => {
			const teamMember = team.find((member) => member._id === params.row.teamMemberId);
			const dailyTotal = params.row;
			return (
				<Button
					variant="contained"
					sx={{ bgcolor: 'error.main', color: 'white' }}
					onClick={() => deleteDailyTotal(teamMember, dailyTotal)}
				>
					Delete
				</Button>
			);
		},
	});

	return <DailyTotalsTableRender rows={rows} columns={columns} deleteDailyTotal={deleteDailyTotal} />;
}

export default DailyTotalsTable;
