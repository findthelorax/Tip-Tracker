import React, { useReducer, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TeamProvider } from '../contexts/TeamContext';
import { DailyTotalsProvider } from '../contexts/DailyTotalsContext';
import { ErrorProvider } from '../contexts/ErrorContext';
import Dashboard from './Dashboard';
import Login from './Login';
import Signup from './Signup';
// import logo from '../../logo.svg';

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

	// Memoized context values
	const errorContextValue = useMemo(
		() => ({
			error: state.error,
			setError: (value) => dispatch(updateError(value)),
		}),
		[state.error]
	);

	return (
		<Router>
			<ErrorProvider value={errorContextValue}>
				<TeamProvider>
					<DailyTotalsProvider>
						<div className="App">
							<Routes>
								<Route
									path="/dashboard"
									element={<Dashboard refresh={state.refresh} error={state.error} />}
								/>
								<Route path="/login" element={<Login />} />
								<Route path="/signup" element={<Signup />} />
							</Routes>
						</div>
					</DailyTotalsProvider>
				</TeamProvider>
			</ErrorProvider>
		</Router>
	);
}

export default App;
