import React, { useContext } from 'react';
import { TextField, FormControl, InputLabel, Select, MenuItem, Button, Typography, Card } from '@mui/material';
import { NumericFormat } from 'react-number-format';
import { Box } from '@mui/system';
import { DailyTotalsContext } from '../../contexts/DailyTotalsContext';

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
	console.log("🚀 ~ file: dailyTotalsFormRender.js:47 ~ TeamMemberSelect ~ team:", team)
	console.log("🚀 ~ file: dailyTotalsFormRender.js:47 ~ TeamMemberSelect ~ value:", value)
	const { setSelectedTeamMember } = useContext(DailyTotalsContext);
	const handleTeamMemberSelect = (event) => {
		const selectedMember = team.find((member) => member._id === event.target.value);
        onChange('teamMemberId', selectedMember._id);
		setSelectedTeamMember(selectedMember);
		console.log("🚀 ~ file: dailyTotalsFormRender.js:50 ~ handleTeamMemberSelect ~ selectedMember:", selectedMember)
			console.log("🚀 ~ file: dailyTotalsFormRender.js:50 ~ handleTeamMemberSelect ~ selectedMember._id:", selectedMember._id)
	};
	return (
		<FormControl fullWidth margin="normal">
			<InputLabel id="teamMemberSelectName">Team Member</InputLabel>
			<Select
				labelId="teamMemberSelectName"
				id="teamMemberSelectName"
                value={value ? value._id : ''}
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
	console.log("🚀 ~ file: dailyTotalsFormRender.js:79 ~ selectedTeamMember:", selectedTeamMember)
	console.log("🚀 ~ file: dailyTotalsFormRender.js:79 ~ team:", team)
	console.log("🚀 ~ file: dailyTotalsFormRender.js:79 ~ dailyTotals:", dailyTotals)
	return (
		<Card>
			<Box
				component="form"
				onSubmit={handleSubmit}
				autoComplete="off"
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