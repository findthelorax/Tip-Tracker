import React, { useState, useEffect, useContext, useCallback, useMemo } from 'react';
import { Typography } from '@mui/material';
import DailyTotalsForm from './dailyTotalsForm';
import DailyTotalsTable from './dailyTotalsTable';
import { TeamContext } from './contexts/TeamContext';
import { DailyTotalsContext } from './contexts/DailyTotalsContext';
import { ErrorContext } from './contexts/ErrorContext';
import { fetchDailyTotalsAll, deleteDailyTotalFromServer, submitDailyTotalToServer } from './utils/api';
import { FormattedDate } from './utils/dateUtils';

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
	const { selectedTeamMember, setSelectedTeamMember, setDailyTotalsAll, refreshDailyTotals, setRefreshDailyTotals } = useContext(DailyTotalsContext);
	const { setError } = useContext(ErrorContext);
	const [dailyTotals, setDailyTotals] = useState(initialDailyTotals);

	const calculateTipOuts = useMemo(() => {
		let tipOuts = 0;
		if (selectedTeamMember.position === 'bartender') {
			tipOuts = Number(dailyTotals.barSales) * 0.05;
		} else if (selectedTeamMember.position === 'host') {
			tipOuts = Number(dailyTotals.foodSales) * 0.015;
		} else if (selectedTeamMember.position === 'runner') {
			tipOuts = Number(dailyTotals.foodSales) * 0.04;
		}
		return tipOuts;
	}, [dailyTotals, selectedTeamMember]);

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

	// submitDailyTotals function breakdown
	const submitDailyTotals = useCallback(
		async (dailyTotals, selectedTeamMember) => {
			const existingTeamMember = team.find((member) => member._id === selectedTeamMember._id);

			if (!selectedTeamMember) {
				alert('Selected team member not found in the team list.');
				return;
			}

			if (existingTeamMember._id !== selectedTeamMember._id) {
				alert('Selected team member does not match the existing team member.');
				return;
			}

			if (selectedTeamMember.position === 'server') {
				dailyTotals.barTipOuts = 0;
				dailyTotals.runnerTipOuts = 0;
				dailyTotals.hostTipOuts = 0;
	
				for (const member of team) {
					// Check if the team member worked on the same date
					const workedSameDate = member.dailyTotals.some(
						(total) => total.date === dailyTotals.date
					);
	
					if (workedSameDate) {
						if (member.position === 'bartender') {
							dailyTotals.barTipOuts += calculateTipOuts(dailyTotals, 'bartender');
						} else if (member.position === 'host') {
							dailyTotals.hostTipOuts += calculateTipOuts(dailyTotals, 'host');
						} else if (member.position === 'runner') {
							dailyTotals.runnerTipOuts += calculateTipOuts(dailyTotals, 'runner');
						}
					}
				}
			} else {
				dailyTotals.barTipOuts = 0;
				dailyTotals.runnerTipOuts = 0;
				dailyTotals.hostTipOuts = 0;
			}

			const newDailyTotals = prepareDailyTotals(dailyTotals);

			try {
				await submitDailyTotalToServer(selectedTeamMember._id, newDailyTotals);
				console.log("🚀 ~ file: dailyTotals.js:119 ~ selectedTeamMember._id:", selectedTeamMember._id)
				console.log("🚀 ~ file: dailyTotals.js:119 ~ newDailyTotals:", newDailyTotals)
				setRefreshDailyTotals(prevState => !prevState);
				// setRefreshDailyTotals(newDailyTotals);

				clearFormFields();
				fetchDailyTotals();
			} catch (error) {
				handleSubmissionError(error, dailyTotals);
			}
		},
		[team, fetchDailyTotals, handleSubmissionError, calculateTipOuts, setRefreshDailyTotals]
	);

	const prepareDailyTotals = (dailyTotals) => {
		const totalTipOut = Number(dailyTotals.barTipOuts) + Number(dailyTotals.runnerTipOuts) + Number(dailyTotals.hostTipOuts);
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
				`ARE YOU SURE YOU WANT TO DELETE THE DAILY TOTAL FOR:\n\n${teamMember.teamMemberName.toUpperCase()}		ON:		${FormattedDate(date).toUpperCase()}?`
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
		[setError, fetchDailyTotals]
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

			<Typography variant="h1" component="h2" gutterBottom sx={{ marginBottom: '0.35em' }}>
				DAILY TOTALS
			</Typography>
			<DailyTotalsTable team={team} deleteDailyTotal={deleteDailyTotal} />
		</React.Fragment>
	);
}

export default DailyTotals;