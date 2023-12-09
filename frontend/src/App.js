import React, { useState, useEffect } from 'react';
import Header from './components/header';
import TeamOperations from './components/teamMembers';
import DatabaseOperations from './components/databaseOps';
import WeeklySales from './components/weeklySales';
import DailyTotals from './components/dailyTotals';
import ErrorComponent from './components/errorComponent';
import _ from 'lodash';

function App() {
	const [team, setTeam] = useState([]);
	const [name, setName] = useState('');
	const [position, setPosition] = useState('bartender');
	const [error, setError] = useState(null);

	return (
		<div className="App">

			<Header/>

			<DatabaseOperations/>

			<TeamOperations
				team={team}
				setTeam={setTeam}
				name={name}
				setName={setName}
				position={position}
				setPosition={setPosition}
				// addTeamMember={addTeamMember}
				// displayTeam={displayTeam}
				// fetchTeamMembers={fetchTeamMembers}
				// deleteTeamMember={deleteTeamMember}
			/>

			<DailyTotals 
				team={team}
				setTeam={setTeam}
				setError={setError}
			/>

			<WeeklySales/>
			<ErrorComponent error={error}/>
		</div>
	);
}

export default App;