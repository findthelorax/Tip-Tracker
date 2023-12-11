import React from 'react';

function InputField({ id, value, onChange, label, type = 'number', parseValue = parseFloat }) {
	return (
		<div>
			<label htmlFor={id}>{label}:</label>
			<input
				type={type}
				id={id}
				value={value}
				onChange={(e) => onChange(id, parseValue(e.target.value))}
			/>
		</div>
	);
}

function TeamMemberSelect({ team, value, onChange }) {
	return (
		<div>
			<label htmlFor="teamMemberName">Team Member:</label>
			<select
				id="teamMemberName"
				value={value}
				onChange={(e) => onChange('teamMemberName', e.target.value)}
			>
				<option value="" disabled>Select Team Member</option>
				{team.map((member) => (
					<option key={member._id} value={member.teamMemberName}>
						{`${member.teamMemberName} - ${member.position}`}
					</option>
				))}
			</select>
		</div>
	);
}

function DailyTotalsForm({ team, dailyTotals, setDailyTotals, submitDailyTotals }) {
	const handleDailyTotalsChange = (field, value) => {
		let updates = { [field]: value };

		if (field === 'teamMemberName') {
			const selectedMember = team.find((member) => member.teamMemberName === value);
			updates = {
				teamMemberName: selectedMember ? selectedMember.teamMemberName : '',
				position: selectedMember ? selectedMember.position : '',
			};
		}
		setDailyTotals((prevDailyTotals) => ({ ...prevDailyTotals, ...updates }));
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		submitDailyTotals(dailyTotals);
	};

	return (
		<form onSubmit={handleSubmit}>
			<h2>Daily Totals</h2>
			<TeamMemberSelect
				team={team}
				value={dailyTotals.teamMemberName}
				onChange={handleDailyTotalsChange}
			/>
			<InputField
				id="date"
				value={dailyTotals.date}
				onChange={handleDailyTotalsChange}
				label="Date"
				type="date"
				parseValue={(value) => value}
			/>
			<InputField
				id="foodSales"
				value={dailyTotals.foodSales}
				onChange={handleDailyTotalsChange}
				label="Food Sales"
			/>
			<InputField
				id="barSales"
				value={dailyTotals.barSales}
				onChange={handleDailyTotalsChange}
				label="Bar Sales"
			/>
			<InputField
				id="nonCashTips"
				value={dailyTotals.nonCashTips}
				onChange={handleDailyTotalsChange}
				label="Non-Cash Tips"
			/>
			<InputField
				id="cashTips"
				value={dailyTotals.cashTips}
				onChange={handleDailyTotalsChange}
				label="Cash Tips"
			/>
			<button type="submit">Submit Daily Totals</button>
		</form>
	);
}

export default DailyTotalsForm;