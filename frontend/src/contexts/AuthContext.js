import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
// import jwt_decode from 'jwt-decode';
import { setAuthToken } from '../logic/utils'; // This is a utility function to set the token in the axios headers

// Create the context
const AuthContext = createContext();

// Create a custom hook that allows easy access to the context
export function useAuth() {
    return useContext(AuthContext);
}

// Create a provider component
export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        // Check for token to keep user logged in
        if (localStorage.jwtToken) {
            // Set token to headers
            const token = localStorage.jwtToken;
            setAuthToken(token);
            // Decode token and get user info
            // const decoded = jwt_decode(token);
            // Set user
            // setCurrentUser(decoded);
        }
    }, []);

    const signup = async (userData) => {
        const response = await axios.post('/api/users/register', userData);
        return response.data;
    };

    const login = async (userData) => {
        const response = await axios.post('/api/users/login', userData);
        const { token } = response.data;
        localStorage.setItem('jwtToken', token);
        setAuthToken(token);
        // const decoded = jwt_decode(token);
        // setCurrentUser(decoded);
        return response.data;
    };

    const logout = () => {
        // Remove token from local storage
        localStorage.removeItem('jwtToken');
        // Remove auth header for future requests
        setAuthToken(false);
        // Set current user to empty object {} which will set isAuthenticated to false
        setCurrentUser(null);
    };

    const value = {
        currentUser,
        setCurrentUser,
        signup,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}