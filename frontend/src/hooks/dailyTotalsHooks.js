import { useState, useContext, useEffect } from 'react';
import { TeamContext } from '../contexts/TeamContext';
import { ErrorContext } from '../contexts/ErrorContext';
import { updateWeeklyTotals } from '../utils/api';
import { useClearFormFields } from './clearFormFields';
import { useGetAllDailyTotals } from './getAllDailyTotals';
import { useUpdateTeamMemberTipOuts } from './updateTeamMemberTipOuts';
import { useDeleteDailyTotal } from './deleteDailyTotal';
import { useHandleSubmissionError } from './handleSubmissionError';
import { useSubmitDailyTotals } from './submitDailyTotals';
import { prepareDailyTotals } from './prepareDailyTotals';
import { initialDailyTotals } from './initiateDailyTotals';

export const useDailyTotals = () => {

	const [refreshDailyTotals, setRefreshDailyTotals] = useState(false);
	const [selectedTeamMember, setSelectedTeamMember] = useState('');
	const [submissionError, setSubmissionError] = useState(null);
	const { setError } = useContext(ErrorContext);
	const { team } = useContext(TeamContext);
	const [dailyTotals, setDailyTotals] = useState([]);
	const clearFormFields = useClearFormFields(initialDailyTotals, setDailyTotals);
	const { allDailyTotals, fetchAllDailyTotals } = useGetAllDailyTotals();
	const updateTeamMemberTipOuts = useUpdateTeamMemberTipOuts(team, setError);
	const deleteDailyTotal = useDeleteDailyTotal(setError, fetchAllDailyTotals, setRefreshDailyTotals);
	const handleSubmissionError = useHandleSubmissionError(selectedTeamMember, setSubmissionError);
	const submitDailyTotals = useSubmitDailyTotals(
		team,
		dailyTotals,
		fetchAllDailyTotals,
		handleSubmissionError,
		setRefreshDailyTotals,
		updateTeamMemberTipOuts,
		clearFormFields
	);

	useEffect(() => {
		fetchAllDailyTotals().then(totals => setDailyTotals(totals));
	}, [fetchAllDailyTotals]);

	return {
		refreshDailyTotals,
		setRefreshDailyTotals,
		allDailyTotals,
		selectedTeamMember,
		setSelectedTeamMember,
		submissionError,
		handleSubmissionError,
		clearFormFields,
		updateTeamMemberTipOuts,
		submitDailyTotals,
		deleteDailyTotal,
		prepareDailyTotals,
		fetchAllDailyTotals,
		updateWeeklyTotals,
	};
};
