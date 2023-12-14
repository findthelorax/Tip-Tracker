import React, { useContext } from 'react';
import { TextField, FormControl, InputLabel, Select, MenuItem, Button, Typography, Box } from '@material-ui/core';
// import { ErrorContext } from './contexts/ErrorContext';
import { DailyTotalsContext } from './contexts/DailyTotalsContext';
import { makeStyles } from '@material-ui/core/styles';
import { FormInputDate } from './utils/dateUtils';
import { NumericFormat } from 'react-number-format';

const useStyles = makeStyles((theme) => ({
	form: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		padding: theme.spacing(2),
		backgroundColor: '#f5f5f5',
		borderRadius: '5px',
	},
	input: {
		margin: theme.spacing(1),
	},
}));

function InputField({ id, value, onChange, label, type = 'number', parseValue = parseFloat }) {
    const classes = useStyles();

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
                className={classes.input}
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
            className={classes.input}
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

function TeamMemberSelect({ team, value = '', onChange }) {
	const { setSelectedTeamMember } = useContext(DailyTotalsContext);
	const handleTeamMemberSelect = (event) => {
		const selectedMember = team.find((member) => member._id === event.target.value);
		setSelectedTeamMember(selectedMember);
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

function DailyTotalsForm({
	team,
	dailyTotals,
	setDailyTotals,
	submitDailyTotals,
	selectedTeamMember,
	setSelectedTeamMember,
}) {
	const classes = useStyles();

	const handleDailyTotalsChange = (field, value) => {
		let updates = { [field]: value === '' ? 0 : value };

		setDailyTotals((prevDailyTotals) => ({
			...prevDailyTotals,
			...updates,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		await submitDailyTotals(dailyTotals, selectedTeamMember);
	};

	return (
		<form onSubmit={handleSubmit} className={classes.form}>
			<Typography variant="h5" gutterBottom>
				Daily Totals
			</Typography>
			<TeamMemberSelect team={team} value={selectedTeamMember._id} onChange={handleDailyTotalsChange} />
			<InputField
				id="date"
				value={dailyTotals.date || FormInputDate()}
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
