import React, { useContext, useEffect } from 'react';
import moment from 'moment';
import { DailyTotalsContext } from '../contexts/DailyTotalsContext';
import DailyTotalsTableRender from '../sections/dailyTotals/dailyTotalsTableRender';
import { TeamContext } from '../contexts/TeamContext';
import { useGetAllDailyTotals } from '../hooks/getAllDailyTotals';
import { DeleteButton } from './deleteButton';

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
	const { fetchAllDailyTotals } = useGetAllDailyTotals();

	useEffect(() => {
		fetchAllDailyTotals();
	}, [refreshDailyTotals, fetchAllDailyTotals]);

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
		{ field: 'teamMemberName', headerName: 'Name', pinned: 'left', cellClass: 'pinned', headerClass: 'pinned-header' },
		{ field: 'teamMemberPosition', headerName: 'Position', width: 120 },
		...Object.entries(columnNames).map(([key, name]) => ({
			field: key,
			headerName: name,
			width: 150,
			valueGetter: ({ data }) =>
				key !== 'date'
					? Number(data[key] || 0).toLocaleString('en-US', {
							style: 'currency',
							currency: 'USD',
					  })
					: moment(data[key]).format('MMM D, YYYY'),
		})),
	];

	columns.push({
		headerName: 'Delete',
		field: 'delete',
		cellRenderer: DeleteButton, // Directly reference the DeleteButton component
		cellRendererParams: {
			deleteDailyTotal: deleteDailyTotal,
		},
		width: 100,
	});

	return <DailyTotalsTableRender rows={rows} columns={columns} />;
}

export default DailyTotalsTable;