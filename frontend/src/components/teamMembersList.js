import React, { useEffect, useContext, useMemo } from 'react';
import { TeamContext } from '../contexts/TeamContext';
import { getTeamMembers } from '../utils/api';
import { DailyTotalsContext } from '../contexts/DailyTotalsContext';
import { deleteTeamMemberFromTeam } from '../utils/functions';
import TeamMembersRender from '../sections/teamMembers/teamMembersListRender';

const POSITIONS = ['bartender', 'host', 'server', 'runner'];

function TeamMembersList() {
	const { team, setTeam } = useContext(TeamContext);
	const { refreshDailyTotals } = useContext(DailyTotalsContext);
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

	return <TeamMembersRender teamByPosition={teamByPosition} deleteMember={deleteMember} />;
}

export default TeamMembersList;