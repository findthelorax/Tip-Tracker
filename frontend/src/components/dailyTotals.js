import React, { useState, useEffect, useContext, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import DailyTotalsForm from './dailyTotalsForm';
import DailyTotalsTable from './dailyTotalsTable';
import { TeamContext } from './contexts/TeamContext';
import { DailyTotalsContext } from './contexts/DailyTotalsContext';
import { ErrorContext } from './contexts/ErrorContext';
import {
	fetchDailyTotalsAll,
	deleteDailyTotalFromServer,
	submitDailyTotalToServer,
} from './utils/api';
import { FormattedDate } from './utils/dateUtils';

const useStyles = makeStyles({
	tableRow: {
		'&:nth-of-type(odd)': {
			backgroundColor: '#f4f4f4', // change this to your desired color
		},
	},
});

const today = new Date();
const localDate = new Date(
	today.getFullYear(),
	today.getMonth(),
	today.getDate()
)
	.toISOString()
	.split('T')[0];
// const timeZone = "America/New_York";

function DailyTotals() {
	const classes = useStyles();
	const { team, setTeam } = useContext(TeamContext);
	const { selectedTeamMember, setSelectedTeamMember, setDailyTotalsAll } = useContext(DailyTotalsContext);
	const { setError } = useContext(ErrorContext);
	const [dailyTotals, setDailyTotals] = useState({
		date: localDate,
		foodSales: 0,
		barSales: 0,
		nonCashTips: 0,
		cashTips: 0,
		barTipOuts: 0,
		runnerTipOuts: 0,
		hostTipOuts: 0,
		totalTipOuts: 0,
		tipsReceived: 0,
		totalPayrollTips: 0,
	});

	
	const handleSubmissionError = useCallback((error, dailyTotals) => {
		if (error.response && error.response.status === 400) {
			alert(
				`Totals on ${dailyTotals.date} for ${selectedTeamMember.teamMemberName} - ${selectedTeamMember.position} already exists.`
			);
		} else {
			alert('An error occurred while submitting daily totals.');
		}
		console.error(error);
	}, [selectedTeamMember]);

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
	}, [fetchDailyTotals]);

	// submitDailyTotals function breakdown
	const submitDailyTotals = useCallback(
		async (dailyTotals, selectedTeamMember) => {
			const existingTeamMember = team.find(
				(member) => member._id === selectedTeamMember._id
			);

			if (!selectedTeamMember) {
				alert('Selected team member not found in the team list.');
				return;
			}

			if (existingTeamMember._id !== selectedTeamMember._id) {
				alert(
					'Selected team member does not match the existing team member.'
				);
				return;
			}

			const newDailyTotals = prepareDailyTotals(dailyTotals);

			try {
				await submitDailyTotalToServer(
					selectedTeamMember._id,
					newDailyTotals
				);
				clearFormFields(setDailyTotals);
				fetchDailyTotals();
			} catch (error) {
				handleSubmissionError(error, dailyTotals);
			}
		},
		[team, fetchDailyTotals, handleSubmissionError]
	);

	const prepareDailyTotals = (dailyTotals) => {
		return {
			date: dailyTotals.date,
			foodSales: dailyTotals.foodSales,
			barSales: dailyTotals.barSales,
			nonCashTips: dailyTotals.nonCashTips,
			cashTips: dailyTotals.cashTips,
			barTipOuts: dailyTotals.barTipOuts,
			runnerTipOuts: dailyTotals.runnerTipOuts,
			hostTipOuts: dailyTotals.hostTipOuts,
			totalTipOuts: dailyTotals.totalTipOuts,
			tipsReceived: dailyTotals.tipsReceived,
			totalPayrollTips: dailyTotals.totalPayrollTips,
		};
	};

	const clearFormFields = (setDailyTotals) => {
		setDailyTotals({
			teamMember: '',
			date: new Date(),
			foodSales: 0,
			barSales: 0,
			nonCashTips: 0,
			cashTips: 0,
			barTipOuts: 0,
			runnerTipOuts: 0,
			hostTipOuts: 0,
			totalTipOuts: 0,
			tipsReceived: 0,
			totalPayrollTips: 0,
		});
	};

	const deleteDailyTotal = useCallback(
		async (dailyTotal, existingTeamMember) => {
			const formattedDate = FormattedDate(dailyTotal.date);
			const confirmation = window.confirm(
				`ARE YOU SURE YOU WANT TO DELETE THE DAILY TOTAL FOR:\n\n${dailyTotal.teamMemberName.toUpperCase()}		ON:		${formattedDate.toUpperCase()}?`
			);
			if (!confirmation) {
				return;
			}
			try {
				if (!existingTeamMember) {
					console.error('Existing team member not found');
					alert('Failed to delete daily total');
					return;
				}
				if (!dailyTotal || !dailyTotal._id) {
					console.error(
						`dailyTotal._id is undefined: , ${dailyTotal}, ID: ,  ${dailyTotal._id}`
					);
					return;
				}
				const response = await deleteDailyTotalFromServer(
					existingTeamMember._id,
					dailyTotal._id
				);
				console.log(response);
				fetchDailyTotals();
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

			<Typography variant="h1" component="h2" gutterBottom>
				DAILY TOTALS
			</Typography>

			<DailyTotalsTable
				team={team}
				classes={classes}
				deleteDailyTotal={deleteDailyTotal}
			/>
		</React.Fragment>
	);
}

export default DailyTotals;
