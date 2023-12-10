import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import TeamMemberForm from './teamMemberForm';
import { TeamContext } from './teamContext';

export const fetchTeamMembers = async (setTeam) => {
	try {
		const response = await axios.get(
			`${process.env.REACT_APP_SERVER_URL}/api/teamMembers`
		);
		setTeam(response.data);
	} catch (error) {
		console.error('Error fetching team members:', error);
		alert('Failed to fetch team members');
	}
};

function TeamOperations({ refresh, setRefresh }) {
	const { team, setTeam } = useContext(TeamContext);
	const [name, setName] = useState('');
	const [position, setPosition] = useState('bartender');
	const clearInputs = () => {
		setName('');
		setPosition('server');
	};

	useEffect(() => {
		fetchTeamMembers(setTeam);
	}, [refresh]);

	const addTeamMember = async () => {
		if (name && position) {
			try {
				const response = await axios.post(
					`${process.env.REACT_APP_SERVER_URL}/api/teamMembers`,
					{ name, position }
				);
				setTeam([...team, response.data]);
				console.log(response.data);
				clearInputs();
				await fetchTeamMembers();
			} catch (error) {
				console.error('Error adding team member:', error);
				alert('Failed to add team member');
			}
		} else {
			alert('Please enter both name and position');
		}
	};

	const deleteTeamMember = async (id, name, position) => {
		const confirmation = window.confirm(
			`ARE YOU SURE YOU WANT TO DELETE:\n\n${name.toUpperCase()}	-	${position}?`
		);
		if (!confirmation) {
			return;
		}

		try {
			// Send a DELETE request to the server to delete the team member by ID
			await axios.delete(
				`${process.env.REACT_APP_SERVER_URL}/api/teamMembers/${id}`
			);
			// Remove the deleted team member from the local state
			setTeam((prevTeam) =>
				prevTeam.filter((member) => member._id !== id)
			);
		} catch (error) {
			console.error('Error deleting team member:', error);
			alert('Failed to delete team member');
		}
	};

	return (
		<div className="team-card">
			<TeamMemberForm
				name={name}
				position={position}
				setName={setName}
				setPosition={setPosition}
				addTeamMember={addTeamMember}
			/>
			{['bartender', 'host', 'server', 'runner'].map((position) => (
				<div key={position}>
					<h2>{position.charAt(0).toUpperCase() + position.slice(1)}s</h2>
					{[...team]
						.filter((member) => member.position === position)
						.sort((a, b) => a.name.localeCompare(b.name))
						.map((member) => (
							<div key={member._id} className="member-card">
								<strong>
									{member.name.charAt(0).toUpperCase() +
										member.name.slice(1)}
								</strong>{' '}
								- {member.position}
								<button
									onClick={() =>
										deleteTeamMember(
											member._id,
											member.name,
											member.position
										)
									}
								>
									Delete
								</button>
							</div>
						))}
				</div>
			))}
		</div>
	);
};

export default TeamOperations;