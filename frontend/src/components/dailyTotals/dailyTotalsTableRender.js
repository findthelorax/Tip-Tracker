import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { Typography } from '@mui/material';
import { DeleteButton } from '../../components/deleteButton';

function DailyTotalsTableRender({ rows, columns, frameworkComponents }) {
	const defaultColDef = {
		sortable: true,
		filter: true,
	};

	return (
		<div style={{ height: '100%', width: '100%' }}>
			<Typography variant="h4" component="h2" style={{ paddingBottom: 0 }}>
				Daily Totals
			</Typography>
			<div className="ag-theme-quartz-dark" style={{ height: 400, width: '100%' }}>
				<AgGridReact
					rowData={rows}
					columnDefs={columns}
					defaultColDef={defaultColDef}
					frameworkComponents={{ ...frameworkComponents, deleteButton: DeleteButton }}
				/>
			</div>
		</div>
	);
}

export default DailyTotalsTableRender;