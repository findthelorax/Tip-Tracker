import React from 'react';
import { Button } from '@mui/material';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import axios from 'axios';
import moment from 'moment';

export function FormattedDate(dateString) {
    const date = moment(dateString).local();
    return date.format('MMM D, YYYY');
}

export const FormInputDate = () => {
    const currentDate = moment().local();
    return currentDate.format('YYYY-MM-DD');
};

// export const FormInputDate = () => {
//     const currentDate = moment();
//     return currentDate.format('YYYY-MM-DDTHH:mm:ss');
// };

export let tipOutPercentages = {
    bartender: 0.05,
    runner: 0.04,
    host: 0.015
};

export const updateTipOutPercentages = (newPercentages) => {
    tipOutPercentages = { ...newPercentages };
};

export const CalculateTipOuts = (dailyTotals, selectedTeamMember, team) => {
    let tipOuts = {
        bartender: 0,
        host: 0,
        runner: 0,
        server: 0
    };

    if (selectedTeamMember.position === 'server') {
        // Calculate server tip outs
        tipOuts.bartender = Number(dailyTotals.barSales) * tipOutPercentages.bartender;
        tipOuts.runner = Number(dailyTotals.foodSales) * tipOutPercentages.runner;
        tipOuts.host = Number(dailyTotals.foodSales) * tipOutPercentages.host;

        // Distribute tip outs to bartenders, runners, and hosts who worked the same day
        for (const member of team) {
            const workedSameDate = member.dailyTotals.some((total) => moment(total.date).isSame(moment(dailyTotals.date), 'day'));

            if (workedSameDate) {
                if (member.position === 'bartender') {
                    member.dailyTotals.find((total) => total.date === dailyTotals.date).barTipOuts += tipOuts.bartender;
                } else if (member.position === 'runner') {
                    member.dailyTotals.find((total) => total.date === dailyTotals.date).runnerTipOuts += tipOuts.runner;
                } else if (member.position === 'host') {
                    member.dailyTotals.find((total) => total.date === dailyTotals.date).hostTipOuts += tipOuts.host;
                }
            }
        }
    }

    return tipOuts;
};

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

export const setAuthToken = token => {
    if (token) {
        // Apply to every request
        axios.defaults.headers.common['Authorization'] = token;
    } else {
        // Delete auth header
        delete axios.defaults.headers.common['Authorization'];
    }
};