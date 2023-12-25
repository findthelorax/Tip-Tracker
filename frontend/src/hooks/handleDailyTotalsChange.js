import { useContext } from 'react';
import { TeamContext } from '../contexts/TeamContext'; // import TeamContext

export const useHandleDailyTotalsChange = (setDailyTotals, setSelectedTeamMember) => {
    const { team } = useContext(TeamContext); // use setTeam from TeamContext
    const handleDailyTotalsChange = (field, value) => {
        if (field === 'teamMemberId') {
            const teamMember = team.find((member) => member._id === value);
            setSelectedTeamMember(teamMember);
        } else {
            let updates = { [field]: value === '' ? 0 : value };
            setDailyTotals((prevDailyTotals) => ({
                ...prevDailyTotals,
                ...updates,
            }));
        }
    };

    return handleDailyTotalsChange;
};