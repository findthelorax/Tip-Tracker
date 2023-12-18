import React, { useState, useEffect, useContext, useCallback, useMemo } from 'react';
import { Typography } from '@mui/material';
import DailyTotalsForm from './dailyTotalsForm';
import DailyTotalsTable from './dailyTotalsTable';
import { TeamContext } from '../contexts/TeamContext';
import { DailyTotalsContext } from '../contexts/DailyTotalsContext';
import { ErrorContext } from '../contexts/ErrorContext';
import { fetchDailyTotalsAll, deleteDailyTotalFromServer, submitDailyTotalToServer } from '../utils/api';
import { FormattedDate, CalculateTipOuts } from '../utils/utils';
import moment from 'moment';

const today = new Date();
const localDate = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString().split('T')[0];
// const timeZone = "America/New_York";

const initialDailyTotals = {
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

function DailyTotals() {
	const { team, setTeam } = useContext(TeamContext);
	const { selectedTeamMember, setSelectedTeamMember, setDailyTotalsAll, refreshDailyTotals, setRefreshDailyTotals } =
		useContext(DailyTotalsContext);
	const { setError } = useContext(ErrorContext);
	const [dailyTotals, setDailyTotals] = useState(initialDailyTotals);

	const tipOuts = useMemo(() => CalculateTipOuts(dailyTotals, selectedTeamMember, team), [dailyTotals, selectedTeamMember, team]);

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
		},
		[selectedTeamMember]
	);

	const fetchDailyTotals = useCallback(async () => {
		try {
			const data = await fetchDailyTotalsAll();
			setDailyTotalsAll(data);
		} catch (error) {
			console.error(error);
			setError(error.message);
		}
	}, [setError, setDailyTotalsAll]);

	useEffect(() => {
		fetchDailyTotals();
	}, [fetchDailyTotals, refreshDailyTotals]);

	const updateTeamMemberTipOuts = useCallback(async (date, position, tipOut) => {
		for (const member of team) {
			const workedSameDate = member.dailyTotals.some((total) => moment(total.date).format('YYYY-MM-DD') === moment(dailyTotals.date).format('YYYY-MM-DD'));
			if (workedSameDate && member.position === position) {
				// Update the member's daily total with the tip out
				const dailyTotalIndex = member.dailyTotals.findIndex((total) => total.date === date);
				member.dailyTotals[dailyTotalIndex].tipsReceived += tipOut;

				// Update the member on the server
				await submitDailyTotalToServer(member._id, member.dailyTotals[dailyTotalIndex]);
			}
		}
	}, [team]);

	// submitDailyTotals function breakdown
	const submitDailyTotals = useCallback(
		async (dailyTotals, selectedTeamMember) => {
			const existingTeamMember = team.find((member) => member._id === selectedTeamMember._id);

			if (!selectedTeamMember) {
				alert('Selected team member not found in the team list.');
				return;
			}

			if (existingTeamMember._id !== selectedTeamMember._id) {
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

			const newDailyTotals = prepareDailyTotals(dailyTotals);

			try {
				await submitDailyTotalToServer(selectedTeamMember._id, newDailyTotals);
				setRefreshDailyTotals((prevState) => !prevState);
				clearFormFields();
				fetchDailyTotals();
			} catch (error) {
				handleSubmissionError(error, dailyTotals);
			}
		},
		[team, fetchDailyTotals, handleSubmissionError, tipOuts, setRefreshDailyTotals, updateTeamMemberTipOuts]
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

	const clearFormFields = () => {
		setDailyTotals(initialDailyTotals);
	};

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
					fetchDailyTotals();
				} catch (error) {
					setError(`Error deleting daily total: ${error.message}`);
					alert(`Failed to delete daily totals: ${error.message}`);
				}
			} catch (error) {
				setError(`Error deleting daily total: ${error.message}`);
				alert(`Failed to delete daily totals: ${error.message}`);
			}
		},
		[setError, fetchDailyTotals, setRefreshDailyTotals]
	);

	return (
		<React.Fragment>
			<DailyTotalsForm
				dailyTotals={dailyTotals}
				setDailyTotals={setDailyTotals}
				submitDailyTotals={submitDailyTotals}
				team={team}
				setTeam={setTeam}
				selectedTeamMember={selectedTeamMember}
				setSelectedTeamMember={setSelectedTeamMember}
			/>
			<DailyTotalsTable team={team} deleteDailyTotal={deleteDailyTotal} />
		</React.Fragment>
	);
}

export default DailyTotals;
