import React, { useContext, useMemo } from 'react';
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Card,
	CardContent,
	Typography,
	List,
	ListItem,
	Box,
} from '@mui/material';
import { TeamContext } from './contexts/TeamContext';

const ListItemCell = ({ children, index }) => (
	<ListItem style={{ backgroundColor: index % 2 === 0 ? '#f0f0f0' : '#ffffff' }}>{children}</ListItem>
);
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

function WeeklyTotals() {
	const { team } = useContext(TeamContext);
	const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

	const weeklyTotals = useMemo(() => {
		const totals = Array(7)
			.fill(0)
			.map(() => {
				const dayTotal = {};
				Object.values(titleToPropName).forEach(propName => {
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

	return (
		<TableContainer component={Paper}>
			<Table>
				<TableHead>
					<TableRow>
						<TableCell>Sales / Tips</TableCell>
						{daysOfWeek.map((day, index) => (
							<TableCell key={day + index}>{day}</TableCell>
						))}
						<TableCell>Total</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{titles.map((title, i) => (
						<TableRow key={i}>
							<TableCell>
								<ListItemCell index={i}>{title}</ListItemCell>
							</TableCell>
							{weeklyTotals.map((total, index) => (
								<TableCell key={total[titleToPropName[title]] + index}>
									<Box display="flex" flexDirection="column" alignItems="stretch" p={0}>
										<List>
											<ListItem style={{ backgroundColor: i % 2 === 0 ? '#f0f0f0' : '#ffffff' }}>
												{total[titleToPropName[title]]}
											</ListItem>
										</List>
									</Box>
								</TableCell>
							))}
							<TableCell>
							<List>
									<ListItem style={{ backgroundColor: i % 2 === 0 ? '#f0f0f0' : '#ffffff' }}>
										{weeklyTotals.reduce((sum, total) => sum + total[titleToPropName[title]], 0)}
									</ListItem>
								</List>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
}

function TipsCard({ team }) {
    let tips = team
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
                memberTips[key] = member.dailyTotals.reduce((sum, total) => sum + total[titleToPropName[key]] || 0, 0);
            });
            return memberTips;
        });

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" component="h2">
                    Weekly Tips
                </Typography>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Position</TableCell>
                            {Object.keys(titleToPropName).map((title, index) => (
                                <TableCell key={title + index}>{title}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tips.map((tip, index) => (
                            <TableRow key={index}>
                                <TableCell>{tip.name}</TableCell>
                                <TableCell>{tip.position}</TableCell>
                                {Object.keys(titleToPropName).map((title, index) => (
                                    <TableCell key={'title' + index}>{tip[title]}</TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

export { WeeklyTotals, TipsCard };