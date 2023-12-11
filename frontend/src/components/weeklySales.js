// import React, { useState } from "react";
// import React, { useState, useEffect, useContext, useCallback } from "react";
// import { useRefresh } from './contexts/RefreshContext';
// import { ErrorContext } from './contexts/ErrorContext';
// import { TeamContext } from './contexts/TeamContext';
// import { DailyTotalsContext } from './contexts/DailyTotalsContext';
// import { getDatabases, deleteDatabase } from './api';



function WeeklyTotals() {
	// const { error, setError } = useContext(ErrorContext);
    // const { refresh } = useRefresh();
    // const { refreshTeamMembers, setRefreshTeamMembers } = useContext(TeamContext);
	// const [weeklyTotals, setWeeklyTotals] = useState([]);

	// const handleWeeklyTotalsChange = (field, value) => {
	// 	setWeeklyTotals({
	// 		...weeklyTotals,
	// 		[field]: value,
	// 	});
	// };

	return (
		<div className="sales-card">
			<h2>Weekly Totals</h2>
			<div className="sales-table">
				<div className="header-row">
					<div className="teamMember-column">Team Member</div>
					<div className="position-column">Position</div>
					<div className="totals-column">Totals</div>
				</div>
			</div>
		</div>
	);
};

export default WeeklyTotals;
