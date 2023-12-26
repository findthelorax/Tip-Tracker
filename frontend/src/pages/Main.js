import React from 'react';
import { useAuth } from '../contexts/AuthContext'; // Adjust the path as necessary
import Dashboard from '../app/Dashboard';
import Login from './login/Login';

function Main() {
    const { currentUser } = useAuth(); // Get the current user from the AuthContext

    if (currentUser) {
        return <Dashboard />; // If the user is logged in, render the Dashboard component
    } else {
        return <Login />; // If the user is not logged in, render the Login component
    }
}

export default Main;