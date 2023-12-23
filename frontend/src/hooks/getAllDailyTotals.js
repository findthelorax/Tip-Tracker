import { useState, useCallback, useContext } from 'react';
import { ErrorContext } from '../contexts/ErrorContext';
import { getAllDailyTotals } from '../utils/api';

export const useGetAllDailyTotals = () => {
    const [ allDailyTotals, setAllDailyTotals] = useState([]);
    const { setError } = useContext(ErrorContext);

    const fetchAllDailyTotals = useCallback(async () => {
        try {
            const data = await getAllDailyTotals();
            setAllDailyTotals(data);
        } catch (error) {
            console.error(error);
            setError(error.message);
        }
    }, [setError]);

    return { allDailyTotals, fetchAllDailyTotals };
};