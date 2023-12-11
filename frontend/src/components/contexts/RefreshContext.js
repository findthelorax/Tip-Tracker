import { createContext, useContext, useState } from 'react';

const RefreshContext = createContext();

export const useRefresh = () => useContext(RefreshContext);

export const RefreshProvider = ({ children }) => {
    const [refresh, setRefresh] = useState(false);

    return (
        <RefreshContext.Provider value={{  refresh, setRefresh }}>
            {children}
        </RefreshContext.Provider>
    );
};