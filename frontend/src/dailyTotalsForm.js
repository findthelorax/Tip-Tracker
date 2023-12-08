import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DailyTotalsForm({
	dailyTotals,
	submitDailyTotals,
}) {
	const [team, setTeam] = useState([]);

	useEffect(() => {
		axios
			.get(`${process.env.REACT_APP_SERVER_URL}/api/teamMembers`)
			.then((response) => {
				console.log('Team:', response.data);
				if (response.data.length > 0) {
					console.log('First member:', response.data[0]);
				}
				setTeam(response.data);
			})
			.catch((error) => console.error('Error:', error));
	}, []);

	return (
		<div>
			<h2>Daily Totals</h2>
			<div>
				<label htmlFor="teamMember">Team Member:</label>
				<select
					id="teamMember"
					value={dailyTotals.teamMember}
					onChange={(e) =>
						handleDailyTotalsChange('teamMember', e.target.value)
					}
				>
					<option value="">Select Team Member</option>
					{team.map((member) => (
						<option key={member._id} value={member.name}>
							{`${member.name} - ${member.position}`}
						</option>
					))}
				</select>
			</div>
			<div>
				<label htmlFor="date">Date:</label>
				<input
					type="date"
					id="date"
					value={new Date().toISOString().split('T')[0]}
					onChange={(e) =>
						handleDailyTotalsChange('date', e.target.value)
					}
				/>
			</div>

			<div>
				<label htmlFor="foodSales">Food Sales:</label>
				<input
					type="number"
					id="foodSales"
					value={dailyTotals.foodSales}
					onChange={(e) =>
						handleDailyTotalsChange(
							'foodSales',
							parseFloat(e.target.value)
						)
					}
				/>
			</div>
			<div>
				<label htmlFor="barSales">Bar Sales:</label>
				<input
					type="number"
					id="barSales"
					value={dailyTotals.barSales}
					onChange={(e) =>
						handleDailyTotalsChange(
							'barSales',
							parseFloat(e.target.value)
						)
					}
				/>
			</div>
			<div>
				<label htmlFor="nonCashTips">Non-Cash Tips:</label>
				<input
					type="number"
					id="nonCashTips"
					value={dailyTotals.nonCashTips}
					onChange={(e) =>
						handleDailyTotalsChange(
							'nonCashTips',
							parseFloat(e.target.value)
						)
					}
				/>
			</div>
			<div>
				<label htmlFor="cashTips">Cash Tips:</label>
				<input
					type="number"
					id="cashTips"
					value={dailyTotals.cashTips}
					onChange={(e) =>
						handleDailyTotalsChange(
							'cashTips',
							parseFloat(e.target.value)
						)
					}
				/>
			</div>
			<button onClick={submitDailyTotals}>Submit Daily Totals</button>
		</div>
	);
}

export default DailyTotalsForm;