import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { formatDateWithTimeZone, formatDate } from './dateUtils';
import DailyTotalsForm from './dailyTotalsForm';

function DailyTotals() {
	const [dailyTotals, setDailyTotals] = useState({
		teamMember: '',
		position: '',
		date: formatDate(new Date()),
		foodSales: '',
		barSales: '',
		nonCashTips: '',
		cashTips: '',
	});
	const [dailyTotalsAll, setDailyTotalsAll] = useState([]);
	const [team, setTeam] = useState([]);

	useEffect(() => {
		fetchDailyTotalsAll();
		axios
			.get(`${process.env.REACT_APP_SERVER_URL}/api/teamMembers`)
			.then((response) => setTeam(response.data))
			.catch((error) => console.error('Error:', error));
	}, []);

	const fetchDailyTotalsAll = async () => {
		try {
			const response = await axios.get(
				`${process.env.REACT_APP_SERVER_URL}/api/dailyTotals/all`
			);
			console.log(
				`fetchDailyTotalsAll: ${JSON.stringify(response.data, null, 2)}`
			); // This will log the response data to the console in a readable format
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

	// const submitDailyTotals = () => {
	// 	setTeamMembers((prevTeamMembers) => {
	// 		const teamMemberIndex = prevTeamMembers.findIndex(
	// 			(member) => member.name === dailyTotals.teamMember
	// 		);
	// 		if (teamMemberIndex !== -1) {
	// 			const updatedTeamMembers = [...prevTeamMembers];
	// 			updatedTeamMembers[teamMemberIndex].dailyTotals.push(
	// 				dailyTotals
	// 			);
	// 			return updatedTeamMembers;
	// 		}
	// 		return prevTeamMembers;
	// 	});
	// };

	const submitDailyTotals = async (dailyTotal) => {
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
				(member) => member.name === dailyTotals.teamMember
			);

			console.log(
				`SELECTED TEAM MEMBER: ${selectedTeamMember.name} - ${selectedTeamMember.position}`
			);

        // Prepare daily total object
        const newDailyTotal = {
            date: dailyTotals.date,
            foodSales: dailyTotals.foodSales,
            barSales: dailyTotals.barSales,
            nonCashTips: dailyTotals.nonCashTips,
            cashTips: dailyTotals.cashTips,
        };

  // Update the team member's dailyTotals array
        selectedTeamMember.dailyTotals.push(newDailyTotal);

  // Update the team state with the modified team member
        setTeam((prevTeam) =>
            prevTeam.map((member) =>
                member.name === selectedTeamMember.name ? selectedTeamMember : member
            )
        );


			// Prepare dailyTotals data with teamMember field
			// const dailyTotalsData = {
			// 	teamMember: selectedTeamMember.name,
			//  position: selectedTeamMember.position,
			// 	date: dailyTotals.date,
			// 	foodSales: dailyTotals.foodSales,
			// 	barSales: dailyTotals.barSales,
			// 	nonCashTips: dailyTotals.nonCashTips,
			// 	cashTips: dailyTotals.cashTips,
			// };

			// console.log(
			// `dailyTotalsData: ${dailyTotalsData}, dailyTotals: ${dailyTotals}`
			// );
			// Send the data to the server
			await axios.post(
				`${process.env.REACT_APP_SERVER_URL}/api/dailyTotals/${selectedTeamMember._id}`,
				
					dailyTotals
				
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
		<div>
			{/* <DailyTotalsForm dailyTotals={dailyTotals} /> */}
			<DailyTotalsForm
				dailyTotals={dailyTotals}
				setDailyTotals={setDailyTotals}
				submitDailyTotals={submitDailyTotals}
			/>

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
							(member) => member.name === dailyTotal.teamMember
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
								console.log(
									`deleteDailyTotal: ${response.data}`
								);
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
	);
}

export default DailyTotals;
