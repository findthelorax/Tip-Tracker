import React, { createContext, useContext, useState } from 'react';

// Create the context
const AuthContext = createContext();

// Create a custom hook that allows easy access to the context
export function useAuth() {
    return useContext(AuthContext);
}

// Create a provider component
export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);

    // Make functions for logging in, logging out, signing up, etc.


    const value = {
        currentUser,
        setCurrentUser,
        // Add any additional state and functions here
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}