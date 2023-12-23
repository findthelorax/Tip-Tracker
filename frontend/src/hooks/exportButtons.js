import React from 'react';
import * as XLSX from 'xlsx';
import { Button } from '@mui/material';
import Papa from 'papaparse';

export const ExportToCsvButton = ({ data }) => {
    const handleExport = () => {
        const csv = Papa.unparse(data);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const href = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = href;
        link.setAttribute('download', 'export.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return <Button onClick={handleExport}>Export to CSV</Button>;
};

export const ExportToExcelButton = ({ data }) => {
    const handleExport = () => {
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        XLSX.writeFile(wb, "data.xlsx");
    };

    return <Button onClick={handleExport}>Export to Excel</Button>;
};