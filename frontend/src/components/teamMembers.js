import React, {
	useState,
	useEffect,
	useContext,
	useMemo,
	useCallback,
} from 'react';
import TeamMemberForm from './teamMemberForm';
import { TeamContext } from './contexts/TeamContext';
import { getTeamMembers, addTeamMember, deleteTeamMember } from './utils/api';
import { Card, CardContent, Typography, Button } from '@material-ui/core';

const POSITIONS = ['bartender', 'host', 'server', 'runner'];

const capitalizeFirstLetter = (string) =>
	string.charAt(0).toUpperCase() + string.slice(1);

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
				setTeam((prevTeam) =>
					prevTeam.filter((member) => member._id !== id)
				);
			} catch (error) {
				console.error('Error deleting team member:', error);
				alert('Failed to delete team member');
			}
		},
		[setTeam]
	);

	const handleDelete = useCallback((member) => {
		deleteTeamMemberFromTeam(member._id, member.teamMemberName, member.position);
	}, [deleteTeamMemberFromTeam]);

	return (
		<Card className="team-card">
			<CardContent>
				<TeamMemberForm
					teamMemberName={teamMemberName}
					setTeamMemberName={setTeamMemberName}
					position={position}
					setPosition={setPosition}
					addTeamMember={addTeamMemberToTeam}
				/>
				{POSITIONS.map((position) => (
					<div key={position}>
						<Typography variant="h5">
							{capitalizeFirstLetter(position)}s
						</Typography>
						{teamByPosition[position].map((member) => (
							<div key={member._id} className="member-card">
								<Typography variant="body1">
									{member.teamMemberName
										? capitalizeFirstLetter(
												member.teamMemberName
										  )
										: 'Unknown'}
								</Typography>{' '}
								- {member.position}
								<Button
									variant="contained"
									color="secondary"
									onClick={() => handleDelete(member)}
								>
									Delete
								</Button>
							</div>
						))}
					</div>
				))}
			</CardContent>
		</Card>
	);
}

export default TeamOperations;
