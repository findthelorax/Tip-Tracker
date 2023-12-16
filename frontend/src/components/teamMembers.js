import React, { useState, useEffect, useContext, useMemo } from 'react';
import TeamMemberForm from './teamMemberForm';
import { TeamContext } from './contexts/TeamContext';
import { getTeamMembers } from './utils/api';
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
import { DailyTotalsContext } from './contexts/DailyTotalsContext';
import { addTeamMemberToTeam, deleteTeamMemberFromTeam } from './utils/functions';

const POSITIONS = ['bartender', 'host', 'server', 'runner'];

const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);

function TeamOperations() {
	const { team, setTeam } = useContext(TeamContext);
	const [teamMemberName, setTeamMemberName] = useState('');
	const [position, setPosition] = useState('bartender');
	const { refreshDailyTotals } = useContext(DailyTotalsContext);
	const clearInputs = () => {
		setTeamMemberName('');
		setPosition('server');
	};
	const addMember = addTeamMemberToTeam(teamMemberName, position, setTeam, clearInputs);
	const deleteMember = deleteTeamMemberFromTeam(setTeam);

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
	}, [setTeam, refreshDailyTotals]);

	const teamByPosition = useMemo(() => {
		const teamByPosition = POSITIONS.reduce((acc, position) => {
			acc[position] = [];
			return acc;
		}, {});

		teamByPosition['other'] = [];

		team.forEach((member) => {
			if (member.position && teamByPosition.hasOwnProperty(member.position)) {
				teamByPosition[member.position].push(member);
			} else {
				teamByPosition['other'].push(member);
			}
		});
		console.log('🚀 ~ file: teamMembers.js:61 ~ team.forEach ~ team:', team);
		console.log('🚀 ~ file: teamMembers.js:61 ~ team.forEach ~ teamByPosition:', teamByPosition);

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

	return (
		<Box sx={{ flexGrow: 1, maxWidth: 752 }}>
			<Grid container spacing={2}>
				<Grid item xs={12} md={6}>
					<TeamMemberForm
						teamMemberName={teamMemberName}
						setTeamMemberName={setTeamMemberName}
						position={position}
						setPosition={setPosition}
						addTeamMember={addMember}
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
															onClick={() =>
																deleteMember(
																	member._id,
																	member.teamMemberName,
																	member.position
																)
															}
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
