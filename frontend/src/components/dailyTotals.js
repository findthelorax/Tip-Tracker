import React, { useState, useEffect, useContext, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import DailyTotalsForm from './dailyTotalsForm';
import DailyTotalsTable from './dailyTotalsTable';
import { TeamContext } from './contexts/TeamContext';
import { ErrorContext } from './contexts/ErrorContext';

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
	const { setError } = useContext(ErrorContext);
	const [dailyTotalsAll, setDailyTotalsAll] = useState([]);
	const [dailyTotals, setDailyTotals] = useState({
		teamMemberName: '',
		position: '',
		date: localDate,
		foodSales: '',
		barSales: '',
		nonCashTips: '',
		cashTips: '',
		barTipOuts: '',
		runnerTipOuts: '',
		hostTipOuts: '',
		totalTipOuts: '',
		tipsReceived: '',
		totalPayrollTips: '',
	});

	const fetchDailyTotals = useCallback(async () => {
		try {
			const data = await fetchDailyTotalsAll();
			setDailyTotalsAll(data);
		} catch (error) {
			console.error(error);
			setError(error.message);
		}
	}, [setError]);

	useEffect(() => {
		fetchDailyTotals();
	}, [fetchDailyTotals]);

	// submitDailyTotals function breakdown
	const submitDailyTotals = useCallback(
		async (dailyTotals) => {
			if (!validateDailyTotals(dailyTotals, dailyTotalsAll)) {
				return;
			}

			const selectedTeamMember = findCorrespondingTeamMember(
				team,
				dailyTotals
			);

			console.log('team SUBMIT:', team);
			console.log('dailyTotals SUBMIT:', dailyTotals);
			console.log('selectedTeamMember SUBMIT:', selectedTeamMember);

			if (!selectedTeamMember) {
				alert('Selected team member not found in the team list.');
				return;
			}

			const newDailyTotals = prepareDailyTotals(
				selectedTeamMember,
				dailyTotals
			);

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
		[team, dailyTotalsAll, fetchDailyTotals]
	);

	const validateDailyTotals = (dailyTotals, dailyTotalsAll) => {
		if (
			!dailyTotals.teamMemberName &&
			!dailyTotals.position &&
			!dailyTotals.date
		) {
			alert('INVALID DATA!');
			console.log(dailyTotals);
			return false;
		}

		const isDuplicateDailyTotal = dailyTotalsAll.find(
			(total) =>
				total.teamMemberName === dailyTotals.teamMemberName &&
				total.position === dailyTotals.position &&
				total.date === dailyTotals.date
		);

		if (isDuplicateDailyTotal) {
			alert(
				`${isDuplicateDailyTotal.date} totals for ${isDuplicateDailyTotal.teamMemberName} - ${isDuplicateDailyTotal.position} already exist.`
			);
			return false;
		}
		return true;
	};

	const prepareDailyTotals = (selectedTeamMember, dailyTotals) => {
		return {
			teamMemberName: selectedTeamMember.teamMemberName,
			position: selectedTeamMember.position,
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
			foodSales: '',
			barSales: '',
			nonCashTips: '',
			cashTips: '',
		});
	};

	const handleSubmissionError = (error, dailyTotals) => {
		if (error.response && error.response.status === 400) {
			alert(
				`Totals on ${dailyTotals.date} for ${dailyTotals.teamMember} - ${dailyTotals.position} already exists.`
			);
		} else {
			alert('An error occurred while submitting daily totals.');
		}
		console.error(error);
	};

	const deleteDailyTotal = useCallback(
		async (dailyTotal, correspondingTeamMember) => {
			const formattedDate = FormattedDate(dailyTotal.date);
			const confirmation = window.confirm(
				`ARE YOU SURE YOU WANT TO DELETE THE DAILY TOTAL FOR:\n\n${dailyTotal.teamMemberName.toUpperCase()}		ON:		${formattedDate.toUpperCase()}?`
			);
			if (!confirmation) {
				return;
			}
			try {
				if (!correspondingTeamMember) {
					console.error('Corresponding team member not found');
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
					correspondingTeamMember._id,
					dailyTotal._id
				);

				fetchDailyTotals();
				console.log(`deleteDailyTotal: ${response.data}`);
			} catch (error) {
				setError(`Error deleting daily total: ${error.message}`);
				alert(`Failed to delete daily totals: ${error.message}`);
			}
		},
		[setError, fetchDailyTotals]
	);

	const findCorrespondingTeamMember = (team, dailyTotal) => {
		const result = team.find((member) => member._id === dailyTotal._id);
		console.log('findCorrespondingTeamMember:', result);
		return result;
	};

    return (
        <React.Fragment>
            <DailyTotalsForm
                dailyTotals={dailyTotals}
                setDailyTotals={setDailyTotals}
                submitDailyTotals={submitDailyTotals}
                team={team}
                setTeam={setTeam}
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
};

export default DailyTotals;