import { useCallback } from 'react';

export const useClearFormFields = (initialDailyTotals, setDailyTotals) => {
    const clearFormFields = useCallback(() => {
        setDailyTotals(initialDailyTotals);
    }, [initialDailyTotals, setDailyTotals]);

    return clearFormFields;
};