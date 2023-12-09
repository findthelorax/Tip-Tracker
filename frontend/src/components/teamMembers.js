import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TeamMemberForm from './teamMemberForm';

function TeamOperations() {
	const [team, setTeam] = useState([]);
	const [name, setName] = useState('');
	const [position, setPosition] = useState('bartender');
	const clearInputs = () => {
		setName('');
		setPosition('server');
	};

	useEffect(() => {
		fetchTeamMembers();
		displayTeam();
	}, []);

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
			} catch (error) {
				console.error('Error adding team member:', error);
				alert('Failed to add team member');
			}
		} else {
			alert('Please enter both name and position');
		}
	};

	const displayTeam = async () => {
		try {
			const response = await axios.get(
				`${process.env.REACT_APP_SERVER_URL}/api/teamMembers`
			);
			setTeam(response.data);
		} catch (error) {
			console.error('Error fetching team members:', error);
			alert(`Failed to fetch team members: ${error.message}`);
		}
	};

	const fetchTeamMembers = async () => {
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
			{team.map((member) => (
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
	);
};

export default TeamOperations;