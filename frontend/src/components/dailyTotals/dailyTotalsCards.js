import { useMemo, useContext } from 'react';
import moment from 'moment';
import { calculateDailySalesDifferences } from '../../hooks/salesTotalsLogic';
import { DailyFoodSalesCardRender, DailyBarSalesCardRender } from '../dailyTotals/dailyTotalsCardsRender';
import { TeamContext } from '../../contexts/TeamContext';

function DailyFoodSalesCard({ selectedDate }) {
	const { team } = useContext(TeamContext);
	const teamMembers = useMemo(() => {
		const selectedDay = moment(selectedDate).format('YYYY-MM-DD');

		return team
			.map((member) => {
				const dailyTotals = member.dailyTotals.filter((total) => {
					const totalDate = moment(total.date).local().format('YYYY-MM-DD');
					return totalDate === selectedDay;
				});
				return { ...member, dailyTotals };
			})
			.filter((member) => member.dailyTotals.length > 0);
	}, [team, selectedDate]);

	const allDailyTotals = teamMembers.flatMap((member) => member.dailyTotals);
	console.log("🚀 ~ file: dailyTotalsCards.js:24 ~ DailyFoodSalesCard ~ allDailyTotals:", allDailyTotals)
	const totalFoodSales = allDailyTotals.reduce((sum, total) => sum + total.foodSales, 0);
	console.log("🚀 ~ file: dailyTotalsCards.js:25 ~ DailyFoodSalesCard ~ totalFoodSales:", totalFoodSales)
	const salesDifferences = calculateDailySalesDifferences(allDailyTotals);
	console.log("🚀 ~ file: dailyTotalsCards.js:26 ~ DailyFoodSalesCard ~ salesDifferences:", salesDifferences)

	return (
		<DailyFoodSalesCardRender
        selectedDate={selectedDate}
        totalFoodSales={totalFoodSales}
			salesDifferences={salesDifferences}
            sx={salesDifferences.foodSales?.sx}

		/>
	);
}

function DailyBarSalesCard({ selectedDate }) {
	const { team } = useContext(TeamContext);
	const teamMembers = useMemo(() => {
		const selectedDay = moment(selectedDate).format('YYYY-MM-DD');

		return team.map((member) => {
			const dailyTotals = member.dailyTotals.filter((total) => {
				const totalDate = moment(total.date).local().format('YYYY-MM-DD');
				return totalDate === selectedDay;
			});
			return { ...member, dailyTotals };
		});
	}, [team, selectedDate]);

	const allDailyTotals = teamMembers.flatMap((member) => member.dailyTotals);
	const totalBarSales = allDailyTotals.reduce((sum, total) => sum + total.barSales, 0);
	const salesDifferences = calculateDailySalesDifferences(allDailyTotals);

	return (
		<DailyBarSalesCardRender
        selectedDate={selectedDate}
        totalBarSales={totalBarSales}
			salesDifferences={salesDifferences}
			sx={salesDifferences.barSales?.sx}
		/>
	);
}

export { DailyFoodSalesCard, DailyBarSalesCard };