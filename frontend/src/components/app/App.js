import React, { useReducer, useMemo, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TeamProvider } from '../contexts/TeamContext';
import { DailyTotalsProvider } from '../contexts/DailyTotalsContext';
import { ErrorProvider } from '../contexts/ErrorContext';
import Dashboard from './Dashboard';
import Login from './Login';
import Signup from './Signup';
import Profile from './Profile';
import { fetchProfile } from '../utils/api';
// import logo from '../../logo.svg';
import AdminRegister from './Admin';
import Main from './Main';
import { AuthProvider } from '../contexts/AuthContext'; // Adjust the path as necessary

const initialState = {
	team: [],
	error: null,
	refresh: false,
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
											<Dashboard refresh={state.refresh} error={state.error} />
										) : (
											<Signup />
										)
									}
								/>
								<Route
									path="/dashboard"
									element={<Dashboard refresh={state.refresh} error={state.error} />}
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
	);
}

export default App;