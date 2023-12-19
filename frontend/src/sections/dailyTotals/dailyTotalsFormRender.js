import React from 'react';
import { TextField, FormControl, InputLabel, Select, MenuItem, Button, Typography, Card } from '@mui/material';
import { NumericFormat } from 'react-number-format';
import { Box } from '@mui/system';

export function InputField({ id, value = '', onChange, label, type = 'number', parseValue = parseFloat }) {
	if (type === 'date') {
		return (
			<TextField
				id={id}
				label={label}
				type={type}
				value={value}
				onChange={(event) => onChange(id, event.target.value)}
				fullWidth
				margin="normal"
				sx={{ margin: 1 }}
				InputLabelProps={{
					shrink: true,
				}}
			/>
		);
	}

	return (
		<NumericFormat
			id={id}
			label={label}
			value={value}
			onValueChange={(values) => onChange(id, parseValue(values.value))}
			fullWidth
			margin="normal"
			sx={{ margin: 1 }}
			customInput={TextField}
			thousandSeparator={true}
			prefix="$"
			inputProps={{
				onFocus: (event) => event.target.select(),
			}}
			placeholder="0"
		/>
	);
}

export function TeamMemberSelect({ team, value = '', onChange }) {
	const handleTeamMemberSelect = (event) => {
		const selectedMember = team.find((member) => member._id === event.target.value);
		onChange('teamMemberID', selectedMember ? selectedMember._id : '');
	};
	return (
		<FormControl fullWidth margin="normal">
			<InputLabel id="teamMemberSelectName">Team Member</InputLabel>
			<Select
				labelId="teamMemberSelectName"
				id="teamMemberSelectName"
				value={value}
				onChange={handleTeamMemberSelect}
			>
				<MenuItem value="" disabled>
					Select Team Member
				</MenuItem>
				{team.map((member) => (
					<MenuItem key={member._id} value={member._id}>
						{`${member.teamMemberName} - ${member.position}`}
					</MenuItem>
				))}
			</Select>
		</FormControl>
	);
}

export function DailyTotalsFormRender({
	team,
	dailyTotals,
	handleDailyTotalsChange,
	handleSubmit,
	selectedTeamMember,
}) {
	return (
		<Card>
			<Box
				component="form"
				onSubmit={handleSubmit}
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					padding: 2,
					backgroundColor: '#f5f5f5',
					borderRadius: '5px',
				}}
			>
				<Typography variant="h5" gutterBottom>
					Daily Totals
				</Typography>
				<TeamMemberSelect team={team} value={selectedTeamMember || ''} onChange={handleDailyTotalsChange} />
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
				</Box>
			</Box>
		</Card>
	);
}
