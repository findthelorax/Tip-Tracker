import React, { useEffect, useContext } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { TeamContext } from '../contexts/TeamContext';
import { getTeamMembers } from '../utils/api';
import { Box, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { addTeamMemberToTeam, deleteTeamMemberFromTeam } from '../utils/functions';

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
					onClick={() => deleteMember(member._id, member.teamMemberName, member.position)}
				>
					<DeleteIcon />
				</IconButton>
			),
		},
	];
	return (
		<Box sx={{ height: 400, width: '100%' }}>
			<DataGrid
				rows={team}
				columns={columns}
				pageSize={5}
				rowsPerPageOptions={[5]}
				getRowId={(row) => row._id}
				getRowClassName={(params) => (params.rowIndex % 2 === 0 ? 'datagrid-row-even' : 'datagrid-row-odd')}
				pagination
			/>
		</Box>
	);
}

export default TeamMembersPage;
