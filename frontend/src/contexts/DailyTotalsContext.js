import React, { useState, createContext, useCallback, useEffect, useContext, useMemo } from 'react';
import moment from 'moment';
import { TeamContext } from '../contexts/TeamContext';
import { ErrorContext } from '../contexts/ErrorContext';
import { deleteDailyTotalFromServer, submitDailyTotalToServer, fetchDailyTotalsAll } from '../utils/api';
import { FormattedDate, CalculateTipOuts } from '../logic/utils';

const today = new Date();
const localDate = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString().split('T')[0];
export const initialDailyTotals = {
	date: localDate,
	foodSales: '',
	barSales: '',
	nonCashTips: '',
	cashTips: '',
	barTipOuts: 0,
	runnerTipOuts: 0,
	hostTipOuts: 0,
	totalTipOut: 0,
	tipsReceived: 0,
	totalPayrollTips: 0,
};
export const DailyTotalsContext = createContext();

export const DailyTotalsProvider = ({ children }) => {
	const [dailyTotalsAll, setDailyTotalsAll] = useState([]);
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

	const clearFormFields = useCallback(() => {
		setDailyTotals(initialDailyTotals);
	}, []);

	const fetchDailyTotals = useCallback(async () => {
		try {
			const data = await fetchDailyTotalsAll();
			setDailyTotalsAll(data);
		} catch (error) {
			console.error(error);
			setError(error.message);
		}
	}, [setError, setDailyTotalsAll]);

	const updateTeamMemberTipOuts = useCallback(
		async (date, position, tipOut) => {
			const promises = team.map(async (member) => {
				const workedSameDate = member.dailyTotals.some(
					(total) => moment(total.date).format('YYYY-MM-DD') === moment(dailyTotals.date).format('YYYY-MM-DD')
				);
				if (workedSameDate && member.position === position) {
					const dailyTotalIndex = member.dailyTotals.findIndex((total) => total.date === date);
					member.dailyTotals[dailyTotalIndex].tipsReceived += tipOut;
					return submitDailyTotalToServer(member._id, member.dailyTotals[dailyTotalIndex]);
				}
			});
			try {
				await Promise.all(promises);
			} catch (error) {
				console.error(error);
				setError(error.message);
			}
		},
		[team, dailyTotals, setError]
	);

	const deleteDailyTotal = useCallback(
		async (teamMember, date) => {
			const confirmation = window.confirm(
				`ARE YOU SURE YOU WANT TO DELETE THE DAILY TOTAL FOR:\n\n${teamMember.teamMemberName.toUpperCase()}		ON:		${FormattedDate(
					date
				).toUpperCase()}?`
			);
			if (!confirmation) {
				return;
			}

			try {
				if (!teamMember._id || !date) {
					console.error('teamMember or date is undefined');
					alert('Failed to delete daily total');
					return;
				}

				try {
					const response = await deleteDailyTotalFromServer(teamMember._id, date);
					console.log(response);
					setRefreshDailyTotals((prevState) => !prevState); // add this line
					if (response.status === 200) {
						fetchDailyTotals();

						// Update weekly totals
						const teamMemberToUpdate = team.find(member => member._id === teamMember._id);
						console.log("🚀 ~ file: DailyTotalsContext.js:102 ~ teamMemberToUpdate:", teamMemberToUpdate)
						// if (teamMemberToUpdate) {
						// 	teamMemberToUpdate.updateWeeklyTotals();
						// 	await teamMemberToUpdate.save();
						// }
					}
				} catch (error) {
					setError(`Error deleting daily total: ${error.message}`);
					alert(`Failed to delete daily totals: ${error.message}`);
				}
			} catch (error) {
				setError(`Error deleting daily total: ${error.message}`);
				alert(`Failed to delete daily totals: ${error.message}`);
			}
		},
		[setError, fetchDailyTotals, setRefreshDailyTotals, team]
	);

	const handleSubmissionError = useCallback(
		(error, dailyTotals) => {
			if (error.response && error.response.status === 400) {
				alert(
					`Totals on ${dailyTotals.date} for ${selectedTeamMember.teamMemberName} - ${selectedTeamMember.position} already exists.`
				);
			} else {
				alert('An error occurred while submitting daily totals.');
			}
			console.error(error);
			setSubmissionError(error);
		},
		[selectedTeamMember]
	);

	useEffect(() => {
		fetchDailyTotals();
	}, [fetchDailyTotals, refreshDailyTotals, setError, setDailyTotalsAll]);

	// submitDailyTotals function breakdown
	const submitDailyTotals = useCallback(
		async (dailyTotals, selectedTeamMember) => {
			console.log("🚀 ~ file: DailyTotalsContext.js:141 ~ selectedTeamMember:", selectedTeamMember)
			console.log("🚀 ~ file: DailyTotalsContext.js:141 ~ dailyTotals:", dailyTotals)

			const existingTeamMember = team.find((member) => member._id === selectedTeamMember._id);
			console.log("🚀 ~ file: DailyTotalsContext.js:147 ~ team:", team)
			console.log("🚀 ~ file: DailyTotalsContext.js:147 ~ existingTeamMember:", existingTeamMember)

			if (!existingTeamMember) {
				console.log("🚀 ~ file: DailyTotalsContext.js:149 ~ existingTeamMember:", existingTeamMember)
				alert('Selected team member does not match an existing team member.');
				return;
			}

			if (existingTeamMember !== selectedTeamMember) {
				console.log("🚀 ~ file: DailyTotalsContext.js:154 ~ existingTeamMember:", existingTeamMember)
				console.log("🚀 ~ file: DailyTotalsContext.js:154 ~ selectedTeamMember:", selectedTeamMember)
				alert('Selected team member does not match an existing team member.');
				return;
			}
			if (selectedTeamMember.position === 'server') {
				dailyTotals.barTipOuts = tipOuts.bartender;
				dailyTotals.runnerTipOuts = tipOuts.runner;
				dailyTotals.hostTipOuts = tipOuts.host;

				for (const member of team) {
					// Check if the team member worked on the same date
					const workedSameDate = member.dailyTotals.some((total) => total.date === dailyTotals.date);

					if (workedSameDate) {
						if (member.position === 'bartender') {
							await updateTeamMemberTipOuts(dailyTotals.date, 'bartender', tipOuts.bartender);
						} else if (member.position === 'host') {
							await updateTeamMemberTipOuts(dailyTotals.date, 'host', tipOuts.host);
						} else if (member.position === 'runner') {
							await updateTeamMemberTipOuts(dailyTotals.date, 'runner', tipOuts.runner);
						}
					}
				}
				console.log('After update:', dailyTotals);
			} else {
				dailyTotals.barTipOuts = 0;
				dailyTotals.runnerTipOuts = 0;
				dailyTotals.hostTipOuts = 0;
			}
			setDailyTotals((prevState) => ({
				...prevState,
				barTipOuts: tipOuts.bartender,
				runnerTipOuts: tipOuts.runner,
				hostTipOuts: tipOuts.host,
			}));
			const newDailyTotals = prepareDailyTotals(dailyTotals);

			try {
				await submitDailyTotalToServer(selectedTeamMember._id, newDailyTotals);
				setRefreshDailyTotals((prevState) => !prevState);
				clearFormFields();
				fetchDailyTotals();

				// Update weekly totals
				// const teamMember = team.find((member) => member._id === selectedTeamMember._id);
				// if (teamMember) {
				// 	teamMember.updateWeeklyTotals();
				// 	await teamMember.save();
				// }
			} catch (error) {
				handleSubmissionError(error, dailyTotals);
			}
		},
		[
			team,
			fetchDailyTotals,
			handleSubmissionError,
			tipOuts,
			setRefreshDailyTotals,
			updateTeamMemberTipOuts,
			clearFormFields,
		]
	);

	const prepareDailyTotals = (dailyTotals) => {
		const totalTipOut =
			Number(dailyTotals.barTipOuts) + Number(dailyTotals.runnerTipOuts) + Number(dailyTotals.hostTipOuts);
		const tipsReceived = Number(dailyTotals.nonCashTips) + Number(dailyTotals.cashTips);
		const totalPayrollTips = tipsReceived - totalTipOut;

		return {
			...dailyTotals,
			totalTipOut,
			tipsReceived,
			totalPayrollTips,
		};
	};

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