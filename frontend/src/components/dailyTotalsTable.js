import React, { memo, useContext, useEffect } from 'react';
import { FormattedDate } from './utils/dateUtils';
import { DailyTotalsContext } from './contexts/DailyTotalsContext';
import { Table, Grid, GridCol, Paper, Button, Divider } from '@mantine/core';

const CurrencyColumn = memo(({ className, value }) => (
	<GridCol className={className}>
		{Number(value || 0).toLocaleString('en-US', {
			style: 'currency',
			currency: 'USD',
		})}
	</GridCol>
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
        <Paper padding="md" style={{ marginBottom: '1rem' }}>
            {team.map((teamMember) =>
                teamMember.dailyTotals.map((dailyTotal, index) => (
                    <React.Fragment key={`${dailyTotal.date}-${index}`}>
                        {index === 0 && (
                            <>
                                <Grid gutter="md">
                                    <Grid.Col span={12}>
                                        {`${teamMember.teamMemberName} - ${teamMember.position}`}
                                    </Grid.Col>
                                </Grid>
                                <Divider />
                            </>
                        )}
                        <Grid gutter="md">
                            <Grid.Col span={3}>
                                {dailyTotal.date
                                    ? FormattedDate(dailyTotal.date)
                                    : dailyTotal.date}
                            </Grid.Col>
                            {Object.entries(columnNames).map(
                                ([key, name]) => (
                                    <CurrencyColumn
                                        key={`${dailyTotal.date}-${key}`}
                                        className={`${key}-column`}
                                        value={dailyTotal[key]}
                                    />
                                )
                            )}
                            <Grid.Col span={3} align="right">
                                <Button color="red" onClick={() =>
                                    deleteDailyTotal(
                                        teamMember,
                                        dailyTotal.date
                                    )
                                }>
                                    Delete
                                </Button>
                            </Grid.Col>
                        </Grid>
                    </React.Fragment>
                ))
            )}
        </Paper>
    );
}

export default DailyTotalsTable;