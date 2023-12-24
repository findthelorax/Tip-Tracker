import { useContext } from 'react';
import { useClearFormFields } from '../hooks/clearFormFields';
import { TeamContext } from '../contexts/TeamContext'; // import TeamContext
import { CalculateTipOuts } from './tipOuts'; // import CalculateTipOuts

export const useHandleSubmit = (submitDailyTotals, dailyTotals, selectedTeamMember, setSelectedTeamMember, initialDailyTotals, setDailyTotals) => {
    const clearFormFields = useClearFormFields(initialDailyTotals, setDailyTotals);
    const { team, setTeam } = useContext(TeamContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { date, ...otherFields } = dailyTotals;
        // Calculate the tip outs for the selected team member
        const tipOuts = CalculateTipOuts(dailyTotals, selectedTeamMember, team);
        try {
            // Include the calculated tip outs when you submit the daily totals
            const data = await submitDailyTotals({ date: date, tipOuts: tipOuts, ...otherFields }, selectedTeamMember);
            console.log('Success:', data);
            // create a new team array with the updated team member
            const newTeam = team.map(member => 
                member._id === selectedTeamMember._id 
                    ? { ...member, dailyTotals: [...member.dailyTotals, { date: date, tipOuts: tipOuts, ...otherFields }] } 
                    : member
            );
            setTeam(newTeam); // set the new team array
        } catch (error) {
            console.error('Error:', error);
        }
        setSelectedTeamMember('');
        clearFormFields();
    };

    return handleSubmit;
};