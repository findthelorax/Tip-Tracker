import React, { useContext, useMemo } from 'react';
import { Paper, Text, Table, TableTbody, TableTd, TableTh, TableThead, TableTr, Card, CardSection } from '@mantine/core';
import { TeamContext } from './contexts/TeamContext';

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
		<Paper padding="md" style={{ marginBottom: '1rem' }}>
			<Table>
				<TableThead>
					<TableTr>
						<TableTh>Sales / Tips</TableTh>
						{daysOfWeek.map((day, index) => (
							<TableTh key={day + index}>{day}</TableTh>
						))}
						<TableTh>Total</TableTh>
					</TableTr>
				</TableThead>
				<TableTbody>
					{titles.map((title, i) => (
						<TableTr key={i}>
							<TableTd key={title + i}>{title}</TableTd>
							{weeklyTotals.map((total, index) => (
								<TableTd key={title + i + index}>{total[titleToPropName[title]]}</TableTd>
							))}
							<TableTd key={title + 'total'}>
								{weeklyTotals.reduce((sum, total) => sum + total[titleToPropName[title]], 0)}
							</TableTd>
						</TableTr>
					))}
				</TableTbody>
			</Table>
		</Paper>
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
				memberTips[key] = member.dailyTotals.reduce((sum, total) => sum + total[titleToPropName[key]], 0);
			});
			return memberTips;
		});

	// return (
	// 	<Card>
	// 		<CardSection>
	// 			<Text size="xl" align="center">
	// 				Weekly Tips
	// 			</Text>
	// 			<Table>
	// 				<TableThead>
	// 					<TableTr>
	// 						<TableTh>Name</TableTh>
	// 						<TableTh>Position</TableTh>
	// 						{Object.keys(titleToPropName).map((title, index) => (
	// 							<TableTh key={index}>{title}</TableTh>
	// 						))}
	// 					</TableTr>
	// 				</TableThead>
	// 				<TableTbody>
	// 					{tips.map((tip, index) => (
	// 						<TableTr key={index}>
	// 							<TableTd>{tip.name}</TableTd>
	// 							<TableTd>{tip.position}</TableTd>
	// 							{Object.keys(titleToPropName).map((title, index) => (
	// 								<TableTd key={index}>{tip[title]}</TableTd>
	// 							))}
	// 						</TableTr>
	// 					))}
	// 				</TableTbody>
	// 			</Table>
	// 		</CardSection>
	// 	</Card>
	// );
}

export { WeeklyTotals, TipsCard };