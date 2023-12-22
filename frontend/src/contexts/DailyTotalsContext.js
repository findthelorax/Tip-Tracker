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