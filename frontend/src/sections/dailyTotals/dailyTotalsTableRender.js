import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Card, CardContent, CardHeader, Box, Typography } from '@mui/material';
import { ExportToCsvButton, ExportToExcelButton } from '../../hooks/utils';

function DailyTotalsTableRender({ rows, columns }) {
    return (
        <Card style={{ height: '100%', width: '100%' }}>
            <CardHeader
                title={
                    <Typography variant="h5" component="h2">
                        Daily Totals
                    </Typography>
                }
            />
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', pr: 1 }}>
                        <ExportToCsvButton data={rows} />
                        <ExportToExcelButton data={rows} />
                    </Box>
                </Box>
                <DataGrid rows={rows} columns={columns} pageSize={5} getRowId={(row) => row.key} />
            </CardContent>
        </Card>
    );
}

export default DailyTotalsTableRender;