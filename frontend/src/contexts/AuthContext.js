import React, { createContext, useContext, useState, useEffect, navigate } from 'react';
import axios from 'axios';
import { setAuthToken } from '../hooks/authToken'; // This is a utility function to set the token in the axios headers

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
		return response.data;
	};

	const logout = () => {
		// Remove token from local storage
		localStorage.removeItem('jwtToken');
		// Remove auth header for future requests
		setAuthToken(false);

		// Remove the Authorization header
		delete axios.defaults.headers.common['Authorization'];

		// Set current user to empty object {} which will set isAuthenticated to false
		setCurrentUser(null);

		// Navigate to the login page or show a logout message
		navigate('/login');
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