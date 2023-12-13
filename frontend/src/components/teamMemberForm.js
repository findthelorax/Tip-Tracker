import React from 'react';
import {
	TextField,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Button,
	Box,
} from '@material-ui/core';

const POSITIONS = ['Bartender', 'Runner', 'Server', 'Host'];

function TeamMemberForm({
	teamMemberName,
	setTeamMemberName,
	position,
	setPosition,
	addTeamMember,
}) {
	const handleSubmit = (event) => {
		event.preventDefault();
		addTeamMember();
	};

	return (
		<form onSubmit={handleSubmit}>
			<TextField
				id="teamMemberName"
				label="Name"
				placeholder="Enter name"
				value={teamMemberName}
				onChange={(e) => setTeamMemberName(e.target.value)}
				fullWidth
				margin="normal"
			/>
			<FormControl fullWidth margin="normal">
				<InputLabel id="position">Position</InputLabel>
				<Select
					labelId="position"
					id="position"
					value={position}
					onChange={(e) => setPosition(e.target.value)}
				>
					<MenuItem value="" disabled>
						Select a position
					</MenuItem>
					{POSITIONS.map((position) => (
						<MenuItem key={position} value={position.toLowerCase()}>
							{position}
						</MenuItem>
					))}
				</Select>
			</FormControl>
			<Box mt={2}>
				<Button variant="contained" color="primary" type="submit">
					Add to Team
				</Button>
			</Box>
		</form>
	);
}

export default TeamMemberForm;
