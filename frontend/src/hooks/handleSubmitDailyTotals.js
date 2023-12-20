import { useCallback } from 'react';
import { useClearFormFields } from '../hooks/clearFormFields';

export const useHandleSubmit = (submitDailyTotals, dailyTotals, selectedTeamMember, setSelectedTeamMember, initialDailyTotals, setDailyTotals) => {
    const clearFormFields = useClearFormFields(initialDailyTotals, setDailyTotals);
    return useCallback(
        async (e) => {
            e.preventDefault();
            const { date, ...otherFields } = dailyTotals;
            try {
                const data = await submitDailyTotals({ date: date, ...otherFields }, selectedTeamMember);
                console.log('Success:', data);
            } catch (error) {
                console.error('Error:', error);
            }
            setSelectedTeamMember('');
            clearFormFields();
        },
        [submitDailyTotals, dailyTotals, selectedTeamMember, setSelectedTeamMember, clearFormFields]
    );
};