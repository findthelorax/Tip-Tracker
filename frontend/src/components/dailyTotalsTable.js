import React, { memo, useContext, useEffect } from 'react';
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Button,
	Divider,
} from '@mui/material';
import { FormattedDate } from './utils/dateUtils';
import { DailyTotalsContext } from './contexts/DailyTotalsContext';

const CurrencyColumn = memo(({ className, value }) => (
    <TableCell className={className}>
        {Number(value || 0).toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
        })}
    </TableCell>
));

const columnNames = {
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

	return (
		<TableContainer component={Paper}>
			<Table className="sales-table" aria-label="simple table">
				<TableHead>
					<TableRow className="header-row">
						<TableCell>Date</TableCell>
						{Object.entries(columnNames).map(([key, name]) => (
							<TableCell key={key} align="right">
								{name}
							</TableCell>
						))}
						<TableCell align="right">Action</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{team.map((teamMember) =>
						teamMember.dailyTotals.map((dailyTotal, index) => (
							<React.Fragment key={`${dailyTotal.date}-${index}`}>
								{index === 0 && (
									<>
										<TableRow>
											<TableCell colSpan={12}>
												{`${teamMember.teamMemberName} - ${teamMember.position}`}
											</TableCell>
										</TableRow>
										<TableRow>
											<TableCell colSpan={12}>
												<Divider />
											</TableCell>
										</TableRow>
									</>
								)}
                                <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
									<TableCell component="th" scope="row">
										{dailyTotal.date
											? FormattedDate(dailyTotal.date)
											: dailyTotal.date}
									</TableCell>
									{Object.entries(columnNames).map(
										([key, name]) => (
											<CurrencyColumn
												key={`${dailyTotal.date}-${key}`}
												className={`${key}-column`}
												value={dailyTotal[key]}
											/>
										)
									)}
									<TableCell align="right">
										<Button
											variant="contained"
                                            sx={{ bgcolor: 'error.main', color: 'white' }}
											onClick={() =>
												deleteDailyTotal(
													teamMember,
													dailyTotal.date
												)
											}
										>
											Delete
										</Button>
									</TableCell>
								</TableRow>
							</React.Fragment>
						))
					)}
				</TableBody>
			</Table>
		</TableContainer>
	);
}

export default DailyTotalsTable;
