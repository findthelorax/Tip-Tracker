import React from 'react';
import { Typography, Box, Card, CardContent } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ExportToCsvButton, ExportToExcelButton } from '../../hooks/utils';

export default function WeeklyTotalsRender({ date, handleDateChange, rows, columns }) {
    return (
        <Card style={{ height: '100%', width: '100%' }}>
            <CardContent>
                <Typography variant="h5" component="h2">
                    Weekly Totals
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 2 }}>
                    <DatePicker
                        label="Select a week"
                        value={date}
                        onChange={handleDateChange}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
					<Box sx={{ display: 'flex', justifyContent: 'flex-end', pr: 1 }}>
                            <ExportToCsvButton data={rows} />
                            <ExportToExcelButton data={rows} />
                        </Box>
                    </Box>
                </Box>
                <DataGrid rows={rows} columns={columns} pageSize={5} />
            </CardContent>
        </Card>
    );
}