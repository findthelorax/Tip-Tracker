import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { formatDateWithTimeZone, formatDate } from './dateUtils';
import Header from './header';
import TeamOperations from './teamMembers';
import DatabaseOperations from './databaseOps';
import WeeklySales from './weeklySales';
import DailyTotalsForm from './dailyTotalsForm';
import DailyTotals from './dailyTotals';

function App() {
	const [team, setTeam] = useState([]);
	const [name, setName] = useState('');
	const [position, setPosition] = useState('bartender');
	// const [dailyTotalsAll, setDailyTotalsAll] = useState([]);

	// useEffect(() => {
	// 	fetchDailyTotalsAll();
	// }, []);

	// const fetchDailyTotalsAll = async () => {
	// 	try {
	// 		const response = await axios.get(
	// 			`${process.env.REACT_APP_SERVER_URL}/api/dailyTotals/all`
	// 		);
	// 		console.log(
	// 			`fetchDailyTotalsAll: ${JSON.stringify(response.data, null, 2)}`
	// 		); // This will log the response data to the console in a readable format
	// 		const updatedData = response.data.map((dailyTotal) => ({
	// 			...dailyTotal,
	// 			teamMember: dailyTotal.teamMember,
	// 			position: dailyTotal.position,
	// 		}));
	// 		setDailyTotalsAll(updatedData);
	// 	} catch (error) {
	// 		console.error('Error fetching daily totals:', error);
	// 		alert('Failed to fetch daily totals');
	// 	}
	// };

	// const submitDailyTotals = async () => {
	// 	try {
	// 		// Validate if teamMember is selected
	// 		if (!dailyTotals.teamMember) {
	// 			alert('Please select a team member');
	// 			return;
	// 		}

	// 		const isDuplicateDailyTotal = dailyTotalsAll.find(
	// 			(total) =>
	// 				total.teamMember === dailyTotals.teamMember &&
	// 				total.position === dailyTotals.position &&
	// 				total.date === dailyTotals.date
	// 		);

	// 		if (isDuplicateDailyTotal) {
	// 			alert(
	// 				`${isDuplicateDailyTotal.date} totals for ${isDuplicateDailyTotal.teamMember} - ${isDuplicateDailyTotal.position} already exist.`
	// 			);
	// 			return;
	// 		}

	// 		// Find the selected team member by name and position to get their ID
	// 		const selectedTeamMember = team.find(
	// 			(member) => member.name === dailyTotals.teamMember
	// 		);

	// 		console.log(
	// 			`SELECTED TEAM MEMBER: ${selectedTeamMember.name} - ${selectedTeamMember.position}`
	// 		);

	// 		// Prepare dailyTotals data with teamMember field
	// 		const dailyTotalsData = {
	// 			teamMember: selectedTeamMember.name,
	// 			position: selectedTeamMember.position,
	// 			date: dailyTotals.date,
	// 			foodSales: dailyTotals.foodSales,
	// 			barSales: dailyTotals.barSales,
	// 			nonCashTips: dailyTotals.nonCashTips,
	// 			cashTips: dailyTotals.cashTips,
	// 		};

	// 		console.log(
	// 			`dailyTotalsData: ${dailyTotalsData}, dailyTotals: ${dailyTotals}`
	// 		);
	// 		// Send the data to the server
	// 		await axios.post(
	// 			`${process.env.REACT_APP_SERVER_URL}/api/dailyTotals/${selectedTeamMember._id}`,
	// 			{
	// 				dailyTotals: dailyTotalsData, // Wrap in an array
	// 			}
	// 		);

	// 		// Clear the form fields
	// 		setDailyTotals({
	// 			teamMember: '',
	// 			date: formatDate(new Date()),
	// 			foodSales: '',
	// 			barSales: '',
	// 			nonCashTips: '',
	// 			cashTips: '',
	// 		});

	// 		// Refresh the daily totals list
	// 		fetchDailyTotalsAll();
	// 	} catch (error) {
	// 		if (error.response && error.response.status === 400) {
	// 			alert(
	// 				`Totals on ${dailyTotals.date} for ${dailyTotals.teamMember} - ${dailyTotals.position} already exists.`
	// 			);
	// 		} else {
	// 			alert('An error occurred while submitting daily totals.');
	// 		}
	// 		console.error(error);
	// 	}
	// };

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
			/>

			<DailyTotals/>

			<WeeklySales/>
			
		</div>
	);
}

export default App;