import React from 'react';
import { useDailyTotals } from '../hooks/dailyTotalsHooks';

export const DailyTotalsContext = React.createContext();

export const DailyTotalsProvider = ({ children }) => {
	const {
		refreshDailyTotals,
		selectedTeamMember,
		submissionError,
		dailyTotals,
		allDailyTotals,
		handleSubmissionError,
		clearFormFields,
		updateTeamMemberTipOuts,
		submitDailyTotals,
		deleteDailyTotal,
		prepareDailyTotals,
		fetchAllDailyTotals,
		updateWeeklyTotals,
	} = useDailyTotals();

	return (
		<DailyTotalsContext.Provider
			value={{
				refreshDailyTotals,
				selectedTeamMember,
				submissionError,
				dailyTotals,
				allDailyTotals,
				handleSubmissionError,
				clearFormFields,
				updateTeamMemberTipOuts,
				submitDailyTotals,
				deleteDailyTotal,
				prepareDailyTotals,
				fetchAllDailyTotals,
				updateWeeklyTotals,
			}}
		>
			{children}
		</DailyTotalsContext.Provider>
	);
};

//* OPTIMIZED CODE:
// import React, { useContext, useEffect, useState } from 'react';
// import { useDailyTotals } from '../hooks/dailyTotalsHooks';
// import { TeamContext } from '../contexts/TeamContext';
// import { calculateDailySalesDifferences, calculateWeeklySalesDifferences } from '../hooks/salesTotalsLogic';

// export const DailyTotalsContext = React.createContext();

// export const DailyTotalsProvider = ({ children }) => {
// 	const teamContext = useContext(TeamContext);
// 	const dailyTotals = teamContext.teamMembers ? teamContext.teamMembers.dailyTotals : [];
// 	const dailyTotalsHooks = useDailyTotals();

// 	const [dailySalesDifferences, setDailySalesDifferences] = useState([]);
// 	const [weeklySalesDifferences, setWeeklySalesDifferences] = useState([]);

// 	useEffect(() => {
// 		if (dailyTotals.length > 0) {
// 			setDailySalesDifferences(calculateDailySalesDifferences(dailyTotals));
// 			setWeeklySalesDifferences(calculateWeeklySalesDifferences(dailyTotals));
// 		}
// 	}, [dailyTotals]);

// 	return (
// 		<DailyTotalsContext.Provider
// 			value={{
// 				...dailyTotalsHooks,
// 				salesDifferences: {
// 					daily: dailySalesDifferences,
// 					weekly: weeklySalesDifferences,
// 				},
// 			}}
// 		>
// 			{children}
// 		</DailyTotalsContext.Provider>
// 	);
// };

/* 

To refresh your WeeklyTotalsTable when a dailyTotal is deleted, you need to ensure that the state change is propagated to the WeeklyTotalsTable component. This can be achieved by using a state management library like Redux or the built-in Context API in React.

Assuming you're using the Context API (since I see useContext in your code), you should have a context that holds the dailyTotals state. When a dailyTotal is deleted, this should update the context state.

Here's a simplified example:

// In your context provider component
const [dailyTotals, setDailyTotals] = useState([]);

const deleteDailyTotal = (id) => {
	setDailyTotals(prevTotals => prevTotals.filter(total => total.id !== id));
};

// Pass the delete function to context
<TeamContext.Provider value={{ dailyTotals, deleteDailyTotal }}>
	{children}
</TeamContext.Provider>

Then, in the component where you delete a dailyTotal, you would call this function:

const { deleteDailyTotal } = useContext(TeamContext);

// Call this function when you want to delete a dailyTotal
deleteDailyTotal(id);

Now, whenever a dailyTotal is deleted, the dailyTotals state in your context will be updated, and any component that consumes this context (like your WeeklyTotalsTable component) will be re-rendered with the new state.

In your WeeklyTotalsTable component, you're already using the team context value in a useMemo hook, which means the weeklyTotals will be recalculated whenever team changes. If team includes the dailyTotals, then your table should already be updating when a dailyTotal is deleted. If not, you may need to add dailyTotals to the dependency array of useMemo:

const { team, dailyTotals } = useContext(TeamContext);

const weeklyTotals = useMemo(() => {
	// Calculate weekly totals
}, [team, dailyTotals, selectedDate]);

This way, whenever dailyTotals changes, your weeklyTotals will be recalculated, and your table will update.


*/
