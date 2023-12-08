import React from 'react';

function TeamMemberForm({
	name,
	position,
	setName,
	setPosition,
	addTeamMember,
}) {
	return (
		<div className="input-card">
			<label htmlFor="name">Name:</label>
			<input
				type="text"
				id="name"
				placeholder="Enter name"
				value={name}
				onChange={(e) => setName(e.target.value)}
			/>
			<label htmlFor="position">Position:</label>
			<select
				id="position"
				value={position}
				onChange={(e) => setPosition(e.target.value)}
			>
				<option value="bartender">Bartender</option>
				<option value="runner">Runner</option>
				<option value="server">Server</option>
				<option value="host">Host</option>
			</select>
			<button onClick={addTeamMember}>Add to Team</button>
		</div>
	);
};

export default TeamMemberForm;