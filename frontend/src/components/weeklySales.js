import React, { useState, useEffect } from 'react';
import axios from 'axios';

function WeeklyTotals() {
	const [weeklyTotals, setWeeklyTotals] = useState([]);

	const handleWeeklyTotalsChange = (field, value) => {
		setWeeklyTotals({
			...weeklyTotals,
			[field]: value,
		});
	};

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
