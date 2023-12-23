import React from 'react';
import { useDailyTotals } from '../hooks/dailyTotalsHooks';
import { initialDailyTotals } from '../hooks/initiateDailyTotals';

export const DailyTotalsContext = React.createContext();

export const DailyTotalsProvider = ({ children }) => {
	const {
		refreshDailyTotals,
		setRefreshDailyTotals,
		dailyTotalsAll,
		setDailyTotalsAll,
		selectedTeamMember,
		setSelectedTeamMember,
		submissionError,
		handleSubmissionError,
		clearFormFields,
		updateTeamMemberTipOuts,
		submitDailyTotals,
		deleteDailyTotal,
		prepareDailyTotals,
		fetchDailyTotals,
	} = useDailyTotals(initialDailyTotals);

	return (
		<DailyTotalsContext.Provider
			value={{
				refreshDailyTotals,
				setRefreshDailyTotals,
				dailyTotalsAll,
				setDailyTotalsAll,
				selectedTeamMember,
				setSelectedTeamMember,
				submissionError,
				handleSubmissionError,
				clearFormFields,
				updateTeamMemberTipOuts,
				submitDailyTotals,
				deleteDailyTotal,
				prepareDailyTotals,
				fetchDailyTotals,
			}}
		>
			{children}
		</DailyTotalsContext.Provider>
	);
};

//* OPTIMIZED CODE:
// import React, { useContext, useEffect, useState } from 'react';
// import { useDailyTotals } from '../hooks/dailyTotalsHooks';
// import { initialDailyTotals } from '../hooks/initiateDailyTotals';
// import { TeamContext } from '../contexts/TeamContext';
// import { calculateDailySalesDifferences, calculateWeeklySalesDifferences } from '../hooks/salesTotalsLogic';

// export const DailyTotalsContext = React.createContext();

// export const DailyTotalsProvider = ({ children }) => {
// 	const teamContext = useContext(TeamContext);
// 	const dailyTotals = teamContext.teamMembers ? teamContext.teamMembers.dailyTotals : [];
// 	const dailyTotalsHooks = useDailyTotals(initialDailyTotals);

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