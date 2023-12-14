import React, { useContext } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Card, CardContent, Typography } from '@material-ui/core';
import { TeamContext } from './contexts/TeamContext';

function WeeklyTotals() {
	const { team } = useContext(TeamContext);
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let weeklyTotals = Array(7).fill({ barSales: 0, foodSales: 0, nonCashTips: 0, cashTips: 0 });

    team.forEach(member => {
        member.dailyTotals.forEach((total, index) => {
            weeklyTotals[index].barSales += total.barSales;
            weeklyTotals[index].foodSales += total.foodSales;
            weeklyTotals[index].nonCashTips += total.nonCashTips;
            weeklyTotals[index].cashTips += total.cashTips;
        });
    });

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        {daysOfWeek.map((day, index) => <TableCell key={index}>{day}</TableCell>)}
                        <TableCell>Total</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        {weeklyTotals.map((total, index) => (
                            <TableCell key={index}>
                                Bar Sales: {total.barSales}<br />
                                Food Sales: {total.foodSales}<br />
                                Non-Cash Tips: {total.nonCashTips}<br />
                                Cash Tips: {total.cashTips}
                            </TableCell>
                        ))}
                        <TableCell>
                            Bar Sales: {weeklyTotals.reduce((sum, total) => sum + total.barSales, 0)}<br />
                            Food Sales: {weeklyTotals.reduce((sum, total) => sum + total.foodSales, 0)}<br />
                            Non-Cash Tips: {weeklyTotals.reduce((sum, total) => sum + total.nonCashTips, 0)}<br />
                            Cash Tips: {weeklyTotals.reduce((sum, total) => sum + total.cashTips, 0)}
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
}

function TipsCard({ team }) {
    let tips = team.map(member => ({
        name: member.teamMemberName,
        position: member.position,
        tips: member.dailyTotals.reduce((sum, total) => sum + total.tipOuts, 0)
    }));

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" component="h2">
                    Weekly Tips
                </Typography>
                {tips.map((tip, index) => (
                    <Typography key={index}>
                        {tip.name} - {tip.position}: {tip.tips}
                    </Typography>
                ))}
            </CardContent>
        </Card>
    );
}

export { WeeklyTotals, TipsCard };