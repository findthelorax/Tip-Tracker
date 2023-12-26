import React, { useReducer, useMemo, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TeamProvider } from '../contexts/TeamContext';
import { DailyTotalsProvider } from '../contexts/DailyTotalsContext';
import { ErrorProvider } from '../contexts/ErrorContext';
// import Dashboard from './Dashboard';
import Login from '../pages/login/Login';
import Signup from '../pages/signup/Signup';
import Profile from '../pages/profile/Profile';
import MainLayout from '../pages/dashboard/mainLayout';
import { fetchProfile } from '../utils/api';
// import logo from '../../logo.svg';
import AdminRegister from '../pages/admin/Admin';
import Main from '../pages/Main';
import { AuthProvider } from '../contexts/AuthContext'; // Adjust the path as necessary
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '../theme/index';

const initialState = {
	team: [],
	error: null,
};

function reducer(state, action) {
	switch (action.type) {
		case 'updateTeam':
			return { ...state, team: action.payload };
		case 'updateDailyTotals':
			return { ...state, dailyTotals: action.payload };
		case 'updateWeeklyTotals':
			return { ...state, WeeklyTotals: action.payload };
		case 'updateError':
			return { ...state, error: action.payload };
		default:
			return state;
	}
}

// Action creators
function updateError(value) {
	return { type: 'updateError', payload: value };
}

function App() {
	const [state, dispatch] = useReducer(reducer, initialState);
	const [loggedIn, setLoggedIn] = useState(false);

	const theme = createTheme();
	// Memoized context values
	const errorContextValue = useMemo(
		() => ({
			error: state.error,
			setError: (value) => dispatch(updateError(value)),
		}),
		[state.error]
	);

	useEffect(() => {
		fetchProfile()
			.then((response) => {
				if (response.status === 200) {
					setLoggedIn(true);
				} else if (response.status === 401) {
					setLoggedIn(false);
				} else {
					throw new Error('Unexpected status code');
				}
			})
			.catch((error) => {
				console.error('Error:', error);
				setLoggedIn(false);
			});
	}, []);

	return (
		<ThemeProvider theme={theme}>
			<LocalizationProvider dateAdapter={AdapterMoment}>
				<AuthProvider>
					<Router>
						<ErrorProvider value={errorContextValue}>
							<TeamProvider>
								<DailyTotalsProvider>
									<div className="App">
										<Routes>
											<Route
												path="/"
												element={
													loggedIn ? (
														<MainLayout error={state.error} />
													) : (
														<Signup />
													)
												}
											/>
											<Route
												path="/dashboard"
												element={<MainLayout error={state.error} />}
											/>
											<Route path="/login" element={<Login />} />
											<Route path="/signup" element={<Signup />} />
											<Route path="/profile" element={<Profile />} />
											<Route path="/admin/register" element={<AdminRegister />} />
											<Route path="/" element={<Main />} />
										</Routes>
									</div>
								</DailyTotalsProvider>
							</TeamProvider>
						</ErrorProvider>
					</Router>
				</AuthProvider>
			</LocalizationProvider>
		</ThemeProvider>
	);
}

export default App;
