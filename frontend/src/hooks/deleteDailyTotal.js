import { useCallback, useContext } from 'react';
import { ErrorContext } from '../contexts/ErrorContext';
import { TeamContext } from '../contexts/TeamContext'; // import TeamContext
import { deleteDailyTotalFromServer } from '../utils/api';
import { FormattedDate } from '../hooks/utils';

export const useDeleteDailyTotal = (fetchDailyTotals, setRefreshDailyTotals) => {
    const { setError } = useContext(ErrorContext);
    const { team, setTeam } = useContext(TeamContext); // use setTeam from TeamContext

    return useCallback(
        async (teamMember, dailyTotal) => {
            const confirmation = window.confirm(
                `ARE YOU SURE YOU WANT TO DELETE THE DAILY TOTAL FOR:\n\n${teamMember.teamMemberName.toUpperCase()}		ON:		${FormattedDate(
                    dailyTotal.date
                ).toUpperCase()}?`
            );
            if (!confirmation) {
                return;
            }

            try {
                if (!teamMember._id || !dailyTotal._id) {
                    console.error('teamMember or daily total is undefined');
                    alert('Failed to delete daily total');
                    return;
                }

                const response = await deleteDailyTotalFromServer(teamMember._id, dailyTotal._id);
                console.log(response);
                setRefreshDailyTotals((prevState) => !prevState); // add this line
                if (response.status === 200) {
                    // create a new team array with the updated team member
                    const newTeam = team.map(member => 
                        member._id === teamMember._id 
                            ? { ...member, dailyTotals: member.dailyTotals.filter(total => total.date !== dailyTotal._id) } 
                            : member
                    );
                    setTeam(newTeam); // set the new team array
                    fetchDailyTotals();
                }
            } catch (error) {
                setError(`Error deleting daily total: ${error.message}`);
                alert(`Failed to delete daily totals: ${error.message}`);
            }
        },
        [setError, fetchDailyTotals, setRefreshDailyTotals, team, setTeam]
    );
};