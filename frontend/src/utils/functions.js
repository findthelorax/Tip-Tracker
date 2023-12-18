import { addTeamMember, deleteTeamMember } from './api';

export const addTeamMemberToTeam = (teamMemberName, position, setTeam, clearInputs) => {
	return async () => {
		if (teamMemberName && position) {
			try {
				const newMember = await addTeamMember(teamMemberName, position);
				setTeam((prevTeam) => [...prevTeam, newMember]);
				clearInputs();
			} catch (error) {
				console.error('Error adding team member:', error);
				alert('Failed to add team member');
			}
		} else {
			alert('Please enter both name and position');
		}
	};
};

export const deleteTeamMemberFromTeam = (setTeam) => {
	return async (id, teamMemberName, position) => {
		const confirmation = window.confirm(
			`ARE YOU SURE YOU WANT TO DELETE:\n\n${
				teamMemberName ? teamMemberName.toUpperCase() : 'Unknown'
			} - ${position}?`
		);
		if (!confirmation) {
			return;
		}

		try {
			await deleteTeamMember(id);
			setTeam((prevTeam) => prevTeam.filter((member) => member._id !== id));
		} catch (error) {
			console.error('Error deleting team member:', error);
			alert('Failed to delete team member');
		}
	};
};

// export const handleSubmissionError = useCallback(
// 	(error, dailyTotals) => {
// 		if (error.response && error.response.status === 400) {
// 			alert(
// 				`Totals on ${dailyTotals.date} for ${selectedTeamMember.teamMemberName} - ${selectedTeamMember.position} already exists.`
// 			);
// 		} else {
// 			alert('An error occurred while submitting daily totals.');
// 		}
// 		console.error(error);
// 	},
// 	[selectedTeamMember]
// );

// export const fetchDailyTotals = useCallback(async () => {
// 	try {
// 		const data = await fetchDailyTotalsAll();
// 		setDailyTotalsAll(data);
// 	} catch (error) {
// 		console.error(error);
// 		setError(error.message);
// 	}
// }, [setError, setDailyTotalsAll]);

// useEffect(() => {
// 	fetchDailyTotals();
// }, [fetchDailyTotals, refreshDailyTotals]);

// export const submitDailyTotals = useCallback(
// 	async (dailyTotals, selectedTeamMember) => {
// 		const existingTeamMember = team.find((member) => member._id === selectedTeamMember._id);

// 		if (!selectedTeamMember) {
// 			alert('Selected team member not found in the team list.');
// 			return;
// 		}

// 		if (existingTeamMember._id !== selectedTeamMember._id) {
// 			alert('Selected team member does not match the existing team member.');
// 			return;
// 		}

// 		if (selectedTeamMember.position === 'server') {
// 			dailyTotals.barTipOuts = 0;
// 			dailyTotals.runnerTipOuts = 0;
// 			dailyTotals.hostTipOuts = 0;

// 			for (const member of team) {
// 				// Check if the team member worked on the same date
// 				const workedSameDate = member.dailyTotals.some((total) => total.date === dailyTotals.date);

// 				if (workedSameDate) {
// 					if (member.position === 'bartender') {
// 						dailyTotals.barTipOuts += calculateTipOuts(dailyTotals, 'bartender');
// 					} else if (member.position === 'host') {
// 						dailyTotals.hostTipOuts += calculateTipOuts(dailyTotals, 'host');
// 					} else if (member.position === 'runner') {
// 						dailyTotals.runnerTipOuts += calculateTipOuts(dailyTotals, 'runner');
// 					}
// 				}
// 			}
// 		} else {
// 			dailyTotals.barTipOuts = 0;
// 			dailyTotals.runnerTipOuts = 0;
// 			dailyTotals.hostTipOuts = 0;
// 		}

// 		const newDailyTotals = prepareDailyTotals(dailyTotals);

// 		try {
// 			await submitDailyTotalToServer(selectedTeamMember._id, newDailyTotals);
// 			setRefreshDailyTotals((prevState) => !prevState);
// 			// setRefreshDailyTotals(newDailyTotals);

// 			clearFormFields();
// 			fetchDailyTotals();
// 		} catch (error) {
// 			handleSubmissionError(error, dailyTotals);
// 		}
// 	},
// 	[team, fetchDailyTotals, handleSubmissionError, calculateTipOuts, setRefreshDailyTotals]
// );

// export const prepareDailyTotals = (dailyTotals) => {
// 	const totalTipOut =
// 		Number(dailyTotals.barTipOuts) + Number(dailyTotals.runnerTipOuts) + Number(dailyTotals.hostTipOuts);
// 	const tipsReceived = Number(dailyTotals.nonCashTips) + Number(dailyTotals.cashTips);
// 	const totalPayrollTips = tipsReceived - totalTipOut;

// 	return {
// 		...dailyTotals,
// 		totalTipOut,
// 		tipsReceived,
// 		totalPayrollTips,
// 	};
// };

// export const clearFormFields = () => {
// 	setDailyTotals(initialDailyTotals);
// };

// export const deleteDailyTotal = useCallback(
// 	async (teamMember, date) => {
// 		const confirmation = window.confirm(
// 			`ARE YOU SURE YOU WANT TO DELETE THE DAILY TOTAL FOR:\n\n${teamMember.teamMemberName.toUpperCase()}		ON:		${FormattedDate(
// 				date
// 			).toUpperCase()}?`
// 		);
// 		if (!confirmation) {
// 			return;
// 		}

// 		try {
// 			if (!teamMember._id || !date) {
// 				console.error('teamMember or date is undefined');
// 				alert('Failed to delete daily total');
// 				return;
// 			}

// 			try {
// 				const response = await deleteDailyTotalFromServer(teamMember._id, date);
// 				console.log(response);
// 				fetchDailyTotals();
// 			} catch (error) {
// 				setError(`Error deleting daily total: ${error.message}`);
// 				alert(`Failed to delete daily totals: ${error.message}`);
// 			}
// 		} catch (error) {
// 			setError(`Error deleting daily total: ${error.message}`);
// 			alert(`Failed to delete daily totals: ${error.message}`);
// 		}
// 	},
// 	[setError, fetchDailyTotals]
// );
