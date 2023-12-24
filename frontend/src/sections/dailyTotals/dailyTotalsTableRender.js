import React from 'react';
import { DataGrid, GridToolbarContainer, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector, GridToolbarExport } from '@mui/x-data-grid';
import { Card, CardContent, Typography } from '@mui/material';

function DailyTotalsTableRender({ rows, columns }) {
    return (
        <Card style={{ height: '100%', width: '100%' }}>
            <CardContent>
                <Typography variant="h4" component="h2" style={{ paddingBottom: 0 }}>
                    Daily Totals
                </Typography>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    density="compact"
                    hideFooter
                    getRowId={(row) => row.key}
                    slots={{
                        Toolbar: GridToolbarContainer,
                    }}
                    slotProps={{
                        toolbar: {
                            children: (
                                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
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

export default DailyTotalsTableRender;