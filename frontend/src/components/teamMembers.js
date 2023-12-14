import React, { useState, useEffect, useContext, useMemo, useCallback } from 'react';
import TeamMemberForm from './teamMemberForm';
import { TeamContext } from './contexts/TeamContext';
import { getTeamMembers, addTeamMember, deleteTeamMember } from './utils/api';
import {
	Card,
	CardContent,
	Box,
	Grid,
	ListItem,
	ListItemAvatar,
	Avatar,
	ListItemText,
	IconButton,
	Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import FolderIcon from '@mui/icons-material/Folder';

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

	return (
		<Box sx={{ flexGrow: 1, maxWidth: 752 }}>
			<Grid container spacing={2}>
				<Grid item xs={12} md={6}>
					<TeamMemberForm
						teamMemberName={teamMemberName}
						setTeamMemberName={setTeamMemberName}
						position={position}
						setPosition={setPosition}
						addTeamMember={addTeamMemberToTeam}
					/>
					<Card
						sx={{
							minWidth: 275,
							marginBottom: 2,
							backgroundColor: 'lightblue',
							border: '1px solid black',
							boxShadow: '2px 2px 0px 0px black',
							borderRadius: '15px',
						}}
					>
						<CardContent>
							{POSITIONS.map((position) => (
								<Box key={position} sx={{ marginBottom: 2 }}>
									<Card
										sx={{
											backgroundColor: 'white',
											border: '1px solid black',
											boxShadow: '2px 2px 0px 0px black',
											borderRadius: '15px',
										}}
									>
										<CardContent>
											<Typography variant="h6" component="div">
												{capitalizeFirstLetter(position)}
											</Typography>
											{teamByPosition[position].map((member) => (
												<ListItem
													key={member._id}
													secondaryAction={
														<IconButton
															edge="end"
															aria-label="delete"
															onClick={() => deleteTeamMemberFromTeam(member._id)}
														>
															<DeleteIcon />
														</IconButton>
													}
												>
													<ListItemAvatar>
														<Avatar>
															<FolderIcon />
														</Avatar>
													</ListItemAvatar>
													<ListItemText
														primary={
															member.teamMemberName
																? capitalizeFirstLetter(member.teamMemberName)
																: 'Unknown'
														}
														secondary={member.position}
													/>
												</ListItem>
											))}
										</CardContent>
									</Card>
								</Box>
							))}
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		</Box>
	);
}
export default TeamOperations;
