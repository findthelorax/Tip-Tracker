import React from 'react';

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
		<form className="input-card" onSubmit={handleSubmit}>
			<label htmlFor="name">Name:</label>
			<input
				type="text"
				id="teamMemberName"
				placeholder="Enter name"
				value={teamMemberName}
				onChange={(e) => setTeamMemberName(e.target.value)}
			/>
			<label htmlFor="position">Position:</label>
			<select
				id="position"
				value={position}
				onChange={(e) => setPosition(e.target.value)}
			>
				<option value="" disabled>Select a position</option>
				{POSITIONS.map((position) => (
					<option key={position} value={position.toLowerCase()}>{position}</option>
				))}
			</select>
			<button type="submit">Add to Team</button>
		</form>
	);
};

export default TeamMemberForm;