import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { formatDateWithTimeZone } from './dateUtils';
import { formatDate } from './dateUtils';

function App() {
	const [team, setTeam] = useState([]);
	const [name, setName] = useState('');
	const [position, setPosition] = useState('bartender');
	const [dailyTotals, setDailyTotals] = useState({
		teamMember: '',
		position: '',
		date: formatDate(new Date()),
		foodSales: '',
		barSales: '',
		nonCashTips: '',
		cashTips: '',
	});
	const [weeklyTotals, setWeeklyTotals] = useState([]);
	const [dailyTotalsAll, setDailyTotalsAll] = useState([]);
	const [databases, setDatabases] = useState([]);

	useEffect(() => {
		// Fetch team members and daily totals when the component mounts
		fetchTeam();
		fetchDatabases();
		fetchDailyTotalsAll();
		displayTeam();
	}, []);

	const fetchDatabases = async () => {
		try {
			const response = await axios.get(
				`${process.env.REACT_APP_SERVER_URL}/api/listDatabases`
			);
			setDatabases(response.data.databases);
		} catch (error) {
			console.error('Error fetching databases:', error);
			alert('Failed to fetch databases');
		}
	};

	const deleteDatabase = async (databaseName) => {
		const confirmation = window.confirm(
			`ARE YOU SURE YOU WANT TO DELETE:\n\n${databaseName.toUpperCase()}?`
		);
		if (!confirmation) {
			return;
		}

		try {
			// Send a DELETE request to the server to delete the database
			await axios.delete(
				`${process.env.REACT_APP_SERVER_URL}/api/deleteDatabase/${databaseName}`
			);
			// Remove the deleted database from the local state
			setDatabases((prevDatabases) =>
				prevDatabases.filter(
					(database) => database.name !== databaseName
				)
			);
		} catch (error) {
			console.error('Error deleting database:', error);
			alert('Failed to delete database');
		}
	};

	const addTeamMember = async () => {
		if (name && position) {
			try {
				const response = await axios.post(
					`${process.env.REACT_APP_SERVER_URL}/api/teamMembers`,
					{ name, position }
				);
				setTeam([...team, response.data]);
				clearInputs();
			} catch (error) {
				console.error('Error adding team member:', error);
				alert('Failed to add team member');
			}
		} else {
			alert('Please enter both name and position');
		}
	};

	const displayTeam = async () => {
		try {
			const response = await axios.get(
				`${process.env.REACT_APP_SERVER_URL}/api/teamMembers`
			);
			setTeam(response.data);
		} catch (error) {
			console.error('Error fetching team members:', error);
			alert(`Failed to fetch team members: ${error.message}`);
		}
	};

	const clearInputs = () => {
		setName('');
		setPosition('server');
	};

	const deleteTeamMember = async (id, name, position) => {
		const confirmation = window.confirm(
			`ARE YOU SURE YOU WANT TO DELETE:\n\n${name.toUpperCase()}	-	${position}?`
		);
		if (!confirmation) {
			return;
		}

		try {
			// Send a DELETE request to the server to delete the team member by ID
			await axios.delete(
				`${process.env.REACT_APP_SERVER_URL}/api/teamMembers/${id}`
			);
			// Remove the deleted team member from the local state
			setTeam((prevTeam) =>
				prevTeam.filter((member) => member._id !== id)
			);
		} catch (error) {
			console.error('Error deleting team member:', error);
			alert('Failed to delete team member');
		}
	};

	const fetchTeam = async () => {
		try {
			const response = await axios.get(
				`${process.env.REACT_APP_SERVER_URL}/api/teamMembers`
			);
			setTeam(response.data);
		} catch (error) {
			console.error('Error fetching team members:', error);
			alert('Failed to fetch team members');
		}
	};

	const fetchDailyTotalsAll = async () => {
		try {
			const response = await axios.get(
				`${process.env.REACT_APP_SERVER_URL}/api/dailyTotals/all`
			);
			console.log(`fetchDailyTotalsAll: ${response.data}`); // This will log the response data to the console
			const updatedData = response.data.map((dailyTotal) => ({
				...dailyTotal,
				teamMember: dailyTotal.teamMember,
				position: dailyTotal.position,
			}));
			setDailyTotalsAll(updatedData);
		} catch (error) {
			console.error('Error fetching daily totals:', error);
			alert('Failed to fetch daily totals');
		}
	};

	const handleDailyTotalsChange = (field, value) => {
		if (field === 'date') {
			// Format the date to match the server's format
			const formattedDate = new Date(value).toISOString().slice(0, 10);

			setDailyTotals((prevDailyTotals) => ({
				...prevDailyTotals,
				date: formattedDate,
			}));
		} else {
			setDailyTotals((prevDailyTotals) => ({
				...prevDailyTotals,
				[field]: value,
			}));
		}
	};

	// const handleWeeklySalesChange = (field, value) => {
	// 	setWeeklySales({
	// 		...weeklySales,
	// 		[field]: value,
	// 	});
	// };

	const submitDailyTotals = async () => {
		try {
			// Validate if teamMember is selected
			if (!dailyTotals.teamMember) {
				alert('Please select a team member');
				return;
			}

			const isDuplicateDailyTotal = dailyTotalsAll.find(
				(total) =>
					total.teamMember === dailyTotals.teamMember &&
					total.position === dailyTotals.position &&
					total.date === dailyTotals.date
			);

			if (isDuplicateDailyTotal) {
				alert(
					`${isDuplicateDailyTotal.date} totals for ${isDuplicateDailyTotal.teamMember} - ${isDuplicateDailyTotal.position} already exist.`
				);
				return;
			}

			// Find the selected team member by name and position to get their ID
			const selectedTeamMember = team.find(
				(member) =>
					member.name === dailyTotals.teamMember
			);

			console.log(`SELECTED TEAM MEMBER: ${selectedTeamMember.name} - ${selectedTeamMember.position}`);

			// Prepare dailyTotals data with teamMember field
			const dailyTotalsData = {
				teamMember: selectedTeamMember.name,
				position: selectedTeamMember.position,
				date: dailyTotals.date,
				foodSales: dailyTotals.foodSales,
				barSales: dailyTotals.barSales,
				nonCashTips: dailyTotals.nonCashTips,
				cashTips: dailyTotals.cashTips,
			};

			
			// Send the data to the server
			await axios.post(
				`${process.env.REACT_APP_SERVER_URL}/api/dailyTotals/${selectedTeamMember._id}`,
				{
					dailyTotals: dailyTotalsData, // Wrap in an array
				}
			);

			// Clear the form fields
			setDailyTotals({
				teamMember: '',
				date: formatDate(new Date()),
				foodSales: '',
				barSales: '',
				nonCashTips: '',
				cashTips: '',
			});

			// Refresh the daily totals list
			fetchDailyTotalsAll();
		} catch (error) {
			if (error.response && error.response.status === 400) {
				alert(
					`Totals on ${dailyTotals.date} for ${dailyTotals.teamMember} - ${dailyTotals.position} already exists.`
				);
			} else {
				alert('An error occurred while submitting daily totals.');
			}
			console.error(error);
		}
	};

	return (
		<div className="App">
			<h1>Restaurant Team Management</h1>

			<div className="input-card">
				<label htmlFor="name">Name:</label>
				<input
					type="text"
					id="name"
					placeholder="Enter name"
					value={name}
					onChange={(e) => setName(e.target.value)}
				/>

				<label htmlFor="position">Position:</label>
				<select
					id="position"
					value={position}
					onChange={(e) => setPosition(e.target.value)}
				>
					<option value="bartender">Bartender</option>
					<option value="runner">Runner</option>
					<option value="server">Server</option>
					<option value="host">Host</option>
				</select>

				<button onClick={addTeamMember}>Add to Team</button>
			</div>

			<div className="databases-card">
				<h2>Databases</h2>
				<button onClick={fetchDatabases}>List Databases</button>
				{databases.length > 0 && (
					<div className="databases-table">
						<div className="database-header">
							<div>Database Name</div>
							<div>Action</div>
						</div>
						{databases.map((database) => (
							<div key={database.name} className="database-row">
								<div>{database.name}</div>
								<div>
									<button
										onClick={() =>
											deleteDatabase(database.name)
										}
									>
										Delete
									</button>
								</div>
							</div>
						))}
					</div>
				)}
			</div>

			<div className="team-card">
				<h2>Team Members</h2>
				{team.map((member) => (
					<div key={member._id} className="member-card">
						<strong>
							{member.name.charAt(0).toUpperCase() +
								member.name.slice(1)}
						</strong>{' '}
						- {member.position}
						<button
							onClick={() =>
								deleteTeamMember(
									member._id,
									member.name,
									member.position
								)
							}
						>
							Delete
						</button>
					</div>
				))}
			</div>

			<div>
				<h2>Daily Totals</h2>
				<div>
					<label htmlFor="teamMember">Team Member:</label>
					<select
						id="teamMember"
						value={dailyTotals.teamMember}
						onChange={(e) =>
							handleDailyTotalsChange(
								'teamMember',
								e.target.value
							)
						}
					>
						<option value="">Select Team Member</option>
						{team.map((member) => (
							<option key={member._id} value={member.name}>
								{`${member.name} - ${member.position}`}
							</option>
						))}
					</select>
				</div>
				<div>
					<label htmlFor="date">Date:</label>
					<input
						type="date"
						id="date"
						value={new Date().toISOString().split('T')[0]}
						onChange={(e) =>
							handleDailyTotalsChange('date', e.target.value)
						}
					/>
				</div>

				<div>
					<label htmlFor="foodSales">Food Sales:</label>
					<input
						type="number"
						id="foodSales"
						value={dailyTotals.foodSales}
						onChange={(e) =>
							handleDailyTotalsChange(
								'foodSales',
								parseFloat(e.target.value)
							)
						}
					/>
				</div>
				<div>
					<label htmlFor="barSales">Bar Sales:</label>
					<input
						type="number"
						id="barSales"
						value={dailyTotals.barSales}
						onChange={(e) =>
							handleDailyTotalsChange(
								'barSales',
								parseFloat(e.target.value)
							)
						}
					/>
				</div>
				<div>
					<label htmlFor="nonCashTips">Non-Cash Tips:</label>
					<input
						type="number"
						id="nonCashTips"
						value={dailyTotals.nonCashTips}
						onChange={(e) =>
							handleDailyTotalsChange(
								'nonCashTips',
								parseFloat(e.target.value)
							)
						}
					/>
				</div>
				<div>
					<label htmlFor="cashTips">Cash Tips:</label>
					<input
						type="number"
						id="cashTips"
						value={dailyTotals.cashTips}
						onChange={(e) =>
							handleDailyTotalsChange(
								'cashTips',
								parseFloat(e.target.value)
							)
						}
					/>
				</div>
				<button onClick={submitDailyTotals}>Submit Daily Totals</button>
			</div>

			<div>
				<h2>Daily Totals</h2>
				<div className="sales-table">
					<div className="header-row">
						<div className="date-column">Date</div>
						<div className="foodSales-column">Food Sales</div>
						<div className="barSales-column">Bar Sales</div>
						<div className="nonCashTips-column">Non-Cash Tips</div>
						<div className="cashTips-column">Cash Tips</div>
						<div className="action-column">Action</div>
					</div>

					{dailyTotalsAll
						.sort(
							(a, b) =>
								a.teamMember.localeCompare(b.teamMember) ||
								new Date(a.date) - new Date(b.date)
						)
						.map((dailyTotal, index, array) => {
							const correspondingTeamMember = team.find(
								(member) =>
									member.name === dailyTotal.teamMember
							);

							const deleteDailyTotal = async () => {
								const formattedDate = formatDateWithTimeZone(
									new Date(dailyTotal.date)
								);
								const confirmation = window.confirm(
									`ARE YOU SURE YOU WANT TO DELETE THE DAILY TOTAL FOR:\n\n${dailyTotal.teamMember.toUpperCase()}		ON:		${formattedDate.toUpperCase()}?`
								);
								if (!confirmation) {
									return;
								}
								try {
									if (!correspondingTeamMember) {
										console.error(
											'Corresponding team member not found'
										);
										alert('Failed to delete daily total');
										return;
									}
									const response = await axios.delete(
										`${process.env.REACT_APP_SERVER_URL}/api/teamMembers/${correspondingTeamMember._id}/dailyTotals/${dailyTotal._id}`
									);

									fetchDailyTotalsAll();
									console.log(`deleteDailyTotal: ${response.data}`); 
								} catch (error) {
									console.error(
										'Error deleting daily total:',
										error
									);
									alert('Failed to delete daily total');
								}
							};

							const isFirstItem =
								index === 0 ||
								array[index - 1].teamMember !==
									dailyTotal.teamMember;

							return (
								<React.Fragment key={dailyTotal._id}>
									{isFirstItem && (
										<div className="teamMember-separator">
											<hr />
											<p>{`${dailyTotal.teamMember} - ${
												correspondingTeamMember
													? correspondingTeamMember.position ||
													  'No Position'
													: 'Unknown Team Member'
											}`}</p>
											<hr />
										</div>
									)}

									<div className="flex-table-row">
										<div className="date-column">
											{dailyTotal.date
												? formatDateWithTimeZone(
														dailyTotal.date
												  )
												: 'Invalid Date'}
										</div>

										<div className="foodSales-column">
											{dailyTotal.foodSales}
										</div>
										<div className="barSales-column">
											{dailyTotal.barSales}
										</div>
										<div className="nonCashTips-column">
											{dailyTotal.nonCashTips}
										</div>
										<div className="cashTips-column">
											{dailyTotal.cashTips}
										</div>
										<div className="delete-button-column">
											<button onClick={deleteDailyTotal}>
												Delete
											</button>
										</div>
									</div>
								</React.Fragment>
							);
						})}
				</div>
			</div>

			<div className="sales-card">
				<h2>Weekly Sales</h2>
				<div className="sales-table">
					<div className="header-row">
						<div className="teamMember-column">Team Member</div>
						<div className="position-column">Position</div>
						<div className="totals-column">Totals</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default App;
