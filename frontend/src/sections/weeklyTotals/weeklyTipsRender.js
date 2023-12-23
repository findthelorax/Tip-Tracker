import React from 'react';
import { Typography, Card, CardContent, CardHeader } from '@mui/material';
import { DataGrid, GridToolbarContainer, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector, GridToolbarExport } from '@mui/x-data-grid';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function WeeklyTipsRender({ date, handleDateChange, rows, columns }) {
    return (
        <Card style={{ height: '100%', width: '100%' }}>
            <CardHeader
                title={
                    <Typography variant="h4" component="h2">
                        Weekly Tip Totals
                    </Typography>
                }
                titleTypographyProps={{ variant:'h4', component:'h2', gutterBottom:false }}
                style={{ paddingBottom: 0, marginBottom: 0 }}
            />
            <CardContent>
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