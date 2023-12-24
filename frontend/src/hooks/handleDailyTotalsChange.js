import { useState } from 'react';

export const useHandleDailyTotalsChange = (team, setDailyTotals, setSelectedTeamMember) => {
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