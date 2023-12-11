import React, { useState, createContext } from 'react';

export const DailyTotalsContext = createContext();

export const DailyTotalsProvider = ({ children }) => {
    const [dailyTotalsAll, setdailyTotalsAll] = useState([]);
    const [refreshDailyTotals, setRefreshDailyTotals] = useState(false);

    return (
        <DailyTotalsContext.Provider value={{ refreshDailyTotals, setRefreshDailyTotals,
            dailyTotalsAll,
            setdailyTotalsAll}}>
            {children}
        </DailyTotalsContext.Provider>
    );
};