import { useState, useCallback, useContext } from 'react';
import { ErrorContext } from '../contexts/ErrorContext';
import { fetchDailyTotalsAll } from '../utils/api';

export const useFetchDailyTotals = () => {
    const [dailyTotalsAll, setDailyTotalsAll] = useState([]);
    const { setError } = useContext(ErrorContext);

    const fetchDailyTotals = useCallback(async () => {
        try {
            const data = await fetchDailyTotalsAll();
            setDailyTotalsAll(data);
        } catch (error) {
            console.error(error);
            setError(error.message);
        }
    }, [setError]);

    return { dailyTotalsAll, fetchDailyTotals };
};