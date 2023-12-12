import React, { useReducer, useMemo } from 'react';
import Header from './components/header';
import TeamOperations from './components/teamMembers';
import DatabaseOperations from './components/databaseOps';
import WeeklySales from './components/weeklySales';
import DailyTotals from './components/dailyTotals';
import ErrorComponent from './components/errorComponent';
import { TeamProvider } from './components/contexts/TeamContext';
import { DailyTotalsProvider } from './components/contexts/DailyTotalsContext';
import { ErrorProvider } from './components/contexts/ErrorContext';

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
		case 'updateWeeklySales':
			return { ...state, weeklySales: action.payload };
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

// function updateWeeklySales(value) {
//     return { type: 'updateWeeklySales', payload: value };
// }

// function updateTeamMembers(value) {
//     return { type: 'updateTeamMembers', payload: value };
// }

// function updateDailyTotalsAll(value) {
//     return { type: 'updateDailyTotalsAll', payload: value };
// }

function App() {
	const [state, dispatch] = useReducer(reducer, initialState);

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
		}),
		[state.dailyTotals]
	);

	// const weeklySalesContextValue = useMemo(() => ({
	//     weeklySales: state.weeklySales,
	//     setWeeklySales: (value) => dispatch(updateWeeklySales(value)),
	// }), [state.weeklySales]);

	// const dailyTotalsAllContextValue = useMemo(() => ({
	//     dailyTotalsAll: state.dailyTotalsAll,
	//     setDailyTotalsAll: (value) => dispatch(updateDailyTotalsAll(value)),
	// }), [state.dailyTotalsAll]);

	// const teamMembersContextValue = useMemo(() => ({
	//     teamMembers: state.teamMembers,
	//     setTeamMembers: (value) => dispatch(updateTeamMembers(value)),
	// }), [state.teamMembers]);

	return (
			<ErrorProvider value={errorContextValue}>
				<TeamProvider value={teamContextValue}>
					<DailyTotalsProvider value={dailyTotalsContextValue}>
						<div className="App">
							<Header />
							<DatabaseOperations />
							<TeamOperations />
							<DailyTotals refresh={state.refresh} />
							<WeeklySales refresh={state.refresh} />
							<ErrorComponent error={state.error} />
						</div>
					</DailyTotalsProvider>
				</TeamProvider>
			</ErrorProvider>
	);
}

export default App;
