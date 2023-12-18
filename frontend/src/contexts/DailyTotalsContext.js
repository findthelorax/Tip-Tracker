import React, { useState, createContext } from 'react';

export const DailyTotalsContext = createContext();

export const DailyTotalsProvider = ({ children }) => {
    const [dailyTotalsAll, setDailyTotalsAll] = useState([]);
    const [refreshDailyTotals, setRefreshDailyTotals] = useState(false);
    const [selectedTeamMember, setSelectedTeamMember] = useState("");

    return (
        <DailyTotalsContext.Provider value={{ refreshDailyTotals, setRefreshDailyTotals,
            dailyTotalsAll,
            setDailyTotalsAll, selectedTeamMember, setSelectedTeamMember }}>
            {children}
        </DailyTotalsContext.Provider>
    );
};