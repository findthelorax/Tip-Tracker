import React, { useContext, useMemo } from 'react';
import moment from 'moment';
import { TeamContext } from '../../../contexts/TeamContext';
import YearlyTotalsTableRender from '../yearlyTotals.js/yearlyTotalsTableRender';
import { titleToPropName, titles, formatUSD } from '../../../hooks/salesTotalsLogic';

function YearlyTotalsTable({ selectedDate }) {
    const { team } = useContext(TeamContext);
    const date = moment(selectedDate);

    const weeksOfYear = Array.from({ length: date.weeksInYear() }, (_, i) => i + 1);

    const yearlyTotals = useMemo(() => {
        const totals = Array(weeksOfYear.length)
            .fill(0)
            .map(() => {
                const weekTotal = {};
                Object.values(titleToPropName).forEach((propName) => {
                    weekTotal[propName] = 0;
                });
                return weekTotal;
            });

        team.forEach((member) => {
            member.weeklyTotals.forEach((total) => {
                const totalDate = moment(total.date);
                const selectedYearStart = moment(selectedDate).startOf('year');
                const selectedYearEnd = moment(selectedYearStart).endOf('year');

                if (totalDate.isSameOrAfter(selectedYearStart) && totalDate.isSameOrBefore(selectedYearEnd)) {
                    const weekOfYear = totalDate.week() - 1;
                    Object.keys(titleToPropName).forEach((key) => {
                        totals[weekOfYear][titleToPropName[key]] += total[titleToPropName[key]] || 0;
                    });
                }
            });
        });

        return totals;
    }, [team, selectedDate]);

    const columns = [
        { field: 'salesTips', headerName: 'Sales / Tips', width: 130 },
        ...weeksOfYear.map((week, index) => {
            const date = moment(selectedDate).startOf('year').add(index, 'weeks').format('MM/DD');
            return { field: `week${week}`, headerName: `Week ${week} ${date}`, width: 110 };
        }),
        { field: 'total', headerName: 'Total', width: 100 },
    ];

    const rows = titles.map((title, i) => {
        const row = { id: i, salesTips: title };
        yearlyTotals.forEach((total, index) => {
            row[`week${index + 1}`] = formatUSD(total[titleToPropName[title]]);
        });
        row.total = formatUSD(yearlyTotals.reduce((sum, total) => sum + total[titleToPropName[title]], 0));
        return row;
    });

    return <YearlyTotalsTableRender rows={rows} columns={columns} />;
}

export { YearlyTotalsTable };