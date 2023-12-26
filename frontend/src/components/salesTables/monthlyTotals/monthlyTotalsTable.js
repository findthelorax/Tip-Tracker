import React, { useContext, useMemo } from 'react';
import moment from 'moment';
import { TeamContext } from '../../../contexts/TeamContext';
import MonthlyTotalsTableRender from '../monthlyTotals/monthlyTotalsTableRender';
import { titleToPropName, titles, formatUSD } from '../../../hooks/salesTotalsLogic';

function MonthlyTotalsTable({ selectedDate }) {
    const { team } = useContext(TeamContext);
    const date = moment(selectedDate);

    const daysOfMonth = Array.from({ length: date.daysInMonth() }, (_, i) => i + 1);

    const monthlyTotals = useMemo(() => {
        const totals = Array(daysOfMonth.length)
            .fill(0)
            .map(() => {
                const dayTotal = {};
                Object.values(titleToPropName).forEach((propName) => {
                    dayTotal[propName] = 0;
                });
                return dayTotal;
            });

        team.forEach((member) => {
            member.dailyTotals.forEach((total) => {
                const totalDate = moment(total.date);
                const selectedMonthStart = moment(selectedDate).startOf('month');
                const selectedMonthEnd = moment(selectedMonthStart).endOf('month');

                if (totalDate.isSameOrAfter(selectedMonthStart) && totalDate.isSameOrBefore(selectedMonthEnd)) {
                    const dayOfMonth = totalDate.date() - 1;
                    Object.keys(titleToPropName).forEach((key) => {
                        totals[dayOfMonth][titleToPropName[key]] += total[titleToPropName[key]] || 0;
                    });
                }
            });
        });

        return totals;
    }, [team, selectedDate]);

    const columns = [
        { field: 'salesTips', headerName: 'Sales / Tips', width: 130 },
        ...daysOfMonth.map((day, index) => {
            const date = moment(selectedDate).startOf('month').add(index, 'days').format('MM/DD');
            return { field: `day${day}`, headerName: `${date}`, width: 110 };
        }),
        { field: 'total', headerName: 'Total', width: 100 },
    ];

    const rows = titles.map((title, i) => {
        const row = { id: i, salesTips: title };
        monthlyTotals.forEach((total, index) => {
            row[`day${index + 1}`] = formatUSD(total[titleToPropName[title]]);
        });
        row.total = formatUSD(monthlyTotals.reduce((sum, total) => sum + total[titleToPropName[title]], 0));
        return row;
    });

    return <MonthlyTotalsTableRender rows={rows} columns={columns} />;
}

export { MonthlyTotalsTable };