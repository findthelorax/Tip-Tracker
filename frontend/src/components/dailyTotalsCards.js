import { useMemo } from 'react';
import moment from 'moment';
import { calculateDailySalesDifferences } from '../hooks/salesTotalsLogic';
import {DailyFoodSalesCardRender, DailyBarSalesCardRender } from '../sections/dailyTotals/dailyTotalsCardsRender';

function DailyFoodSalesCard({ team, selectedDate }) {
    const teamMembers = useMemo(() => {
        const selectedDay = moment(selectedDate).format('YYYY-MM-DD');

        return team.map((member) => {
            const dailyTotals = member.dailyTotals.filter((total) => {
                const totalDate = moment.utc(total.date).format('YYYY-MM-DD');
                return totalDate === selectedDay;
            });
            return { ...member, dailyTotals };
        }).filter(member => member.dailyTotals.length > 0);
    }, [team, selectedDate]);

    const allDailyTotals = teamMembers.flatMap(member => member.dailyTotals);
    const totalFoodSales = allDailyTotals.reduce((sum, total) => sum + total.foodSales, 0);
    const salesDifferences = calculateDailySalesDifferences(allDailyTotals);

    return (
        <DailyFoodSalesCardRender
            team={team}
            teamMembers={teamMembers}
            difference={salesDifferences.foodSales?.difference}
            positive={salesDifferences.foodSales?.positive}
            selectedDate={selectedDate}
            sx={salesDifferences.foodSales?.sx}
            totalFoodSales={totalFoodSales}
        />
    );
}

function DailyBarSalesCard({ team, selectedDate }) {
    const teamMembers = useMemo(() => {
        const selectedDay = moment(selectedDate).format('YYYY-MM-DD');

        return team.map((member) => {
            const dailyTotals = member.dailyTotals.filter((total) => {
                const totalDate = moment.utc(total.date).format('YYYY-MM-DD');
                return totalDate === selectedDay;
            });
            return { ...member, dailyTotals };
        });
    }, [team, selectedDate]);

    const allDailyTotals = teamMembers.flatMap(member => member.dailyTotals);
    const totalBarSales = allDailyTotals.reduce((sum, total) => sum + total.barSales, 0);
    const salesDifferences = calculateDailySalesDifferences(allDailyTotals);
    
    return (
        <DailyBarSalesCardRender
            team={team}
            teamMembers={teamMembers}
            difference={salesDifferences.barSales?.difference}
            positive={salesDifferences.barSales?.positive}
            selectedDate={selectedDate}
            sx={salesDifferences.barSales?.sx}
            totalBarSales={totalBarSales}
        />
    );
}

export { DailyFoodSalesCard, DailyBarSalesCard };