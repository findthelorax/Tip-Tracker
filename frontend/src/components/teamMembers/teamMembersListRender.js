import * as React from 'react';
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import { IconButton, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);

function CustomToolbar() {
    return (
        <GridToolbarContainer>
            <GridToolbarExport />
        </GridToolbarContainer>
    );
}

function TeamMembersRender({ teamByPosition, deleteMember }) {
	const columns = [
		{ field: 'teamMemberName', headerName: 'Name', width: 130 },
		{ field: 'position', headerName: 'Position', width: 130 },
		{ field: 'phoneNumber', headerName: 'Phone Number', width: 130 },
		{ field: 'email', headerName: 'Email', width: 130 },
		{
			field: 'delete',
			headerName: 'Delete',
			sortable: false,
			width: 100,
			renderCell: (params) => (
				<IconButton
					onClick={() => deleteMember(params.row._id, params.row.teamMemberName, params.row.position)}
				>
					<DeleteIcon />
				</IconButton>
			),
		},
	];

	const rows = Object.values(teamByPosition)
		.flat()
		.map((member) => ({
			...member,
			id: member._id,
			teamMemberName: member.teamMemberName ? capitalizeFirstLetter(member.teamMemberName) : 'Unknown',
		}));

	return (
		<div style={{ height: '100%', width: '100%', marginBottom: '5px' }}>
			<Typography variant="h6" gutterBottom>
				Team Members
			</Typography>
			<DataGrid
				rows={rows}
				columns={columns}
				pageSize={5}
				rowsPerPageOptions={[10]}
				getRowId={(row) => row._id}
				slots={{
				    Toolbar: CustomToolbar,
				}}
			/>
		</div>
	);
}

export default TeamMembersRender;
