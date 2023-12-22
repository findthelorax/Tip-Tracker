import { useCallback, useContext } from 'react';
import { ErrorContext } from '../contexts/ErrorContext';
import { TeamContext } from '../contexts/TeamContext';
import { submitDailyTotalToServer } from '../utils/api';
import moment from 'moment';

export const useUpdateTeamMemberTipOuts = () => {
    const { team } = useContext(TeamContext);
    const { setError } = useContext(ErrorContext);

    return useCallback(
        async (date, position, tipOut, dailyTotals) => {
            console.log("🚀 ~ file: updateTeamMemberTipOuts.js:13 ~ position:", position)
            console.log("🚀 ~ file: updateTeamMemberTipOuts.js:13 ~ dailyTotals:", dailyTotals)
            console.log("🚀 ~ file: updateTeamMemberTipOuts.js:13 ~ tipOut:", tipOut)
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
        [team, setError]
    );
};