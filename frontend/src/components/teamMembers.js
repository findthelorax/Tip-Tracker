import React, { useState, useEffect, useContext, useMemo, useCallback } from 'react';
import TeamMemberForm from './teamMemberForm';
import { TeamContext } from './contexts/TeamContext';
import { getTeamMembers, addTeamMember, deleteTeamMember } from './utils/api';
import { Grid, Card, Paper, Text, Button } from '@mantine/core';

const POSITIONS = ['bartender', 'host', 'server', 'runner'];

const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);

function TeamOperations() {
	const { team, setTeam } = useContext(TeamContext);
	const [teamMemberName, setTeamMemberName] = useState('');

	const [position, setPosition] = useState('bartender');

	const clearInputs = () => {
		setTeamMemberName('');
		setPosition('server');
	};

	useEffect(() => {
		const fetchTeamMembers = async () => {
			try {
				const teamMembers = await getTeamMembers();
				setTeam(teamMembers);
			} catch (error) {
				console.error('Error fetching team members:', error);
			}
		};

		fetchTeamMembers();
	}, [setTeam]);

	const teamByPosition = useMemo(() => {
		const teamByPosition = POSITIONS.reduce((acc, position) => {
			acc[position] = [];
			return acc;
		}, {});

		team.forEach((member) => {
			teamByPosition[member.position].push(member);
		});

		return Object.fromEntries(
			Object.entries(teamByPosition).map(([position, members]) => [
				position,
				[...members].sort((a, b) => {
					// Check if teamMemberName exists before comparing
					if (a.teamMemberName && b.teamMemberName) {
						return a.teamMemberName.localeCompare(b.teamMemberName);
					} else {
						// If teamMemberName doesn't exist, don't compare
						return 0;
					}
				}),
			])
		);
	}, [team]);

	const addTeamMemberToTeam = useCallback(async () => {
		if (teamMemberName && position) {
			try {
				const newMember = await addTeamMember(teamMemberName, position);
				setTeam((prevTeam) => [...prevTeam, newMember]);
				clearInputs();
			} catch (error) {
				console.error('Error adding team member:', error);
				alert('Failed to add team member');
			}
		} else {
			alert('Please enter both name and position');
		}
	}, [teamMemberName, position, setTeam]);

	const deleteTeamMemberFromTeam = useCallback(
		async (id, teamMemberName, position) => {
			const confirmation = window.confirm(
				`ARE YOU SURE YOU WANT TO DELETE:\n\n${
					teamMemberName ? teamMemberName.toUpperCase() : 'Unknown'
				} - ${position}?`
			);
			if (!confirmation) {
				return;
			}

			try {
				await deleteTeamMember(id);
				setTeam((prevTeam) => prevTeam.filter((member) => member._id !== id));
			} catch (error) {
				console.error('Error deleting team member:', error);
				alert('Failed to delete team member');
			}
		},
		[setTeam]
	);

	const handleDelete = useCallback(
		(member) => {
			deleteTeamMemberFromTeam(member._id, member.teamMemberName, member.position);
		},
		[deleteTeamMemberFromTeam]
	);

	return (
		<Paper
			padding="md"
			style={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
		>
			<TeamMemberForm
				teamMemberName={teamMemberName}
				setTeamMemberName={setTeamMemberName}
				position={position}
				setPosition={setPosition}
				addTeamMember={addTeamMemberToTeam}
			/>
			{POSITIONS.map((position) => (
				<div key={position}>
					<Text size="xl">{capitalizeFirstLetter(position)}s</Text>
					<Grid gutter="md">
						{teamByPosition[position].map((member) => (
							<Grid.Col
								span={12}
								key={member._id}
								style={{
									marginBottom: '1rem',
									display: 'flex',
									justifyContent: 'space-between',
									alignItems: 'center',
								}}
							>
								<Text>
									{member.teamMemberName ? capitalizeFirstLetter(member.teamMemberName) : 'Unknown'}
								</Text>{' '}
								- {member.position}
								<Button color="red" onClick={() => handleDelete(member)}>
									Delete
								</Button>
							</Grid.Col>
						))}
					</Grid>
				</div>
			))}
		</Paper>
	);
}

export default TeamOperations;
