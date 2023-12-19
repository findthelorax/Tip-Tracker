import { deleteDailyTotalFromServer, fetchDailyTotalsAll, submitDailyTotalToServer } from '../utils/api';
import { CalculateTipOuts, FormattedDate } from '../logic/utils';
import moment from 'moment';

export const handleSubmissionError = (error, dailyTotals, selectedTeamMember) => {
	if (error.response && error.response.status === 400) {
		alert(
			`Totals on ${dailyTotals.date} for ${selectedTeamMember.teamMemberName} - ${selectedTeamMember.position} already exists.`
		);
	} else {
		alert('An error occurred while submitting daily totals.');
	}
	console.error(error);
};

export const fetchDailyTotals = async (setError, setDailyTotalsAll) => {
	try {
		const data = await fetchDailyTotalsAll();
		setDailyTotalsAll(data);
	} catch (error) {
		console.error(error);
		setError(error.message);
	}
};

export const submitDailyTotals = async (
	dailyTotals,
	selectedTeamMember,
	team,
	fetchDailyTotals,
	handleSubmissionError,
	tipOuts,
	setRefreshDailyTotals,
	updateTeamMemberTipOuts,
	clearFormFields
) => {
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
			const workedSameDate = member.dailyTotals.some((total) => total.date === dailyTotals.date);

			if (workedSameDate) {
				if (member.position === 'bartender') {
					dailyTotals.barTipOuts += CalculateTipOuts(dailyTotals, 'bartender');
				} else if (member.position === 'host') {
					dailyTotals.hostTipOuts += CalculateTipOuts(dailyTotals, 'host');
				} else if (member.position === 'runner') {
					dailyTotals.runnerTipOuts += CalculateTipOuts(dailyTotals, 'runner');
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
		setRefreshDailyTotals((prevState) => !prevState);
		// setRefreshDailyTotals(newDailyTotals);

		clearFormFields();
		fetchDailyTotals();
	} catch (error) {
		handleSubmissionError(error, dailyTotals, selectedTeamMember);
	}
};

export const prepareDailyTotals = (dailyTotals) => {
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

export const deleteDailyTotal = async (teamMember, date, setError, fetchDailyTotals, setRefreshDailyTotals, team) => {
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
			fetchDailyTotals();
		} catch (error) {
			setError(`Error deleting daily total: ${error.message}`);
			alert(`Failed to delete daily totals: ${error.message}`);
		}
	} catch (error) {
		setError(`Error deleting daily total: ${error.message}`);
		alert(`Failed to delete daily totals: ${error.message}`);
	}
};

export const tipOuts = (dailyTotals, selectedTeamMember, team) => CalculateTipOuts(dailyTotals, selectedTeamMember, team)

export const updateTeamMemberTipOuts = async (date, position, tipOut, team, dailyTotals, setError) => {
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
};
