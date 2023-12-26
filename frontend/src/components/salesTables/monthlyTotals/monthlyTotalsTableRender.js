import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

function MonthlyTotalsTableRender({ rows, columns }) {
	const defaultColDef = {
		sortable: true,
		filter: true,
	};

	return (
			<div className="ag-theme-quartz-dark" style={{ height: 400, width: '100%' }}>
				<AgGridReact
					rowData={rows}
					columnDefs={columns}
					defaultColDef={defaultColDef}
				/>
			</div>
	);
}

export default MonthlyTotalsTableRender;