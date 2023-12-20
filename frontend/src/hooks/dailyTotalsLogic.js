import { useState, useContext, useMemo, useEffect } from 'react';
import { TeamContext } from '../contexts/TeamContext';
import { ErrorContext } from '../contexts/ErrorContext';
import { updateWeeklyTotals } from '../utils/api';
import { CalculateTipOuts } from '../hooks/utils';
import { useClearFormFields } from '../hooks/clearFormFields';
import { useFetchDailyTotals } from '../hooks/fetchDailyTotals';
import { useUpdateTeamMemberTipOuts } from '../hooks/updateTeamMemberTipOuts';
import { useDeleteDailyTotal } from '../hooks/deleteDailyTotal';
import { useHandleSubmissionError } from '../hooks/handleSubmissionError';
import { useSubmitDailyTotals } from '../hooks/submitDailyTotals';
import { prepareDailyTotals } from '../hooks/prepareDailyTotals';

export const useDailyTotals = (initialDailyTotals) => {
	const [refreshDailyTotals, setRefreshDailyTotals] = useState(false);
	const [selectedTeamMember, setSelectedTeamMember] = useState('');
	const [submissionError, setSubmissionError] = useState(null);
	const { setError } = useContext(ErrorContext);
	const { team } = useContext(TeamContext);
	const [dailyTotals, setDailyTotals] = useState(initialDailyTotals);
	const tipOuts = useMemo(
		() => CalculateTipOuts(dailyTotals, selectedTeamMember, team),
		[dailyTotals, selectedTeamMember, team]
	);
	const clearFormFields = useClearFormFields(initialDailyTotals, setDailyTotals);
	const { dailyTotalsAll, fetchDailyTotals } = useFetchDailyTotals();
	const updateTeamMemberTipOuts = useUpdateTeamMemberTipOuts(team, setError);
	const deleteDailyTotal = useDeleteDailyTotal(setError, fetchDailyTotals, setRefreshDailyTotals);
	const handleSubmissionError = useHandleSubmissionError(selectedTeamMember, setSubmissionError);
	const submitDailyTotals = useSubmitDailyTotals(
		team,
		fetchDailyTotals,
		handleSubmissionError,
		tipOuts,
		setRefreshDailyTotals,
		updateTeamMemberTipOuts,
		clearFormFields
	);

	useEffect(() => {
		fetchDailyTotals();
	}, [fetchDailyTotals, refreshDailyTotals, setError]);

	return {
		refreshDailyTotals,
		setRefreshDailyTotals,
		dailyTotalsAll,
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
		updateWeeklyTotals,
	};
};
