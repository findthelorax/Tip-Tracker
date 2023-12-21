import { useCallback } from 'react';
import { submitDailyTotalToServer } from '../utils/api';
import { prepareDailyTotals } from '../hooks/prepareDailyTotals';

export const useSubmitDailyTotals = (
    team,
    fetchDailyTotals,
    handleSubmissionError,
    tipOuts,
    setRefreshDailyTotals,
    updateTeamMemberTipOuts,
    clearFormFields
) => {

    return useCallback(
        async (dailyTotals, selectedTeamMember) => {
            const existingTeamMember = team.find((member) => member._id === selectedTeamMember._id);
            if (!existingTeamMember) {
                alert('Selected team member does not match an existing team member.');
                return;
            }
            if (selectedTeamMember.position === 'server') {
                dailyTotals.barTipOuts = tipOuts.bartender;
                dailyTotals.runnerTipOuts = tipOuts.runner;
                dailyTotals.hostTipOuts = tipOuts.host;

                for (const member of team) {
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
};