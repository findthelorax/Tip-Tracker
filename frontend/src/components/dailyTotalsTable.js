import React, { memo } from 'react';
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
} from '@material-ui/core';
import { FormattedDate } from './dateUtils';

const CurrencyColumn = memo(({ className, value }) => (
    <TableCell className={className}>
        {value
            ? Number(value).toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
              })
            : 'N/A'}
    </TableCell>
));

function DailyTotalsTable({ team, classes, deleteDailyTotal }) {
    return (
        <TableContainer component={Paper}>
            <Table className="sales-table" aria-label="simple table">
                <TableHead>
                    <TableRow className="header-row">
                        <TableCell>Date</TableCell>
                        <TableCell align="right">Food Sales</TableCell>
                        <TableCell align="right">Bar Sales</TableCell>
                        <TableCell align="right">Non-Cash Tips</TableCell>
                        <TableCell align="right">Cash Tips</TableCell>
                        <TableCell align="right">Bar Tip Outs</TableCell>
                        <TableCell align="right">Runner Tip Outs</TableCell>
                        <TableCell align="right">Host Tip Outs</TableCell>
                        <TableCell align="right">Total Tip Outs</TableCell>
                        <TableCell align="right">Tips Received</TableCell>
                        <TableCell align="right">
                            Total Payroll Tips
                        </TableCell>
                        <TableCell align="right">Action</TableCell>
                    </TableRow>
                </TableHead>
                {team.map((teamMember) => (
                    <React.Fragment key={teamMember.id}>
                        <TableBody>
                            <TableRow>
                                <TableCell
                                    colSpan={12}
                                >{`${teamMember.teamMemberName} - ${teamMember.position}`}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={12}>
                                    <Divider />
                                </TableCell>
                            </TableRow>
                        </TableBody>
                        <TableBody>
                            {teamMember.dailyTotals.map(
                                (dailyTotal, index) => {
                                    const currencyColumns = [
                                        {
                                            className: 'foodSales-column',
                                            value: dailyTotal.foodSales,
                                        },
                                        {
                                            className: 'barSales-column',
                                            value: dailyTotal.barSales,
                                        },
                                        {
                                            className: 'nonCashTips-column',
                                            value: dailyTotal.nonCashTips,
                                        },
                                        {
                                            className: 'cashTips-column',
                                            value: dailyTotal.cashTips,
                                        },
                                        {
                                            className: 'barTipOuts-column',
                                            value: dailyTotal.barTipOuts,
                                        },
                                        {
                                            className:
                                                'runnerTipOuts-column',
                                            value: dailyTotal.runnerTipOuts,
                                        },
                                        {
                                            className: 'hostTipOuts-column',
                                            value: dailyTotal.hostTipOuts,
                                        },
                                        {
                                            className:
                                                'totalTipOuts-column',
                                            value: dailyTotal.totalTipOuts,
                                        },
                                        {
                                            className:
                                                'tipsReceived-column',
                                            value: dailyTotal.tipsReceived,
                                        },
                                        {
                                            className:
                                                'totalPayrollTips-column',
                                            value: dailyTotal.totalPayrollTips,
                                        },
                                    ];
                                    const handleDelete = () => {
                                        deleteDailyTotal(dailyTotal, teamMember);
                                    };
                                    return (
                                        <React.Fragment key={index}>
                                            <TableRow
                                                key={index}
                                                className={classes.tableRow}
                                            >
                                                <TableCell
                                                    component="th"
                                                    scope="row"
                                                >
                                                    {dailyTotal.date
                                                        ? FormattedDate(
                                                                dailyTotal.date
                                                          )
                                                        : dailyTotal.date}
                                                </TableCell>
                                                {currencyColumns.map(
                                                    (column, id) => (
                                                        <CurrencyColumn
                                                            key={id}
                                                            className={
                                                                column.className
                                                            }
                                                            value={
                                                                column.value
                                                            }
                                                        />
                                                    )
                                                )}
                                                <TableCell align="right">
                                                    <Button
                                                        variant="contained"
                                                        color="secondary"
                                                        onClick={
                                                            handleDelete
                                                        }
                                                    >
                                                        Delete
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        </React.Fragment>
                                    );
                                }
                            )}
                        </TableBody>
                    </React.Fragment>
                ))}
            </Table>
        </TableContainer>
    );
}

export default DailyTotalsTable;