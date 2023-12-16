import React, { useEffect, useContext, useState, useMemo } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { TeamContext } from '../contexts/TeamContext';
import { DailyTotalsContext } from '../contexts/DailyTotalsContext';
import { getTeamMembers } from '../utils/api';
import {
	Box,
	IconButton,
	Grid,
	Card,
	CardContent,
	Typography,
	ListItem,
	ListItemAvatar,
	Avatar,
	ListItemText,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import FolderIcon from '@mui/icons-material/Folder';
import { addTeamMemberToTeam, deleteTeamMemberFromTeam } from '../utils/functions';
import TeamMemberForm from '../teamMemberForm';

const POSITIONS = ['bartender', 'host', 'server', 'runner'];

const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);

function TeamMembersPage() {
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
	}, [setTeam]);

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

		return Object.fromEntries(
			Object.entries(teamByPosition).map(([position, members]) => [
				position,
				[...members].sort((a, b) => {
					if (a.teamMemberName && b.teamMemberName) {
						return a.teamMemberName.localeCompare(b.teamMemberName);
					} else {
						return 0;
					}
				}),
			])
		);
	}, [team]);
	const columns = [
		{ field: 'teamMemberName', headerName: 'Name', width: 130 },
		{ field: 'position', headerName: 'Position', width: 130 },
		{ field: 'address', headerName: 'Address', width: 200 },
		{ field: 'phoneNumber', headerName: 'Phone Number', width: 130 },
		{
			field: 'delete',
			headerName: 'Delete',
			width: 130,
			renderCell: (params) => (
				<IconButton
					edge="end"
					aria-label="delete"
					onClick={() => deleteMember(params.row._id, params.row.teamMemberName, params.row.position)}
				>
					<DeleteIcon />
				</IconButton>
			),
		},
	];

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
														deleteMember(member._id, member.teamMemberName, member.position)
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
					<Box sx={{ height: 400, width: '100%' }}>
						<DataGrid
							rows={team}
							columns={columns}
							pageSize={5}
							rowsPerPageOptions={[5]}
							getRowId={(row) => row._id}
							getRowClassName={(params) =>
								params.rowIndex % 2 === 0 ? 'datagrid-row-even' : 'datagrid-row-odd'
							}
							pagination
						/>
					</Box>
				</Grid>
			</Grid>
		</Box>
	);
}

export default TeamMembersPage;
