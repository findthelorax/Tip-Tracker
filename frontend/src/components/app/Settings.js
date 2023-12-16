import React, { useState } from 'react';
import {
	TextField,
	FormControl,
	InputLabel,
	Select,
	Grid,
	Card,
	CardContent,
	Typography,
	Skeleton,
	Box,
} from '@mui/material';
import { updateTipOutPercentages } from '../utils/utils';

function SettingsPage({ user }) {
	const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
	const [currency, setCurrency] = useState('USD');
	const [bartenderTipOut, setBartenderTipOut] = useState(0.05);
	const [runnerTipOut, setRunnerTipOut] = useState(0.04);
	const [hostTipOut, setHostTipOut] = useState(0.015);

	const handleTimezoneChange = (event) => {
		setTimezone(event.target.value);
		// Save the timezone to context or local storage here
	};

	const handleCurrencyChange = (event) => {
		setCurrency(event.target.value);
		// Save the currency to context or local storage here
	};

	const handleTipOutChange = (event) => {
		const { name, value } = event.target;
		if (name === 'bartender') setBartenderTipOut(value);
		else if (name === 'runner') setRunnerTipOut(value);
		else if (name === 'host') setHostTipOut(value);

		updateTipOutPercentages({
			bartender: bartenderTipOut,
			runner: runnerTipOut,
			host: hostTipOut,
		});
	};

	return (
		<Box
			sx={{
				backgroundColor: 'lightblue',
				border: '1px solid black',
				boxShadow: '5px 5px 0px 0px black',
				borderRadius: '15px',
			}}
		>
			<Grid container>
				<Grid item xs={6}>
					<Card
						sx={{
							m: 2,
							backgroundColor: 'lightblue',
							border: '1px solid black',
							boxShadow: '5px 5px 0px 0px black',
							borderRadius: '15px',
						}}
					>
						<CardContent>
							<Typography variant="h5">Stats Card 1</Typography>
							<Skeleton variant="rectangular" width={210} height={118} />
						</CardContent>
					</Card>
				</Grid>
				<Grid item xs={6}>
					<Card
						sx={{
							m: 2,
							backgroundColor: 'lightblue',
							border: '1px solid black',
							boxShadow: '5px 5px 0px 0px black',
							borderRadius: '15px',
						}}
					>
						<CardContent>
							<Typography variant="h5">Stats Card 2</Typography>
							<Skeleton variant="rectangular" width={210} height={118} />
						</CardContent>
					</Card>
				</Grid>
			</Grid>
			<FormControl>
				<InputLabel id="timezone-select-label">Timezone</InputLabel>
				<Select
					labelId="timezone-select-label"
					id="timezone-select"
					value={timezone}
					onChange={handleTimezoneChange}
				>
					{/* Map over the timezones here and create a MenuItem for each one */}
				</Select>
			</FormControl>
			<FormControl>
				<InputLabel id="currency-select-label">Currency</InputLabel>
				<Select
					labelId="currency-select-label"
					id="currency-select"
					value={currency}
					onChange={handleCurrencyChange}
				>
					{/* Map over the currencies here and create a MenuItem for each one */}
				</Select>
			</FormControl>
			{user.role === 'manager' || user.role === 'root' ? (
				<>
					<FormControl>
						<TextField
							label="Bartender Tip Out Percentage"
							name="bartender"
							value={bartenderTipOut}
							onChange={handleTipOutChange}
						/>
					</FormControl>
					<FormControl>
						<TextField
							label="Runner Tip Out Percentage"
							name="runner"
							value={runnerTipOut}
							onChange={handleTipOutChange}
						/>
					</FormControl>
					<FormControl>
						<TextField
							label="Host Tip Out Percentage"
							name="host"
							value={hostTipOut}
							onChange={handleTipOutChange}
						/>
					</FormControl>
				</>
			) : null}
		</Box>
	);
}

export default SettingsPage;
