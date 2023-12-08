import React, { useState, useEffect } from 'react';
import Header from './header';
import TeamOperations from './teamMembers';
import DatabaseOperations from './databaseOps';
import WeeklySales from './weeklySales';
import DailyTotals from './dailyTotals';

function App() {
	const [team, setTeam] = useState([]);
	const [name, setName] = useState('');
	const [position, setPosition] = useState('bartender');

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

			<DailyTotals/>

			<WeeklySales/>
			
		</div>
	);
}

export default App;