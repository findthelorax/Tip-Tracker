// import React, { useState, useEffect, useContext, useCallback } from "react";
// import { useRefresh } from './contexts/RefreshContext';
// import { ErrorContext } from './contexts/ErrorContext';
// import { TeamContext } from './contexts/TeamContext';
// import { DailyTotalsContext } from './contexts/DailyTotalsContext';
// import { getDatabases, deleteDatabase } from './api';
import { Card, CardContent, Typography, Table, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';

function WeeklyTotals() {
	// const { error, setError } = useContext(ErrorContext);
	// const { refresh } = useRefresh();
	// const { refreshTeamMembers, setRefreshTeamMembers } = useContext(TeamContext);
	// const [weeklyTotals, setWeeklyTotals] = useState([]);

	// const handleWeeklyTotalsChange = (field, value) => {
	//     setWeeklyTotals({
	//         ...weeklyTotals,
	//         [field]: value,
	//     });
	// };

	return (
		<Card className="sales-card">
			<CardContent>
				<Typography variant="h5">Weekly Totals</Typography>
				<Table className="sales-table">
					<TableHead>
						<TableRow className="header-row">
							<TableCell className="teamMember-column">Team Member</TableCell>
							<TableCell className="position-column">Position</TableCell>
							<TableCell className="totals-column">Totals</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{/* Add your table rows here */}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
};

export default WeeklyTotals;