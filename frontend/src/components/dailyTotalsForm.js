import React from 'react';
import {
	TextField,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Button,
	Typography,
	Box,
} from '@material-ui/core';

function InputField({
	id,
	value,
	onChange,
	label,
	type = 'number',
	parseValue = parseFloat,
}) {
	return (
		<TextField
			type={type}
			id={id}
			label={label}
			value={value}
			onChange={(e) => onChange(id, parseValue(e.target.value))}
			fullWidth
			margin="normal"
		/>
	);
}

function TeamMemberSelect({ team, value, onChange }) {
	return (
		<FormControl fullWidth margin="normal">
			<InputLabel id="teamMemberName">Team Member</InputLabel>
			<Select
				labelId="teamMemberName"
				id="teamMemberName"
				value={value}
				onChange={(e) => onChange('teamMemberName', e.target.value)}
			>
				<MenuItem value="" disabled>
					Select Team Member
				</MenuItem>
				{team.map((member) => (
					<MenuItem key={member._id} value={member.teamMemberName}>
						{`${member.teamMemberName} - ${member.position}`}
					</MenuItem>
				))}
			</Select>
		</FormControl>
	);
}

function DailyTotalsForm({
	team,
	dailyTotals,
	setDailyTotals,
	submitDailyTotals,
}) {
	const handleDailyTotalsChange = (field, value) => {
		let updates = { [field]: value };

		if (field === 'teamMemberName') {
			const selectedMember = team.find(
				(member) => member.teamMemberName === value
			);
			updates = {
				teamMemberName: selectedMember
					? selectedMember.teamMemberName
					: '',
				position: selectedMember ? selectedMember.position : '',
			};
		}
		setDailyTotals((prevDailyTotals) => ({
			...prevDailyTotals,
			...updates,
		}));
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		submitDailyTotals(dailyTotals);
	};

	return (
		<form onSubmit={handleSubmit}>
			<Typography variant="h5" gutterBottom>
				Daily Totals
			</Typography>
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
			<Box mt={2}>
				<Button variant="contained" color="primary" type="submit">
					Submit Daily Totals
				</Button>
			</Box>{' '}
		</form>
	);
}

export default DailyTotalsForm;
