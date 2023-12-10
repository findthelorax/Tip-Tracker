import React, { useEffect } from 'react';
import axios from 'axios';
import submitDailyTotals from "./sumbitDailyTotals";

function DailyTotalsForm(props) {
	const { team, setTeam, dailyTotals, submitDailyTotals, refresh } = props;

	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(() => {
		axios
			.get(`${process.env.REACT_APP_SERVER_URL}/api/teamMembers`)
			.then((response) => {
				if (response.data.length > 0)
				setTeam(response.data);
				// updateTeam(response.data);
			})
			.catch((error) => console.error('Error:', error));
	}, [refresh, setTeam]);

	const handleDailyTotalsChange = (field, value) => {
		if (field === 'date') {
			// Format the date to match the server's format
			const formattedDate = new Date(value).toISOString().slice(0, 10);

			props.setDailyTotals((prevDailyTotals) => ({
				...prevDailyTotals,
				date: formattedDate,
			}));
		} else if (field === 'teamMember') {
			// Find the selected team member
			const selectedMember = team.find((member) => member.name === value);

			// Set team member and position
			props.setDailyTotals((prevDailyTotals) => ({
				...prevDailyTotals,
				teamMember: selectedMember ? selectedMember.name : '',
				position: selectedMember ? selectedMember.position : '',
			}));
		} else {
			props.setDailyTotals((prevDailyTotals) => ({
				...prevDailyTotals,
				[field]: value,
			}));
		}
	};
	
	const logData = () => {
		console.log('Input Box Data:', dailyTotals);
		console.log('Submit Data:', submitDailyTotals);
	};

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
					<option value="" disabled>Select Team Member</option>
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
					value={dailyTotals.date}
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
			<button onClick={logData}>Log Data</button>
			<button onClick={() => submitDailyTotals(dailyTotals)}>Submit Daily Totals</button>
		</div>
	);
}

export default DailyTotalsForm;