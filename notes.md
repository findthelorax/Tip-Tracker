##Custom Errors:
```
// CustomError.js
class CustomError extends Error {
  constructor(name, httpStatusCode, description, isOperational) {
    super(description);

    Object.setPrototypeOf(this, new.target.prototype);

    this.name = name;
    this.httpStatusCode = httpStatusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this);
  }
}

module.exports = CustomError;
```

- You can use this CustomError class to throw errors in your routes. For example:
```
const CustomError = require('./CustomError');

app.get('/api/someRoute', (req, res, next) => {
  try {
    // Some code that might throw an error
    throw new CustomError('DatabaseError', 500, 'Failed to fetch data from database', true);
  } catch (error) {
    next(error);
  }
});
```

- In your error handling middleware, you can check if the error is an instance of CustomError and handle it accordingly:
```
app.use((err, req, res, next) => {
  if (err instanceof CustomError) {
    // Handle custom error
    res.status(err.httpStatusCode).json({ error: err.message });
  } else {
    // Handle generic error
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
```

- To log errors to an external service like Sentry, you can install the @sentry/node package:
```
npm install @sentry/node
```

- Then, you can initialize Sentry in your server file:
```
const Sentry = require('@sentry/node');

Sentry.init({ dsn: 'YOUR_SENTRY_DSN' });
```

- And use Sentry's error handling middleware:
```
app.use(Sentry.Handlers.errorHandler());
```


- In your route files (e.g., backend/routes/dailyTotals.js, backend/routes/database.js, etc.), import the CustomError class and use it to throw errors. For example:

```
const CustomError = require('../CustomError');

// In your route
app.get('/api/someRoute', (req, res, next) => {
	try {
		// Some code that might throw an error
		throw new CustomError('DatabaseError', 500, 'Failed to fetch data from database', true);
	} catch (error) {
		next(error);
	}
});
```

- In your backend/server.js file, add the error handling middleware:
```
app.use((err, req, res, next) => {
	if (err instanceof CustomError) {
		// Handle custom error
		res.status(err.httpStatusCode).json({ error: err.message });
	} else {
		// Handle generic error
		console.error(err.stack);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});
```

- Install in backend: npm install @sentry/node

- In your backend/server.js file, initialize Sentry and add Sentry's error handling middleware:

```
const Sentry = require('@sentry/node');

Sentry.init({ dsn: 'YOUR_SENTRY_DSN' });

app.use(Sentry.Handlers.errorHandler());
```

```
Create an account or log in to Sentry at https://sentry.io/welcome/.
Once logged in, create a new project.
Choose the platform (in your case, it's likely to be JavaScript or Node.js).
After the project is created, you'll be taken to a page with your DSN, which is a string that looks something like this: https://<public_key>:<secret_key>@sentry.io/<project_id>.
Copy this DSN and replace YOUR_SENTRY_DSN in your code with it.
```

- This will automatically log all errors that occur in your application to Sentry. You can view these errors in the Sentry dashboard.

- Replace 'YOUR_SENTRY_DSN' with your actual Sentry DSN. If you don't have a Sentry account, you can create one for free on the Sentry website.

# Old app.js files

```
// import React, { useState } from "react";
// import Header from "./components/header";
// import TeamOperations from "./components/teamMembers";
// import DatabaseOperations from "./components/databaseOps";
// import WeeklySales from "./components/weeklySales";
// import DailyTotals from "./components/dailyTotals";
// import ErrorComponent from "./components/errorComponent";
// import { TeamContext } from "./components/teamContext";
// import { ErrorProvider, ErrorContext } from "./components/ErrorContext";

// function App() {
//     const [team, setTeam] = useState([]);
//     const [name, setName] = useState("");
//     const [position, setPosition] = useState("bartender");
//     const [error, setError] = useState(null);
//     const [refresh, setRefresh] = useState(false);

//     return (
//         <div className="App">
//             <TeamContext.Provider value={{ team, setTeam }}>
//                 <Header />

//                 <DatabaseOperations setRefresh={setRefresh} />

//                 <TeamOperations
//                     team={team}
//                     setTeam={setTeam}
//                     name={name}
//                     setName={setName}
//                     position={position}
//                     setPosition={setPosition}
//                     refresh={refresh}
//                     setRefresh={setRefresh}
//                     // addTeamMember={addTeamMember}
//                     // displayTeam={displayTeam}
//                     // fetchTeamMembers={fetchTeamMembers}
//                     // deleteTeamMember={deleteTeamMember}
//                 />

//                 <DailyTotals
//                     team={team}
//                     setTeam={setTeam}
//                     setError={setError}
//                     refresh={refresh}
//                     setRefresh={setRefresh}
//                 />

//                 <WeeklySales refresh={refresh} setRefresh={setRefresh} />

//                 <ErrorComponent error={error} />
//             </TeamContext.Provider>
//         </div>
//     );
// }

// export default App;

// import React, { useState } from 'react';
// import Header from './components/header';
// import TeamOperations from './components/teamMembers';
// import DatabaseOperations from './components/databaseOps';
// import WeeklySales from './components/weeklySales';
// import DailyTotals from './components/dailyTotals';
// import ErrorComponent from './components/errorComponent';
// import { TeamProvider } from './components/TeamContext';
// import { ErrorProvider, ErrorContext } from './components/ErrorContext';
// import { RefreshProvider } from './components/RefreshContext';


// function App() {
// 	const [team, setTeam] = useState([]);
// 	const [name, setName] = useState('');
// 	const [position, setPosition] = useState('bartender');
// 	const [error, setError] = useState(null);
// 	const [refresh, setRefresh] = useState(false);

// 	const updateTeam = (newTeam) => {
// 		setTeam(newTeam);
// 	};

// 	const updateName = (newName) => {
// 		setName(newName);
// 	};

// 	const updatePosition = (newPosition) => {
// 		setPosition(newPosition);
// 	};

// 	const updateRefresh = (newRefresh) => {
// 		setRefresh(newRefresh);
// 	};

// 	return (
// 		<RefreshProvider value={{ refresh, setRefresh }}>
// 			<ErrorProvider>
// 				<div className="App">
// 					<TeamProvider value={{ team, setTeam }}>
// 						<Header />

// 						<DatabaseOperations updateRefresh={updateRefresh} />

// 						<TeamOperations
// 							updateTeam={updateTeam}
// 							updateName={updateName}
// 							updatePosition={updatePosition}
// 							updateRefresh={updateRefresh}
// 						/>

// 						<DailyTotals
// 							updateTeam={updateTeam}
// 							setError={setError}
// 							refresh={refresh}
// 							setRefresh={updateRefresh}
// 						/>

// 						<WeeklySales
// 							refresh={refresh}
// 							setRefresh={updateRefresh}
// 						/>

// 						<ErrorComponent error={error} />
// 					</TeamProvider>
// 				</div>
// 			</ErrorProvider>
// 		</RefreshProvider>
// 	);
// }

// export default App;
```
### app.js 1

  - Code:
```
import React, { useReducer } from 'react';
import Header from './components/header';
import TeamOperations from './components/teamMembers';
import DatabaseOperations from './components/databaseOps';
import WeeklySales from './components/weeklySales';
import DailyTotals from './components/dailyTotals';
import ErrorComponent from './components/errorComponent';
import { TeamProvider } from './components/TeamContext';
import { ErrorProvider } from './components/ErrorContext';
import { RefreshProvider } from './components/RefreshContext';

const initialState = {
    team: [],
    error: null,
    refresh: false,
};

function reducer(state, action) {
    switch (action.type) {
        case 'updateTeam':
            return { ...state, team: action.payload };
        case 'updateError':
            return { ...state, error: action.payload };
        case 'updateRefresh':
            return { ...state, refresh: action.payload };
        default:
            throw new Error();
    }
}

function App() {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <RefreshProvider value={{ refresh: state.refresh, setRefresh: (value) => dispatch({ type: 'updateRefresh', payload: value }) }}>
            <ErrorProvider>
                <div className="App">
                    <TeamProvider value={{ team: state.team, setTeam: (value) => dispatch({ type: 'updateTeam', payload: value }) }}>
                        <Header />

                        <DatabaseOperations updateRefresh={(value) => dispatch({ type: 'updateRefresh', payload: value })} />

                        <TeamOperations
                            updateTeam={(value) => dispatch({ type: 'updateTeam', payload: value })}
                            updateRefresh={(value) => dispatch({ type: 'updateRefresh', payload: value })}
                        />

                        <DailyTotals
                            updateTeam={(value) => dispatch({ type: 'updateTeam', payload: value })}
                            setError={(value) => dispatch({ type: 'updateError', payload: value })}
                            refresh={state.refresh}
                            setRefresh={(value) => dispatch({ type: 'updateRefresh', payload: value })}
                        />

                        <WeeklySales
                            refresh={state.refresh}
                            setRefresh={(value) => dispatch({ type: 'updateRefresh', payload: value })}
                        />

                        <ErrorComponent error={state.error} />
                    </TeamProvider>
                </div>
            </ErrorProvider>
        </RefreshProvider>
    );
}

export default App;
```

### app.js 2

  - Code:
```
import React, { useReducer } from 'react';
import Header from './components/header';
import TeamOperations from './components/teamMembers';
import DatabaseOperations from './components/databaseOps';
import WeeklySales from './components/weeklySales';
import DailyTotals from './components/dailyTotals';
import ErrorComponent from './components/errorComponent';
import { TeamProvider } from './components/TeamContext';
import { ErrorProvider } from './components/ErrorContext';
import { RefreshProvider } from './components/RefreshContext';

const initialState = {
    team: [],
    error: null,
    refresh: false,
};

function reducer(state, action) {
    switch (action.type) {
        case 'updateTeam':
            return { ...state, team: action.payload };
        case 'updateError':
            return { ...state, error: action.payload };
        case 'updateRefresh':
            return { ...state, refresh: action.payload };
        default:
            throw new Error();
    }
}

// Action creators
function updateTeam(value) {
    return { type: 'updateTeam', payload: value };
}

function updateError(value) {
    return { type: 'updateError', payload: value };
}

function updateRefresh(value) {
    return { type: 'updateRefresh', payload: value };
}

function App() {
    const [state, dispatch] = useReducer(reducer, initialState);

    // Memoized context values
    const refreshContextValue = useMemo(() => ({
        refresh: state.refresh,
        setRefresh: (value) => dispatch(updateRefresh(value)),
    }), [state.refresh]);

    const teamContextValue = useMemo(() => ({
        team: state.team,
        setTeam: (value) => dispatch(updateTeam(value)),
    }), [state.team]);
    
    return (
        <RefreshProvider value={refreshContextValue}>
            <ErrorProvider>
                <div className="App">
                    <TeamProvider value={teamContextValue}>
                        <Header />

                        <DatabaseOperations updateRefresh={(value) => dispatch({ type: 'updateRefresh', payload: value })} />

                        <TeamOperations
                            updateTeam={(value) => dispatch({ type: 'updateTeam', payload: value })}
                            updateRefresh={(value) => dispatch({ type: 'updateRefresh', payload: value })}
                        />

                        <DailyTotals
                            updateTeam={(value) => dispatch({ type: 'updateTeam', payload: value })}
                            setError={(value) => dispatch({ type: 'updateError', payload: value })}
                            refresh={state.refresh}
                            setRefresh={(value) => dispatch({ type: 'updateRefresh', payload: value })}
                        />

                        <WeeklySales
                            refresh={state.refresh}
                            setRefresh={(value) => dispatch({ type: 'updateRefresh', payload: value })}
                        />

                        <ErrorComponent error={state.error} />
                    </TeamProvider>
                </div>
            </ErrorProvider>
        </RefreshProvider>
    );
}

export default App;
```

### app.js TypeScript

Adding [TypeScript](https://create-react-app.dev/docs/adding-typescript/)

  - Code:
```
import React, { useMemo } from 'react';
import { createSlice, configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import Header from './components/header';
import TeamOperations from './components/teamMembers';
import DatabaseOperations from './components/databaseOps';
import WeeklySales from './components/weeklySales';
import DailyTotals from './components/dailyTotals';
import ErrorComponent from './components/errorComponent';
import { TeamProvider } from './components/TeamContext';
import { ErrorProvider } from './components/ErrorContext';
import { RefreshProvider } from './components/RefreshContext';

interface State {
    team: any[];
    error: Error | null;
    refresh: boolean;
}

const initialState: State = {
    team: [],
    error: null,
    refresh: false,
};

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        updateTeam(state, action) {
            state.team = action.payload;
        },
        updateError(state, action) {
            state.error = action.payload;
        },
        updateRefresh(state, action) {
            state.refresh = action.payload;
        },
    },
});

const store = configureStore({
    reducer: appSlice.reducer,
});

function App() {
    const { updateTeam, updateError, updateRefresh } = appSlice.actions;

    // Memoized context values
    const refreshContextValue = useMemo(() => ({
        refresh: state.refresh,
        setRefresh: (value) => dispatch(updateRefresh(value)),
    }), [state.refresh]);

    const teamContextValue = useMemo(() => ({
        team: state.team,
        setTeam: (value) => dispatch(updateTeam(value)),
    }), [state.team]);

    return (
        <Provider store={store}>
            <RefreshProvider value={refreshContextValue}>
                <ErrorProvider>
                    <div className="App">
                        <TeamProvider value={teamContextValue}>
                            <Header />

                            <DatabaseOperations updateRefresh={updateRefresh} />

                            <TeamOperations
                                updateTeam={updateTeam}
                                updateRefresh={updateRefresh}
                            />

                            <DailyTotals
                                updateTeam={updateTeam}
                                setError={updateError}
                                refresh={state.refresh}
                                setRefresh={updateRefresh}
                            />

                            <WeeklySales
                                refresh={state.refresh}
                                setRefresh={updateRefresh}
                            />

                            <ErrorComponent error={state.error} />
                        </TeamProvider>
                    </div>
                </ErrorProvider>
            </RefreshProvider>
        </Provider>
    );
}

export default App;
```

### dailyTotals.js
    - Code:
```
// 	return (
// 		<div>
// 			<DailyTotalsForm
// 				dailyTotals={dailyTotals}
// 				setDailyTotals={setDailyTotals}
// 				submitDailyTotals={submitDailyTotals}
// 				team={team}
// 				setTeam={setTeam}
// 				refresh={refresh}
// 			/>

// 			{/* Change to TABLE

// <h2>Daily Totals</h2>
// <table className="sales-table">
//     <thead>
//         <tr className="header-row">
//             <th><div className="date-column">Date</div></th>
//             <th><div className="foodSales-column">Food Sales</div></th>
//             <th><div className="barSales-column">Bar Sales</div></th>
//             <th><div className="nonCashTips-column">Non-Cash Tips</div></th>
//             <th><div className="cashTips-column">Cash Tips</div></th>
//             <th><div className="barTipOuts-column">Bar Tip Outs</div></th>
//             <th><div className="runnerTipOuts-column">Runner Tip Outs</div></th>
//             <th><div className="hostTipOuts-column">Host Tip Outs</div></th>
//             <th><div className="totalTipOuts-column">Total Tip Outs</div></th>
//             <th><div className="tipsReceived-column">Tips Received</div></th>
//             <th><div className="totalPayrollTips-column">Total Payroll Tips</div></th>
//             <th><div className="action-column">Action</div></th>
//         </tr>
//     </thead>
// </table>
// */}
// 			<h2>Daily Totals</h2>
// 			<div className="sales-table">
// 				<div className="header-row">
// 					<div className="date-column">Date</div>
// 					<div className="foodSales-column">Food Sales</div>
// 					<div className="barSales-column">Bar Sales</div>
// 					<div className="nonCashTips-column">Non-Cash Tips</div>
// 					<div className="cashTips-column">Cash Tips</div>
// 					<div className="barTipOuts-column">Bar Tip Outs</div>
// 					<div className="runnerTipOuts-column">Runner Tip Outs</div>
// 					<div className="hostTipOuts-column">Host Tip Outs</div>
// 					<div className="totalTipOuts-column">Total Tip Outs</div>
// 					<div className="tipsReceived-column">Tips Received</div>
// 					<div className="totalPayrollTips-column">
// 						Total Payroll Tips
// 					</div>
// 					<div className="action-column">Action</div>
// 				</div>

// 				{dailyTotalsAll
// 					.sort((a, b) => {
// 						const correspondingTeamMemberA = team.find(
// 							(member) => member.name === a.teamMember
// 						);
// 						const correspondingTeamMemberB = team.find(
// 							(member) => member.name === b.teamMember
// 						);

// 						if (
// 							!correspondingTeamMemberA ||
// 							!correspondingTeamMemberB
// 						) {
// 							return 0;
// 						}

// 						const nameComparison =
// 							correspondingTeamMemberA.name.localeCompare(
// 								correspondingTeamMemberB.name
// 							);
// 						if (nameComparison !== 0) {
// 							return nameComparison;
// 						}

// 						return correspondingTeamMemberA.position.localeCompare(
// 							correspondingTeamMemberB.position
// 						);
// 					})

// 					.map((dailyTotal, index, array) => {
// 						const correspondingTeamMember = team.find(
// 							(member) => member.name === dailyTotal.teamMember
// 						);

// 						const deleteDailyTotal = async () => {
// 							const formattedDate = FormattedDate(
// 								dailyTotal.date
// 							);
// 							const confirmation = window.confirm(
// 								`ARE YOU SURE YOU WANT TO DELETE THE DAILY TOTAL FOR:\n\n${dailyTotal.teamMember.toUpperCase()}		ON:		${formattedDate.toUpperCase()}?`
// 							);
// 							if (!confirmation) {
// 								return;
// 							}
// 							try {
// 								if (!correspondingTeamMember) {
// 									console.error(
// 										'Corresponding team member not found'
// 									);
// 									alert('Failed to delete daily total');
// 									return;
// 								}
// 								if (!dailyTotal || !dailyTotal._id) {
// 									console.error(
// 										`dailyTotal._id is undefined: , ${dailyTotal}, ${dailyTotal}`
// 									);
// 									return;
// 								}
// 								const response = await axios.delete(
// 									`${process.env.REACT_APP_SERVER_URL}/api/teamMembers/${correspondingTeamMember._id}/dailyTotals/${dailyTotal._id}`
// 								);

// 								// fetchDailyTotalsAll();
// 								console.log(
// 									`deleteDailyTotal: ${response.data}`
// 								);
// 							} catch (error) {
// 								setError(
// 									`Error deleting daily total: ${error.message}`
// 								);
// 								alert(
// 									`Failed to delete daily totals: ${error.message}`
// 								);
// 							}
// 						};

// 						const isFirstItem =
// 							index === 0 ||
// 							array[index - 1].teamMember !==
// 								dailyTotal.teamMember;

// 						const CurrencyColumn = ({ className, value }) => (
// 							<div className={className}>
// 								{value
// 									? Number(value).toLocaleString('en-US', {
// 											style: 'currency',
// 											currency: 'USD',
// 									  })
// 									: 'N/A'}
// 							</div>
// 						);

// 						return (
// 							<React.Fragment key={dailyTotal._id}>
// 								{isFirstItem && (
// 									<div className="teamMember-separator">
// 										<hr />
// 										<p>{`${dailyTotal.teamMember} - ${
// 											correspondingTeamMember
// 												? correspondingTeamMember.position ||
// 												  'No Position'
// 												: 'Unknown Team Member'
// 										}`}</p>
// 										<hr />
// 									</div>
// 								)}

// 								<div className="flex-table-row">
// 									<div className="date-column">
// 										{dailyTotal.date
// 											? FormattedDate(dailyTotal.date)
// 											: 'Invalid Date'}
// 									</div>

// 									<CurrencyColumn
// 										className="foodSales-column"
// 										value={dailyTotal.foodSales}
// 									/>
// 									<CurrencyColumn
// 										className="barSales-column"
// 										value={dailyTotal.barSales}
// 									/>
// 									<CurrencyColumn
// 										className="nonCashTips-column"
// 										value={dailyTotal.nonCashTips}
// 									/>
// 									<CurrencyColumn
// 										className="cashTips-column"
// 										value={dailyTotal.cashTips}
// 									/>
// 									<CurrencyColumn
// 										className="barTipOuts-column"
// 										value={dailyTotal.barTipOuts}
// 									/>
// 									<CurrencyColumn
// 										className="runnerTipOuts-column"
// 										value={dailyTotal.runnerTipOuts}
// 									/>
// 									<CurrencyColumn
// 										className="hostTipOuts-column"
// 										value={dailyTotal.hostTipOuts}
// 									/>
// 									<CurrencyColumn
// 										className="totalTipOuts-column"
// 										value={dailyTotal.totalTipOuts}
// 									/>
// 									<CurrencyColumn
// 										className="tipsReceived-column"
// 										value={dailyTotal.tipsReceived}
// 									/>
// 									<CurrencyColumn
// 										className="totalPayrollTips-column"
// 										value={dailyTotal.totalPayrollTips}
// 									/>

// 									<div className="delete-button-column">
// 										<button onClick={deleteDailyTotal}>
// 											Delete
// 										</button>
// 									</div>
// 								</div>
// 							</React.Fragment>
// 						);
// 					})}
// 			</div>
// 		</div>
// 	);
```

### dailyTotals.js

```
	// const fetchDailyTotalsAll = useCallback(async () => {
	//     try {
	//         const response = await axios.get(
	//             `${process.env.REACT_APP_SERVER_URL}/api/dailyTotals/all`
	//         );
	//         const updatedData = response.data.map((dailyTotal) => ({
	//             ...dailyTotal,
	//             teamMember: dailyTotal.teamMember,
	//             position: dailyTotal.position,
	//         }));
	//         console.log("RESPONSE:", response.data);
	//         console.log("UPDATED:", updatedData);
	//         setDailyTotalsAll(updatedData);
	//     } catch (error) {
	//         setError(`Error fetching daily totals: ${error.message}`);
	//         alert(`Error fetching daily totals: ${error.message}`);
	//     }
	// }, [setDailyTotalsAll, setError]);

	// function DailyTotals({ setError, refresh, setRefresh }) {
	//     // ... (existing code)

	//     const calculateAllDailyTotals = () => {
	//         // Map and sort dailyTotals for all team members
	//         const allDailyTotals = dailyTotalsAll
	//             .sort((a, b) => {
	//                 const correspondingTeamMemberA = team.find(
	//                     (member) => member.name === a.teamMember
	//                 );
	//                 const correspondingTeamMemberB = team.find(
	//                     (member) => member.name === b.teamMember
	//                 );

	//                 if (
	//                     !correspondingTeamMemberA ||
	//                     !correspondingTeamMemberB
	//                 ) {
	//                     return 0;
	//                 }

	//                 const nameComparison =
	//                     correspondingTeamMemberA.name.localeCompare(
	//                         correspondingTeamMemberB.name
	//                     );
	//                 if (nameComparison !== 0) {
	//                     return nameComparison;
	//                 }

	//                 return correspondingTeamMemberA.position.localeCompare(
	//                     correspondingTeamMemberB.position
	//                 );
	//             })
	//             .map((dailyTotal, index, array) => {
	//                 // ... (existing code for rendering each daily total)
	//             });

	//         return allDailyTotals;
	//     };

	//     return (
	//         <div>
	//             {/* ... (existing code) */}

	//             <h2>Daily Totals</h2>
	//             <div className="sales-table">
	//                 <div className="header-row">
	//                     {/* ... (existing header row) */}
	//                 </div>

	//                 {/* Call the calculateAllDailyTotals function */}
	//                 {calculateAllDailyTotals()}
	//             </div>
	//         </div>
	//     );
	// }

	// useEffect(() => {
	//     fetchDailyTotalsAll();
	// }, [fetchDailyTotalsAll, refresh]);
```

### teamMembers.js

```
import React, { useState, useEffect, useContext } from 'react';
import TeamMemberForm from './teamMemberForm';
import { TeamContext } from './contexts/TeamContext';
import { useRefresh } from './contexts/RefreshContext';
import { getTeamMembers, addTeamMember, deleteTeamMember } from './api';

const POSITIONS = ['bartender', 'host', 'server', 'runner'];

function TeamOperations({ refresh, setRefresh }) {
	const { team, setTeam } = useContext(TeamContext);
	const [teamMemberName, setTeamMemberName] = useState('');
	const { refreshTeamMembers } = useRefresh();
	const [position, setPosition] = useState('bartender');
	const clearInputs = () => {
		setTeamMemberName('');
		setPosition('server');
	};

	useEffect(() => {
		getTeamMembers(setTeam);
	}, [refresh, refreshTeamMembers, setTeam]);

	const addTeamMemberToTeam = async () => {
		if (teamMemberName && position) {
			try {
				const newMember = await addTeamMember(teamMemberName, position);
				setTeam([...team, newMember]);
				clearInputs();
				await getTeamMembers(setTeam);
			} catch (error) {
				console.error('Error adding team member:', error);
				alert('Failed to add team member');
			}
		} else {
			alert('Please enter both name and position');
		}
	};
	
	const deleteTeamMemberFromTeam = async (id, teamMemberName, position) => {
		const confirmation = window.confirm(
			`ARE YOU SURE YOU WANT TO DELETE:\n\n${teamMemberName.toUpperCase()}	-	${position}?`
		);
		if (!confirmation) {
			return;
		}
	
		try {
			await deleteTeamMember(id);
			setTeam((prevTeam) =>
				prevTeam.filter((member) => member._id !== id)
			);
		} catch (error) {
			console.error('Error deleting team member:', error);
			alert('Failed to delete team member');
		}
	};

	return (
		<div className="team-card">
			<TeamMemberForm
				teamMemberName={teamMemberName}
				setTeamMemberName={setTeamMemberName}
				position={position}
				setPosition={setPosition}
				addTeamMember={addTeamMemberToTeam}
			/>
			{POSITIONS.map((position) => (
				<div key={position}>
					<h2>{position.charAt(0).toUpperCase() + position.slice(1)}s</h2>
					{[...team]
						.filter((member) => member.position === position)
						.sort((a, b) => a.teamMemberName.localeCompare(b.teamMemberName))
						.map((member) => (
							<div key={member._id} className="member-card">
								<strong>
									{member.teamMemberName.charAt(0).toUpperCase() +
										member.teamMemberName.slice(1)}
								</strong>{' '}
								- {member.position}
								<button
									onClick={() =>
										deleteTeamMemberFromTeam(
											member._id,
											member.teamMemberName,
											member.position
										)
									}
								>
									Delete
								</button>
							</div>
						))}
				</div>
			))}
		</div>
	);
};

export default TeamOperations;
```