import React, { createContext, useState } from 'react';

export const TeamContext = createContext();

export const TeamProvider = ({ children }) => {
    const [team, setTeam] = useState([]);

    return (
        <TeamContext.Provider value={{ team, setTeam }}>
            {children}
        </TeamContext.Provider>
    );
};