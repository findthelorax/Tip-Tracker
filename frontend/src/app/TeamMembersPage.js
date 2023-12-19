import React, { useEffect, useContext, useState, useMemo } from 'react';
import { TeamContext } from '../contexts/TeamContext';
// import { DailyTotalsContext } from '../contexts/DailyTotalsContext';
import { getTeamMembers } from '../utils/api';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { addTeamMemberToTeam, deleteTeamMemberFromTeam } from '../logic/teamMembersLogic';
import TeamMembersPageRender from '../sections/teamMembers/teamMembersPageRender';

const POSITIONS = ['bartender', 'host', 'server', 'runner'];

function TeamMembersPage() {
	const { team, setTeam } = useContext(TeamContext);
	const [teamMemberName, setTeamMemberName] = useState('');
	const [position, setPosition] = useState('bartender');
	// const { refreshDailyTotals } = useContext(DailyTotalsContext);
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
		<TeamMembersPageRender
			teamMemberName={teamMemberName}
			setTeamMemberName={setTeamMemberName}
			position={position}
			setPosition={setPosition}
			addMember={addMember}
			deleteMember={deleteMember}
			teamByPosition={teamByPosition}
			team={team}
			columns={columns}
		/>
	);
}

export default TeamMembersPage;
