import { useDailyTotals, DailyTotalsContext } from '../hooks/useDailyTotals';

export const DailyTotalsProvider = ({ children }) => {
	const dailyTotals = useDailyTotals();

	return (
		<DailyTotalsContext.Provider value={dailyTotals}>
			{children}
		</DailyTotalsContext.Provider>
	);
};