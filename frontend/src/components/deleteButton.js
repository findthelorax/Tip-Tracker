import React from 'react';
import { Button } from '@mui/material';

export function DeleteButton(props) {
	const { deleteDailyTotal } = props.colDef.cellRendererParams;
	const { _id: id } = props.data;

	return (
		<Button variant="contained" sx={{ bgcolor: 'error.main', color: 'white' }} onClick={() => deleteDailyTotal(id)}>
			Delete
		</Button>
	);
}
