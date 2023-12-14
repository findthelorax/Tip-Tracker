import React, { useReducer, useMemo, useState } from 'react';
import { MantineProvider } from '@mantine/core';
import { TeamProvider } from '../contexts/TeamContext';
import { DailyTotalsProvider } from '../contexts/DailyTotalsContext';
import { ErrorProvider } from '../contexts/ErrorContext';
import Dashboard from './Dashboard';
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
function updateTeam(value) {
	return { type: 'updateTeam', payload: value };
}

function updateError(value) {
	return { type: 'updateError', payload: value };
}

function updateDailyTotals(value) {
	return { type: 'updateDailyTotals', payload: value };
}

// function updateWeeklyTotals(value) {
// 	return { type: 'updateWeeklyTotals', payload: value };
// }

function App() {
	const [state, dispatch] = useReducer(reducer, initialState);
	const [selectedTeamMember, setSelectedTeamMember] = useState(null);

	// Memoized context values
	const teamContextValue = useMemo(
		() => ({
			team: state.team,
			setTeam: (value) => dispatch(updateTeam(value)),
		}),
		[state.team]
	);

	const errorContextValue = useMemo(
		() => ({
			error: state.error,
			setError: (value) => dispatch(updateError(value)),
		}),
		[state.error]
	);

	const dailyTotalsContextValue = useMemo(
		() => ({
			dailyTotals: state.dailyTotals,
			setDailyTotals: (value) => dispatch(updateDailyTotals(value)),
			selectedTeamMember,
			setSelectedTeamMember,
		}),
		[state.dailyTotals, selectedTeamMember]
	);

	// const weeklyTotalsContextValue = useMemo(
	// 	() => ({
	// 		weekltTotals: state.weeklyTotals,
	// 		setWeeklyTotals: (value) => dispatch(updateWeeklyTotals(value)),
	// 	}),
	// 	[state.weeklyTotals]
	// );

	return (
		<MantineProvider>
			<ErrorProvider value={errorContextValue}>
				<TeamProvider value={teamContextValue}>
					<DailyTotalsProvider value={dailyTotalsContextValue}>
						<div className="App">
							<Dashboard refresh={state.refresh} error={state.error} />
						</div>
					</DailyTotalsProvider>
				</TeamProvider>
			</ErrorProvider>
		</MantineProvider>
	);
}

export default App;
