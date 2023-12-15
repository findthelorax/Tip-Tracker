import React, { useState } from 'react';
import {
	TextField,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Grid,
	Card,
	CardContent,
	Typography,
	Skeleton,
	Box,
} from '@mui/material';

function SettingsPage() {
	const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
	const [currency, setCurrency] = useState('USD');

	const handleTimezoneChange = (event) => {
		setTimezone(event.target.value);
		// Save the timezone to context or local storage here
	};

	const handleCurrencyChange = (event) => {
		setCurrency(event.target.value);
		// Save the currency to context or local storage here
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
		</Box>
	);
}

export default SettingsPage;
