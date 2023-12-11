import React, { useState, createContext } from 'react';

export const TeamContext = createContext();

export const TeamProvider = ({ children }) => {
    const [team, setTeam] = useState([]);
    const [refreshTeamMembers, setRefreshTeamMembers] = useState(false);

    return (
        <TeamContext.Provider value={{ team, setTeam, refreshTeamMembers, setRefreshTeamMembers }}>
            {children}
        </TeamContext.Provider>
    );
};