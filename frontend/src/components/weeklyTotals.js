import React, { useContext, useEffect, useState } from 'react';
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
} from '@material-ui/core';
import { TeamContext } from './contexts/TeamContext';

function WeeklyTotals() {
	const { team } = useContext(TeamContext);
	const [weeklyTotals, setWeeklyTotals] = useState([]);

	useEffect(() => {
		const newWeeklyTotals = team.map((member) => {
			// Group the daily totals by week
			const weeklyGroups = member.dailyTotals.reduce((acc, curr) => {
				const week = getWeek(curr.date);
				acc[week] = [...(acc[week] || []), curr];
				return acc;
			}, {});

			// Calculate the weekly totals for each week
			return {
				teamMemberName: member.teamMemberName,
				totals: Object.values(weeklyGroups).map((dailyTotals) => {
					return dailyTotals.reduce((acc, curr) => {
						for (let key in curr) {
							if (
								key !== 'date' &&
								curr.hasOwnProperty(key) &&
								typeof curr[key] === 'number'
							) {
								acc[key] = (acc[key] || 0) + curr[key];
							}
						}
						return acc;
					}, {});
				}),
			};
		});

		setWeeklyTotals(newWeeklyTotals);
	}, [team]);

	// // Helper function to get the week of a date
	// function getWeek(date) {
	// 	const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
	// 	const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
	// 	return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
	// }

	// Helper function to get the week of a date
	function getWeek(dateString) {
		const date = new Date(dateString);
		const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
		const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
		return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
	}

	return (
		<TableContainer component={Paper}>
			<Table aria-label="simple table">
				<TableHead>
					<TableRow>
						<TableCell>Team Member</TableCell>
						<TableCell align="right">Weekly Total</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{weeklyTotals.map((member, memberIndex) =>
						member.totals.map((total, index) => (
							<TableRow
								key={`${member.teamMemberName}-${memberIndex}-${index}`}
							>
								<TableCell component="th" scope="row">
									{member.teamMemberName}
								</TableCell>
								<TableCell align="right">
									{Object.values(total).join(', ')}
								</TableCell>
							</TableRow>
						))
					)}
				</TableBody>
			</Table>
		</TableContainer>
	);
}

export default WeeklyTotals;
