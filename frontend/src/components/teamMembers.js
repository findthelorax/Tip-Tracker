import React, { useState, useEffect, useContext, useMemo } from 'react';
import { TeamContext } from '../contexts/TeamContext';
import { getTeamMembers } from '../utils/api';
import { Box, Grid } from '@mui/material';
import { DailyTotalsContext } from '../contexts/DailyTotalsContext';
import { addTeamMemberToTeam, deleteTeamMemberFromTeam } from '../utils/functions';
import TeamMemberFormRender from '../sections/teamMembers/teamMembersForm';
import TeamMembersRender from '../sections/teamMembers/teamMembersListRender';

const POSITIONS = ['bartender', 'host', 'server', 'runner'];

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
					<TeamMemberFormRender
						teamMemberName={teamMemberName}
						setTeamMemberName={setTeamMemberName}
						position={position}
						setPosition={setPosition}
						addMember={addMember}
					/>
					<TeamMembersRender teamByPosition={teamByPosition} deleteMember={deleteMember} />
				</Grid>
			</Grid>
		</Box>
	);
}

export default TeamOperations;
