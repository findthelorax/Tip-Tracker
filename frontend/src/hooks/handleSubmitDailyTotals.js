import { useCallback, useContext } from 'react';
import { useClearFormFields } from '../hooks/clearFormFields';
import { TeamContext } from '../contexts/TeamContext'; // import TeamContext

export const useHandleSubmit = (submitDailyTotals, dailyTotals, selectedTeamMember, setSelectedTeamMember, initialDailyTotals, setDailyTotals) => {
    const clearFormFields = useClearFormFields(initialDailyTotals, setDailyTotals);
    const { team, setTeam } = useContext(TeamContext); // use setTeam from TeamContext

    return useCallback(
        async (e) => {
            e.preventDefault();
            const { date, ...otherFields } = dailyTotals;
            try {
                const data = await submitDailyTotals({ date: date, ...otherFields }, selectedTeamMember);
                console.log('Success:', data);
                // create a new team array with the updated team member
                const newTeam = team.map(member => 
                    member._id === selectedTeamMember._id 
                        ? { ...member, dailyTotals: [...member.dailyTotals, { date: date, ...otherFields }] } 
                        : member
                );
                setTeam(newTeam); // set the new team array
            } catch (error) {
                console.error('Error:', error);
            }
            setSelectedTeamMember('');
            clearFormFields();
        },
        [submitDailyTotals, dailyTotals, selectedTeamMember, setSelectedTeamMember, clearFormFields, team, setTeam] // add team and setTeam to the dependencies array
    );
};