import React from 'react';
import { Typography, Box, Card, CardContent, TextField } from '@mui/material';
import {
	DataGrid,
	GridToolbarContainer,
	GridToolbarColumnsButton,
	GridToolbarFilterButton,
	GridToolbarDensitySelector,
	GridToolbarExport,
} from '@mui/x-data-grid';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function WeeklyTotalsTableRender({ date, handleDateChange, rows, columns }) {
	const weekStart = date.startOf('week').format('MM/DD/YY');
	const weekEnd = date.endOf('week').format('MM/DD/YY');

	return (
		<Card style={{ height: '100%', width: '100%' }}>
			<CardContent>
				<Typography variant="h4" component="h2" style={{ paddingBottom: 0 }}>
					Weekly Totals {weekStart} - {weekEnd}
				</Typography>
				<DataGrid
					rows={rows}
					columns={columns}
					pageSize={5}
					density="compact"
					components={{
						Toolbar: GridToolbarContainer,
					}}
					componentsProps={{
						toolbar: {
							children: (
								<div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
									<div style={{ width: '150px' }}>
										<DatePicker
											value={date}
											onChange={handleDateChange}
											renderInput={(params) => <TextField {...params} size="small" />}
										/>
									</div>
									<div>
										<GridToolbarColumnsButton />
										<GridToolbarFilterButton />
										<GridToolbarDensitySelector />
										<GridToolbarExport />
									</div>
								</div>
							),
						},
					}}
				/>
			</CardContent>
		</Card>
	);
}
