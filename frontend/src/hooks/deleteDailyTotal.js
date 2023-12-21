import { useCallback, useContext } from 'react';
import { ErrorContext } from '../contexts/ErrorContext';
import { TeamContext } from '../contexts/TeamContext'; // import TeamContext
import { deleteDailyTotalFromServer } from '../utils/api';
import { FormattedDate } from '../hooks/utils';

export const useDeleteDailyTotal = (fetchDailyTotals, setRefreshDailyTotals) => {
    const { setError } = useContext(ErrorContext);
    const { team, setTeam } = useContext(TeamContext); // use setTeam from TeamContext

    return useCallback(
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

                const response = await deleteDailyTotalFromServer(teamMember._id, date);
                console.log(response);
                setRefreshDailyTotals((prevState) => !prevState); // add this line
                if (response.status === 200) {
                    // create a new team array with the updated team member
                    const newTeam = team.map(member => 
                        member._id === teamMember._id 
                            ? { ...member, dailyTotals: member.dailyTotals.filter(total => total.date !== date) } 
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
        [setError, fetchDailyTotals, setRefreshDailyTotals, team, setTeam] // add team and setTeam to the dependencies array
    );
};