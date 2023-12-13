/* import React, { useState, useEffect, useCallback, useContext } from 'react';
import axios from 'axios';
import { FormattedDate } from './dateUtils';
import DailyTotalsForm from './dailyTotalsForm';
// import submitDailyTotals from "./sumbitDailyTotals";
import { TeamContext } from './contexts/TeamContext';

const today = new Date();
const localDate = new Date(
	today.getFullYear(),
	today.getMonth(),
	today.getDate()
)
	.toISOString()
	.split('T')[0];
// const timeZone = "America/New_York";

function DailyTotals() {
    const [dailyTotals, setDailyTotals] = useState({
		teamMember: '',
		position: '',
		date: localDate,
		foodSales: '',
		barSales: '',
		nonCashTips: '',
		cashTips: '',
		barTipOuts: '',
		runnerTipOuts: '',
		hostTipOuts: '',
		totalTipOuts: '',
		tipsReceived: '',
		totalPayrollTips: '',
	});

	const sortedDailyTotals = [...dailyTotalsAll].sort((a, b) => {
		const correspondingTeamMemberA = team.find(
			(member) => member.name === a.teamMember
		);
		const correspondingTeamMemberB = team.find(
			(member) => member.name === b.teamMember
		);

		if (!correspondingTeamMemberA || !correspondingTeamMemberB) {
			return 0;
		}

		const nameComparison = correspondingTeamMemberA.name.localeCompare(
			correspondingTeamMemberB.name
		);
		if (nameComparison !== 0) {
			return nameComparison;
		}

		return correspondingTeamMemberA.position.localeCompare(
			correspondingTeamMemberB.position
		);
	});

	return (
		<div>
			<DailyTotalsForm
				dailyTotals={dailyTotals}
				setDailyTotals={setDailyTotals}
				submitDailyTotals={submitDailyTotals}
				team={team}
				setTeam={setTeam}
				refresh={refresh}
			/>

			<h2>Daily Totals</h2>
			<table className="sales-table">
				<thead>
					<tr className="header-row">
						<th>Date</th>
						<th>Food Sales</th>
						<th>Bar Sales</th>
						<th>Non-Cash Tips</th>
						<th>Cash Tips</th>
						<th>Bar Tip Outs</th>
						<th>Runner Tip Outs</th>
						<th>Host Tip Outs</th>
						<th>Total Tip Outs</th>
						<th>Tips Received</th>
						<th>Total Payroll Tips</th>
						<th>Action</th>
					</tr>
				</thead>
				<tbody>
					{sortedDailyTotals.map((dailyTotal, index, array) => {
						const correspondingTeamMember = team.find(
							(member) => member.name === dailyTotal.teamMember
						);

						const deleteDailyTotal = async () => {
							const formattedDate = FormattedDate(
								dailyTotal.date
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
								if (!dailyTotal || !dailyTotal._id) {
									console.error(
										`dailyTotal._id is undefined: , ${dailyTotal}, ${dailyTotal}`
									);
									return;
								}
								const response = await axios.delete(
									`${process.env.REACT_APP_SERVER_URL}/api/teamMembers/${correspondingTeamMember._id}/dailyTotals/${dailyTotal._id}`
								);

								// fetchDailyTotalsAll();
								console.log(
									`deleteDailyTotal: ${response.data}`
								);
							} catch (error) {
								setError(
									`Error deleting daily total: ${error.message}`
								);
								alert(
									`Failed to delete daily totals: ${error.message}`
								);
							}
						};

						const isFirstItem =
							index === 0 ||
							array[index - 1].teamMember !==
								dailyTotal.teamMember;

						const CurrencyColumn = ({ className, value }) => (
							<div className={className}>
								{value
									? Number(value).toLocaleString('en-US', {
											style: 'currency',
											currency: 'USD',
									  })
									: 'N/A'}
							</div>
						);

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
											? FormattedDate(dailyTotal.date)
											: 'Invalid Date'}
									</div>

									<CurrencyColumn
										className="foodSales-column"
										value={dailyTotal.foodSales}
									/>
									<CurrencyColumn
										className="barSales-column"
										value={dailyTotal.barSales}
									/>
									<CurrencyColumn
										className="nonCashTips-column"
										value={dailyTotal.nonCashTips}
									/>
									<CurrencyColumn
										className="cashTips-column"
										value={dailyTotal.cashTips}
									/>
									<CurrencyColumn
										className="barTipOuts-column"
										value={dailyTotal.barTipOuts}
									/>
									<CurrencyColumn
										className="runnerTipOuts-column"
										value={dailyTotal.runnerTipOuts}
									/>
									<CurrencyColumn
										className="hostTipOuts-column"
										value={dailyTotal.hostTipOuts}
									/>
									<CurrencyColumn
										className="totalTipOuts-column"
										value={dailyTotal.totalTipOuts}
									/>
									<CurrencyColumn
										className="tipsReceived-column"
										value={dailyTotal.tipsReceived}
									/>
									<CurrencyColumn
										className="totalPayrollTips-column"
										value={dailyTotal.totalPayrollTips}
									/>

									<div className="delete-button-column">
										<button onClick={deleteDailyTotal}>
											Delete
										</button>
									</div>
								</div>
							</React.Fragment>
						);
					})}
				</tbody>
			</table>
		</div>
	);
}

export default DailyTotals;


import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { FormattedDate } from './dateUtils';
import DailyTotalsForm from './dailyTotalsForm';
// import submitDailyTotals from "./sumbitDailyTotals";
import { useRefresh } from './contexts/RefreshContext';
import { ErrorContext } from './contexts/ErrorContext';
import { fetchDailyTotalsAll, deleteDailyTotal, submitDailyTotal } from './api';
import { TeamContext } from './contexts/TeamContext';

const today = new Date();
const localDate = new Date(
	today.getFullYear(),
	today.getMonth(),
	today.getDate()
)
	.toISOString()
	.split('T')[0];
// const timeZone = "America/New_York";

function DailyTotals() {
	const { team, setTeam } = useContext(TeamContext);
    const { setError } = useContext(ErrorContext);
    const { refresh, setRefresh, setRefreshTeamMembers } = useRefresh();
    const [dailyTotalsAll, setDailyTotalsAll] = useState([]);
	const [dailyTotals, setDailyTotals] = useState({
		teamMember: '',
		position: '',
		date: localDate,
		foodSales: '',
		barSales: '',
		nonCashTips: '',
		cashTips: '',
		barTipOuts: '',
		runnerTipOuts: '',
		hostTipOuts: '',
		totalTipOuts: '',
		tipsReceived: '',
		totalPayrollTips: '',
	});

    const fetchTotals = async () => {
        try {
            const totals = await fetchDailyTotalsAll();
            setDailyTotalsAll(totals);
        } catch (error) {
            console.error('Failed to fetch daily totals:', error);
        }
    };

	const submitDailyTotals = async () => {
		try {
			// Validate if teamMember is selected
			if (!dailyTotals.teamMemberName) {
				alert('Please select a team member');
				return;
			}

			const isDuplicateDailyTotal = dailyTotalsAll.find(
				(total) =>
					total.teamMemberName === dailyTotals.teamMemberName &&
					total.position === dailyTotals.position &&
					total.date === dailyTotals.date
			);

			if (isDuplicateDailyTotal) {
				alert(
					`${isDuplicateDailyTotal.date} totals for ${isDuplicateDailyTotal.teamMemberName} - ${isDuplicateDailyTotal.position} already exist.`
				);
				return;
			}

			// Find the selected team member by name and position to get their ID
			const selectedTeamMember = team.find(
				(member) => member.teamMemberName === dailyTotals.teamMemberName
			);

			if (!selectedTeamMember) {
				alert('Team member not found');
				return;
			}

			// Prepare daily total object
			const newDailyTotals = {
				teamMemberName: selectedTeamMember.teamMemberName,
				position: selectedTeamMember.position,
				date: dailyTotals.date,
				foodSales: dailyTotals.foodSales,
				barSales: dailyTotals.barSales,
				nonCashTips: dailyTotals.nonCashTips,
				cashTips: dailyTotals.cashTips,
				barTipOuts: dailyTotals.barTipOuts,
				runnerTipOuts: dailyTotals.runnerTipOuts,
				hostTipOuts: dailyTotals.hostTipOuts,
				totalTipOuts: dailyTotals.totalTipOuts,
				tipsReceived: dailyTotals.tipsReceived,
				totalPayrollTips: dailyTotals.totalPayrollTips,
			};


			await axios.post(
				`${process.env.REACT_APP_SERVER_URL}/api/teamMembers/${selectedTeamMember._id}/dailyTotals`,
				newDailyTotals
			);

			// Clear the form fields
			setDailyTotals({
				teamMember: '',
				date: new Date(),
				foodSales: '',
				barSales: '',
				nonCashTips: '',
				cashTips: '',
			});

			// Refresh the daily totals list
			fetchTotals();
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

	const sortedDailyTotals = [...dailyTotalsAll].sort((a, b) => {
		const correspondingTeamMemberA = team.find(
			(member) => member.teamMemberName === a.teamMember
		);
		const correspondingTeamMemberB = team.find(
			(member) => member.teamMemberName === b.teamMember
		);

		if (!correspondingTeamMemberA || !correspondingTeamMemberB) {
			return 0;
		}

		const nameComparison = correspondingTeamMemberA.teamMemberName.localeCompare(
			correspondingTeamMemberB.teamMemberName
		);
		if (nameComparison !== 0) {
			return nameComparison;
		}

		return correspondingTeamMemberA.position.localeCompare(
			correspondingTeamMemberB.position
		);
	});

	return (
		<div>
			<DailyTotalsForm
				dailyTotals={dailyTotals}
				setDailyTotals={setDailyTotals}
				submitDailyTotals={submitDailyTotals}
				team={team}
				setTeam={setTeam}
				refresh={refresh}
			/>

			<h2>Daily Totals</h2>
			<table className="sales-table">
				<thead>
					<tr className="header-row">
						<th>Date</th>
						<th>Food Sales</th>
						<th>Bar Sales</th>
						<th>Non-Cash Tips</th>
						<th>Cash Tips</th>
						<th>Bar Tip Outs</th>
						<th>Runner Tip Outs</th>
						<th>Host Tip Outs</th>
						<th>Total Tip Outs</th>
						<th>Tips Received</th>
						<th>Total Payroll Tips</th>
						<th>Action</th>
					</tr>
				</thead>
				<tbody>
					{sortedDailyTotals.map((dailyTotal, index, array) => {
						const correspondingTeamMember = team.find(
							(member) => member.teamMemberName === dailyTotal.teamMember
						);

						const deleteDailyTotal = async () => {
							const formattedDate = FormattedDate(
								dailyTotal.date
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
								if (!dailyTotal || !dailyTotal._id) {
									console.error(
										`dailyTotal._id is undefined: , ${dailyTotal}, ${dailyTotal}`
									);
									return;
								}
								const response = await axios.delete(
									`${process.env.REACT_APP_SERVER_URL}/api/teamMembers/${correspondingTeamMember._id}/dailyTotals/${dailyTotal._id}`
								);

								fetchTotals();
								console.log(
									`deleteDailyTotal: ${response.data}`
								);
							} catch (error) {
								setError(
									`Error deleting daily total: ${error.message}`
								);
								alert(
									`Failed to delete daily totals: ${error.message}`
								);
							}
						};

						const isFirstItem =
							index === 0 ||
							array[index - 1].teamMember !==
								dailyTotal.teamMember;

						const CurrencyColumn = ({ className, value }) => (
							<div className={className}>
								{value
									? Number(value).toLocaleString('en-US', {
											style: 'currency',
											currency: 'USD',
									  })
									: 'N/A'}
							</div>
						);

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
											? FormattedDate(dailyTotal.date)
											: 'Invalid Date'}
									</div>

									<CurrencyColumn
										className="foodSales-column"
										value={dailyTotal.foodSales}
									/>
									<CurrencyColumn
										className="barSales-column"
										value={dailyTotal.barSales}
									/>
									<CurrencyColumn
										className="nonCashTips-column"
										value={dailyTotal.nonCashTips}
									/>
									<CurrencyColumn
										className="cashTips-column"
										value={dailyTotal.cashTips}
									/>
									<CurrencyColumn
										className="barTipOuts-column"
										value={dailyTotal.barTipOuts}
									/>
									<CurrencyColumn
										className="runnerTipOuts-column"
										value={dailyTotal.runnerTipOuts}
									/>
									<CurrencyColumn
										className="hostTipOuts-column"
										value={dailyTotal.hostTipOuts}
									/>
									<CurrencyColumn
										className="totalTipOuts-column"
										value={dailyTotal.totalTipOuts}
									/>
									<CurrencyColumn
										className="tipsReceived-column"
										value={dailyTotal.tipsReceived}
									/>
									<CurrencyColumn
										className="totalPayrollTips-column"
										value={dailyTotal.totalPayrollTips}
									/>

									<div className="delete-button-column">
										<button onClick={deleteDailyTotal}>
											Delete
										</button>
									</div>
								</div>
							</React.Fragment>
						);
					})}
				</tbody>
			</table>
		</div>
	);
}

export default DailyTotals;






import React, { useState, useEffect, useContext, useMemo, useCallback, useReducer, memo } from 'react';
import axios from 'axios';
import { FormattedDate } from './dateUtils';
import DailyTotalsForm from './dailyTotalsForm';
// import submitDailyTotals from "./sumbitDailyTotals";
import { useRefresh } from './contexts/RefreshContext';
import { ErrorContext } from './contexts/ErrorContext';
import { fetchDailyTotalsAll, deleteDailyTotalFromServer, submitDailyTotalToServer } from './api';
import { TeamContext } from './contexts/TeamContext';

const today = new Date();
const localDate = new Date(
	today.getFullYear(),
	today.getMonth(),
	today.getDate()
)
	.toISOString()
	.split('T')[0];
// const timeZone = "America/New_York";

const CurrencyColumn = memo(({ className, value }) => (
    <div className={className}>
        {value
            ? Number(value).toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
              })
            : 'N/A'}
    </div>
));

const initialState = {
    teamMember: '',
    position: '',
    date: localDate,
    foodSales: '',
    barSales: '',
    nonCashTips: '',
    cashTips: '',
    barTipOuts: '',
    runnerTipOuts: '',
    hostTipOuts: '',
    totalTipOuts: '',
    tipsReceived: '',
    totalPayrollTips: '',
};

function reducer(state, action) {
    switch (action.type) {
        case 'set':
            return { ...state, [action.field]: action.value };
        case 'reset':
            return initialState;
        default:
            throw new Error();
    }
}

function DailyTotals() {
	const { team, setTeam } = useContext(TeamContext);
	const { setError } = useContext(ErrorContext);
	const { refresh, setRefresh, setRefreshTeamMembers } = useRefresh();
	const [dailyTotalsAll, setDailyTotalsAll] = useState([]);
    const [dailyTotals, dispatch] = useReducer(reducer, initialState);


	const fetchTotals = useCallback(async () => {
		try {
			const totals = await fetchDailyTotalsAll();
			setDailyTotalsAll(totals);
		} catch (error) {
			setError('Failed to fetch daily totals');
		}
	}, []);

	useEffect(() => {
		fetchTotals();
	}, [fetchTotals]);

    const submitDailyTotals = useCallback(async (dailyTotals) => {
		try {
			// Validate if teamMember is selected
			if (!dailyTotals.teamMemberName) {
				alert('Please select a team member');
				return;
			}

			const isDuplicateDailyTotal = dailyTotalsAll.find(
				(total) =>
					total.teamMemberName === dailyTotals.teamMemberName &&
					total.position === dailyTotals.position &&
					total.date === dailyTotals.date
			);

			if (isDuplicateDailyTotal) {
				alert(
					`${isDuplicateDailyTotal.date} totals for ${isDuplicateDailyTotal.teamMemberName} - ${isDuplicateDailyTotal.position} already exist.`
				);
				return;
			}

			// Find the selected team member by name and position to get their ID
			const selectedTeamMember = team.find(
				(member) => member.teamMemberName === dailyTotals.teamMemberName
			);

			if (!selectedTeamMember) {
				alert('Team member not found');
				return;
			}

			// Prepare daily total object
			const newDailyTotals = {
				teamMemberName: selectedTeamMember.teamMemberName,
				position: selectedTeamMember.position,
				date: dailyTotals.date,
				foodSales: dailyTotals.foodSales,
				barSales: dailyTotals.barSales,
				nonCashTips: dailyTotals.nonCashTips,
				cashTips: dailyTotals.cashTips,
				barTipOuts: dailyTotals.barTipOuts,
				runnerTipOuts: dailyTotals.runnerTipOuts,
				hostTipOuts: dailyTotals.hostTipOuts,
				totalTipOuts: dailyTotals.totalTipOuts,
				tipsReceived: dailyTotals.tipsReceived,
				totalPayrollTips: dailyTotals.totalPayrollTips,
			};

			await submitDailyTotalToServer(selectedTeamMember._id, newDailyTotals);

			// Clear the form fields
			dispatch({
				teamMember: '',
				date: new Date(),
				foodSales: '',
				barSales: '',
				nonCashTips: '',
				cashTips: '',
			});

			// Refresh the daily totals list
			fetchTotals();
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
    }, [team, setRefresh, setRefreshTeamMembers]);

	const sortedDailyTotals = useMemo(() => {
		return [...dailyTotalsAll].sort(
			(a, b) => {
				const correspondingTeamMemberA = team.find(
					(member) => member.teamMemberName === a.teamMember
				);
				const correspondingTeamMemberB = team.find(
					(member) => member.teamMemberName === b.teamMember
				);

				if (!correspondingTeamMemberA || !correspondingTeamMemberB) {
					return 0;
				}

				const nameComparison =
					correspondingTeamMemberA.teamMemberName.localeCompare(
						correspondingTeamMemberB.teamMemberName
					);
				if (nameComparison !== 0) {
					return nameComparison;
				}

				return correspondingTeamMemberA.position.localeCompare(
					correspondingTeamMemberB.position
				);
			},
		);
	}, [dailyTotalsAll, team]);

    const deleteDailyTotal = useCallback(async (dailyTotal, correspondingTeamMember) => {
		const formattedDate = FormattedDate(
			dailyTotal.date
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
			if (!dailyTotal || !dailyTotal._id) {
				console.error(
					`dailyTotal._id is undefined: , ${dailyTotal}, ${dailyTotal}`
				);
				return;
			}
			const response = await deleteDailyTotalFromServer(correspondingTeamMember._id, dailyTotal._id);

			fetchTotals();
			console.log(
				`deleteDailyTotal: ${response.data}`
			);
		} catch (error) {
			setError(
				`Error deleting daily total: ${error.message}`
			);
			alert(
				`Failed to delete daily totals: ${error.message}`
			);
		}
    }, [team, setRefresh, setRefreshTeamMembers]);

	return (
		<div>
			<DailyTotalsForm
				dailyTotals={dailyTotals}
				setDailyTotals={dispatch}
				submitDailyTotals={submitDailyTotals}
				team={team}
				setTeam={setTeam}
				refresh={refresh}
			/>

			<h2>Daily Totals</h2>
			<table className="sales-table">
				<thead>
					<tr className="header-row">
						<th>Date</th>
						<th>Food Sales</th>
						<th>Bar Sales</th>
						<th>Non-Cash Tips</th>
						<th>Cash Tips</th>
						<th>Bar Tip Outs</th>
						<th>Runner Tip Outs</th>
						<th>Host Tip Outs</th>
						<th>Total Tip Outs</th>
						<th>Tips Received</th>
						<th>Total Payroll Tips</th>
						<th>Action</th>
					</tr>
				</thead>
				<tbody>
					{sortedDailyTotals.map((dailyTotal, index, array) => {
						const correspondingTeamMember = team.find(
							(member) =>
								member.teamMemberName === dailyTotal.teamMember
						);

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
											? FormattedDate(dailyTotal.date)
											: 'Invalid Date'}
									</div>

									<CurrencyColumn
										className="foodSales-column"
										value={dailyTotal.foodSales}
									/>
									<CurrencyColumn
										className="barSales-column"
										value={dailyTotal.barSales}
									/>
									<CurrencyColumn
										className="nonCashTips-column"
										value={dailyTotal.nonCashTips}
									/>
									<CurrencyColumn
										className="cashTips-column"
										value={dailyTotal.cashTips}
									/>
									<CurrencyColumn
										className="barTipOuts-column"
										value={dailyTotal.barTipOuts}
									/>
									<CurrencyColumn
										className="runnerTipOuts-column"
										value={dailyTotal.runnerTipOuts}
									/>
									<CurrencyColumn
										className="hostTipOuts-column"
										value={dailyTotal.hostTipOuts}
									/>
									<CurrencyColumn
										className="totalTipOuts-column"
										value={dailyTotal.totalTipOuts}
									/>
									<CurrencyColumn
										className="tipsReceived-column"
										value={dailyTotal.tipsReceived}
									/>
									<CurrencyColumn
										className="totalPayrollTips-column"
										value={dailyTotal.totalPayrollTips}
									/>

									<div className="delete-button-column">
									<button onClick={() => deleteDailyTotal(dailyTotal, correspondingTeamMember)}>
											Delete
										</button>
									</div>
								</div>
							</React.Fragment>
						);
					})}
				</tbody>
			</table>
		</div>
	);
}

export default DailyTotals; */

import React, {
	useState,
	useEffect,
	useContext,
	useMemo,
	useCallback,
	memo,
} from 'react';
import { FormattedDate } from './dateUtils';
import DailyTotalsForm from './dailyTotalsForm';
import { ErrorContext } from './contexts/ErrorContext';
import {
	fetchDailyTotalsAll,
	deleteDailyTotalFromServer,
	submitDailyTotalToServer,
} from './api';
import { TeamContext } from './contexts/TeamContext';
import {
	Button,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Typography,
	Divider,
} from '@material-ui/core';

const today = new Date();
const localDate = new Date(
	today.getFullYear(),
	today.getMonth(),
	today.getDate()
)
	.toISOString()
	.split('T')[0];
// const timeZone = "America/New_York";

const CurrencyColumn = memo(({ className, value }) => (
	<TableRow className={className}>
		{value
			? Number(value).toLocaleString('en-US', {
					style: 'currency',
					currency: 'USD',
			  })
			: 'N/A'}
	</TableRow>
));

function DailyTotals() {
	const { team, setTeam } = useContext(TeamContext);
	const { setError } = useContext(ErrorContext);
	const [dailyTotalsAll, setDailyTotalsAll] = useState([]);
	const [dailyTotals, setDailyTotals] = useState({
		teamMemberName: '',
		position: '',
		date: localDate,
		foodSales: '',
		barSales: '',
		nonCashTips: '',
		cashTips: '',
		barTipOuts: '',
		runnerTipOuts: '',
		hostTipOuts: '',
		totalTipOuts: '',
		tipsReceived: '',
		totalPayrollTips: '',
	});

	const fetchDailyTotals = useCallback(async () => {
		try {
			const data = await fetchDailyTotalsAll();
			const updatedData = data.map((dailyTotal) => ({
				...dailyTotal,
				teamMemberName: dailyTotal.teamMemberName,
				position: dailyTotal.position,
			}));
			// console.log(`Fetched Totals:`, updatedData);
			setDailyTotalsAll(updatedData);
		} catch (error) {
			console.error(error);
			setError(error.message);
		}
	}, [setError]);

	useEffect(() => {
		fetchDailyTotals();
	}, [fetchDailyTotals]);

	// submitDailyTotals function breakdown
	const submitDailyTotals = useCallback(
		async (dailyTotals) => {
			if (!validateDailyTotals(dailyTotals, dailyTotalsAll)) {
				return;
			}

			const selectedTeamMember = findSelectedTeamMember(
				team,
				dailyTotals
			);

			console.log('team SUBMIT:', team);
			console.log('dailyTotals SUBMIT:', dailyTotals);
			console.log('selectedTeamMember SUBMIT:', selectedTeamMember);

			if (!selectedTeamMember) {
				alert('Selected team member not found in the team list.');
				return;
			}

			const newDailyTotals = prepareDailyTotals(
				selectedTeamMember,
				dailyTotals
			);

			try {
				await submitDailyTotalToServer(
					selectedTeamMember._id,
					newDailyTotals
				);
				clearFormFields(setDailyTotals);
				fetchDailyTotals();
			} catch (error) {
				handleSubmissionError(error, dailyTotals);
			}
		},
		[team, dailyTotalsAll, fetchDailyTotals]
	);

	const validateDailyTotals = (dailyTotals, dailyTotalsAll) => {
		if (
			!dailyTotals.teamMemberName &&
			!dailyTotals.position &&
			!dailyTotals.date
		) {
			alert('INVALID DATA!');
			console.log(dailyTotals);
			return false;
		}

		const isDuplicateDailyTotal = dailyTotalsAll.find(
			(total) =>
				total.teamMemberName === dailyTotals.teamMemberName &&
				total.position === dailyTotals.position &&
				total.date === dailyTotals.date
		);

		if (isDuplicateDailyTotal) {
			alert(
				`${isDuplicateDailyTotal.date} totals for ${isDuplicateDailyTotal.teamMemberName} - ${isDuplicateDailyTotal.position} already exist.`
			);
			return false;
		}
		return true;
	};

	const prepareDailyTotals = (selectedTeamMember, dailyTotals) => {
		return {
			teamMemberName: selectedTeamMember.teamMemberName,
			position: selectedTeamMember.position,
			date: dailyTotals.date,
			foodSales: dailyTotals.foodSales,
			barSales: dailyTotals.barSales,
			nonCashTips: dailyTotals.nonCashTips,
			cashTips: dailyTotals.cashTips,
			barTipOuts: dailyTotals.barTipOuts,
			runnerTipOuts: dailyTotals.runnerTipOuts,
			hostTipOuts: dailyTotals.hostTipOuts,
			totalTipOuts: dailyTotals.totalTipOuts,
			tipsReceived: dailyTotals.tipsReceived,
			totalPayrollTips: dailyTotals.totalPayrollTips,
		};
	};

	const clearFormFields = (setDailyTotals) => {
		setDailyTotals({
			teamMember: '',
			date: new Date(),
			foodSales: '',
			barSales: '',
			nonCashTips: '',
			cashTips: '',
		});
	};

	const handleSubmissionError = (error, dailyTotals) => {
		if (error.response && error.response.status === 400) {
			alert(
				`Totals on ${dailyTotals.date} for ${dailyTotals.teamMember} - ${dailyTotals.position} already exists.`
			);
		} else {
			alert('An error occurred while submitting daily totals.');
		}
		console.error(error);
	};

	const deleteDailyTotal = useCallback(
		async (dailyTotal, correspondingTeamMember) => {
			const formattedDate = FormattedDate(dailyTotal.date);
			const confirmation = window.confirm(
				`ARE YOU SURE YOU WANT TO DELETE THE DAILY TOTAL FOR:\n\n${dailyTotal.teamMemberName.toUpperCase()}		ON:		${formattedDate.toUpperCase()}?`
			);
			if (!confirmation) {
				return;
			}
			try {
				if (!correspondingTeamMember) {
					console.error('Corresponding team member not found');
					alert('Failed to delete daily total');
					return;
				}
				if (!dailyTotal || !dailyTotal._id) {
					console.error(
						`dailyTotal._id is undefined: , ${dailyTotal}, ID: ,  ${dailyTotal._id}`
					);
					return;
				}
				const response = await deleteDailyTotalFromServer(
					correspondingTeamMember._id,
					dailyTotal._id
				);

				fetchDailyTotals();
				console.log(`deleteDailyTotal: ${response.data}`);
			} catch (error) {
				setError(`Error deleting daily total: ${error.message}`);
				alert(`Failed to delete daily totals: ${error.message}`);
			}
		},
		[setError, fetchDailyTotals]
	);

	//TODO: FIX DAILY TOTALS SORTING
	// sortedDailyTotals.map callback breakdown
	// const findCorrespondingTeamMember = (team, dailyTotal) => {
	// 	return team.find((member) => member._id === dailyTotal._id);
	// };

	// const findSelectedTeamMember = (team, dailyTotals) => {
	// 	return team.find(
	// 		(member) => member._id === dailyTotals._id
	// 	);
	// };

	// const selectTeamMemberById = (id) => {
	//     const teamMember = team.find(member => member.id === id);
	//     setSelectedTeamMember(teamMember);
	// };

	// const getDailyTotalsByTeamMemberId = (id) => {
	//     const teamMember = team.find(member => member.id === id);
	//     if (teamMember) {
	//         setDailyTotals(teamMember.dailyTotals);
	//     }
	// };

	// Change this to id instead of name
	const checkIfFirstItem = (dailyTotal, index, array) => {
		return (
			index === 0 ||
			array[index - 1].teamMemberName !== dailyTotal.teamMemberName
		);
	};

	const findCorrespondingTeamMember = (team, dailyTotal) => {
		const result = team.find((member) => member._id === dailyTotal._id);
		console.log('findCorrespondingTeamMember:', result);
		return result;
	};

	const findSelectedTeamMember = (team, dailyTotals) => {
		const result = team.find((member) => member._id === dailyTotals._id);
		console.log('findSelectedTeamMember:', result);
		return result;
	};

	const selectTeamMemberById = (team, id) => {
		const teamMember = team.find((member) => member._id === id);
		if (teamMember) {
			console.log('selectTeamMemberById:', teamMember);
			// setSelectedTeamMember(teamMember);
		} else {
			console.log(`No team member found with id: `, id);
		}
	};

	const sortedDailyTotals = useMemo(() => {
		const sorted = [...dailyTotalsAll].sort((a, b) => {
			console.log('Sorting:', a, b);

			const correspondingTeamMemberA = team.find(
				(member) => member._id === a._id
			);
			const correspondingTeamMemberB = team.find(
				(member) => member._id === b._id
			);
			if (!correspondingTeamMemberA || !correspondingTeamMemberB) {
				return 0;
			}

			const positionComparison =
				correspondingTeamMemberA.position.localeCompare(
					correspondingTeamMemberB.position
				);

			if (positionComparison !== 0) {
				return positionComparison;
			}

			const nameComparison =
				correspondingTeamMemberA.teamMemberName.localeCompare(
					correspondingTeamMemberB.teamMemberName
				);
			return nameComparison;
		});

		console.log('sortedDailyTotals:', sorted);
		return sorted;
	}, [dailyTotalsAll, team]);

	return (
		<div>
			<DailyTotalsForm
				dailyTotals={dailyTotals}
				setDailyTotals={setDailyTotals}
				submitDailyTotals={submitDailyTotals}
				team={team}
				setTeam={setTeam}
			/>

			<h1>NEW TEST TOTALS</h1>
			<div>
				{team.map((teamMember) => (
					<TableContainer component={Paper} key={teamMember._id}>
						<Typography variant="h6">{`${teamMember.teamMemberName} - ${teamMember.position}`}</Typography>
						<Table>
							<TableHead>
								<TableRow>
									<TableCell>Date</TableCell>
									<TableCell align="right">
										Food Sales
									</TableCell>
									<TableCell align="right">
										Bar Sales
									</TableCell>
									<TableCell align="right">
										Non-Cash Tips
									</TableCell>
									<TableCell align="right">
										Cash Tips
									</TableCell>
									{/* Add more table cells here for other daily total fields */}
								</TableRow>
							</TableHead>
							<TableBody>
								{teamMember.dailyTotals.map(
									(dailyTotal, index) => (
										<TableRow key={index}>
											<TableCell>
												{new Date(
													dailyTotal.date
												).toLocaleDateString()}
											</TableCell>
											<TableCell align="right">
												{dailyTotal.foodSales}
											</TableCell>
											<TableCell align="right">
												{dailyTotal.barSales}
											</TableCell>
											<TableCell align="right">
												{dailyTotal.nonCashTips}
											</TableCell>
											<TableCell align="right">
												{dailyTotal.cashTips}
											</TableCell>
											{/* Add more table cells here for other daily total fields */}
										</TableRow>
									)
								)}
							</TableBody>
						</Table>
					</TableContainer>
				))}
			</div>

			<h2>Daily Totals</h2>
			<TableContainer component={Paper}>
				<Table className="sales-table" aria-label="simple table">
					<TableHead>
						<TableRow className="header-row">
							<TableCell>Date</TableCell>
							<TableCell align="right">Food Sales</TableCell>
							<TableCell align="right">Bar Sales</TableCell>
							<TableCell align="right">Non-Cash Tips</TableCell>
							<TableCell align="right">Cash Tips</TableCell>
							<TableCell align="right">Bar Tip Outs</TableCell>
							<TableCell align="right">Runner Tip Outs</TableCell>
							<TableCell align="right">Host Tip Outs</TableCell>
							<TableCell align="right">Total Tip Outs</TableCell>
							<TableCell align="right">Tips Received</TableCell>
							<TableCell align="right">
								Total Payroll Tips
							</TableCell>
							<TableCell align="right">Action</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{/* {sortedDailyTotals.map((dailyTotal, index, array) => {
						console.log(`dailyTotal at index ${index}:`, JSON.stringify(dailyTotal, null, 2));
						 */}
						{sortedDailyTotals.map((teamMember, index, id) => {
							// console.log('sortedDailyTotals:', JSON.stringify(sortedDailyTotals, null, 2));

							console.log(
								`teamMember at index ${index}`,
								teamMember,
								':',
								id,
								JSON.stringify(teamMember, null, 2)
							);

							return teamMember.dailyTotals.map(
								(dailyTotal, dailyTotalIndex) => {
									console.log(
										`dailyTotal at index ${dailyTotalIndex} for teamMember at index ${index}`,
										teamMember,
										':',
										id,
										JSON.stringify(dailyTotal, null, 2)
									);

									const correspondingTeamMember =
										findCorrespondingTeamMember(
											team,
											dailyTotal
										);

									const selectedTeamMember =
										findSelectedTeamMember(
											team,
											dailyTotal
										);

									const selectdTeamMemberById =
										selectTeamMemberById(team, id);

									console.log('team MAP: ', team);
									console.log(
										'dailyTotals MAP: ',
										team.dailyTotals
									);
									console.log(
										'findCorrespondingTeamMember:',
										correspondingTeamMember
									);
									console.log(
										'findCorrespondingTeamMember:',
										correspondingTeamMember
									);
									console.log(
										'selectedTeamMember:',
										selectedTeamMember
									);
									console.log(
										'selectTeamMemberById:',
										selectdTeamMemberById
									);

									if (!correspondingTeamMember) {
										return null;
									}

									const isFirstItem = checkIfFirstItem(
										dailyTotal,
										index,
										teamMember
										// array
									);

									const currencyColumns = [
										{
											className: 'foodSales-column',
											value: dailyTotal.foodSales,
										},
										{
											className: 'barSales-column',
											value: dailyTotal.barSales,
										},
										{
											className: 'nonCashTips-column',
											value: dailyTotal.nonCashTips,
										},
										{
											className: 'cashTips-column',
											value: dailyTotal.cashTips,
										},
										{
											className: 'barTipOuts-column',
											value: dailyTotal.barTipOuts,
										},
										{
											className: 'runnerTipOuts-column',
											value: dailyTotal.runnerTipOuts,
										},
										{
											className: 'hostTipOuts-column',
											value: dailyTotal.hostTipOuts,
										},
										{
											className: 'totalTipOuts-column',
											value: dailyTotal.totalTipOuts,
										},
										{
											className: 'tipsReceived-column',
											value: dailyTotal.tipsReceived,
										},
										{
											className:
												'totalPayrollTips-column',
											value: dailyTotal.totalPayrollTips,
										},
									];

									return (
										<React.Fragment
											key={dailyTotal._id || index}
										>
											{isFirstItem && (
												<TableRow>
													<TableCell colSpan={12}>
														<div className="teamMember-separator">
															<Divider />
															<Typography variant="body1">
																{`${
																	dailyTotal.teamMemberName
																} - ${
																	correspondingTeamMember
																		? correspondingTeamMember.position ||
																		  'No Position'
																		: 'Unknown Team Member'
																}`}
															</Typography>
															<Divider />
														</div>
													</TableCell>
												</TableRow>
											)}
											<TableRow className="flex-table-row">
												<TableCell
													component="th"
													scope="row"
												>
													{dailyTotal.date
														? FormattedDate(
																dailyTotal.date
														  )
														: dailyTotal.date}
												</TableCell>
												{/* {currencyColumns.map(
													(column) => (
														<TableCell align="right">
															{column.value}
														</TableCell>
													)
												)} */}

												{currencyColumns.map(
													(column) => (
														<CurrencyColumn
															className={
																column.className
															}
															value={column.value}
														/>
													)
												)}

												<TableCell align="right">
													<Button
														variant="contained"
														color="secondary"
														onClick={() =>
															deleteDailyTotal(
																dailyTotal,
																correspondingTeamMember
															)
														}
													>
														Delete
													</Button>
												</TableCell>
											</TableRow>
										</React.Fragment>
									);
								}
							);
						})}

					</TableBody>
				</Table>
			</TableContainer>
		</div>
	);
}

export default DailyTotals;



import React, {
	useState,
	useEffect,
	useContext,
	useMemo,
	useCallback,
	memo,
} from 'react';
import { FormattedDate } from './dateUtils';
import DailyTotalsForm from './dailyTotalsForm';
import { ErrorContext } from './contexts/ErrorContext';
import {
	fetchDailyTotalsAll,
	deleteDailyTotalFromServer,
	submitDailyTotalToServer,
} from './api';
import { TeamContext } from './contexts/TeamContext';
import {
	Button,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Typography,
	Divider,
} from '@material-ui/core';

const today = new Date();
const localDate = new Date(
	today.getFullYear(),
	today.getMonth(),
	today.getDate()
)
	.toISOString()
	.split('T')[0];
// const timeZone = "America/New_York";

const CurrencyColumn = memo(({ className, value }) => (
	<TableCell className={className}>
		{value
			? Number(value).toLocaleString('en-US', {
					style: 'currency',
					currency: 'USD',
			  })
			: 'N/A'}
	</TableCell>
));

function DailyTotals() {
	const { team, setTeam } = useContext(TeamContext);
	const { setError } = useContext(ErrorContext);
	const [dailyTotalsAll, setDailyTotalsAll] = useState([]);
	const [dailyTotals, setDailyTotals] = useState({
		teamMemberName: '',
		position: '',
		date: localDate,
		foodSales: '',
		barSales: '',
		nonCashTips: '',
		cashTips: '',
		barTipOuts: '',
		runnerTipOuts: '',
		hostTipOuts: '',
		totalTipOuts: '',
		tipsReceived: '',
		totalPayrollTips: '',
	});

	const fetchDailyTotals = useCallback(async () => {
		try {
			const data = await fetchDailyTotalsAll();
			const updatedData = data.map((dailyTotal) => ({
				...dailyTotal,
				teamMemberName: dailyTotal.teamMemberName,
				position: dailyTotal.position,
			}));
			// console.log(`Fetched Totals:`, updatedData);
			setDailyTotalsAll(updatedData);
		} catch (error) {
			console.error(error);
			setError(error.message);
		}
	}, [setError]);

	useEffect(() => {
		fetchDailyTotals();
	}, [fetchDailyTotals]);

	// submitDailyTotals function breakdown
	const submitDailyTotals = useCallback(
		async (dailyTotals) => {
			if (!validateDailyTotals(dailyTotals, dailyTotalsAll)) {
				return;
			}

			const selectedTeamMember = findSelectedTeamMember(
				team,
				dailyTotals
			);

			console.log('team SUBMIT:', team);
			console.log('dailyTotals SUBMIT:', dailyTotals);
			console.log('selectedTeamMember SUBMIT:', selectedTeamMember);

			if (!selectedTeamMember) {
				alert('Selected team member not found in the team list.');
				return;
			}

			const newDailyTotals = prepareDailyTotals(
				selectedTeamMember,
				dailyTotals
			);

			try {
				await submitDailyTotalToServer(
					selectedTeamMember._id,
					newDailyTotals
				);
				clearFormFields(setDailyTotals);
				fetchDailyTotals();
			} catch (error) {
				handleSubmissionError(error, dailyTotals);
			}
		},
		[team, dailyTotalsAll, fetchDailyTotals]
	);

	const validateDailyTotals = (dailyTotals, dailyTotalsAll) => {
		if (
			!dailyTotals.teamMemberName &&
			!dailyTotals.position &&
			!dailyTotals.date
		) {
			alert('INVALID DATA!');
			console.log(dailyTotals);
			return false;
		}

		const isDuplicateDailyTotal = dailyTotalsAll.find(
			(total) =>
				total.teamMemberName === dailyTotals.teamMemberName &&
				total.position === dailyTotals.position &&
				total.date === dailyTotals.date
		);

		if (isDuplicateDailyTotal) {
			alert(
				`${isDuplicateDailyTotal.date} totals for ${isDuplicateDailyTotal.teamMemberName} - ${isDuplicateDailyTotal.position} already exist.`
			);
			return false;
		}
		return true;
	};

	const prepareDailyTotals = (selectedTeamMember, dailyTotals) => {
		return {
			teamMemberName: selectedTeamMember.teamMemberName,
			position: selectedTeamMember.position,
			date: dailyTotals.date,
			foodSales: dailyTotals.foodSales,
			barSales: dailyTotals.barSales,
			nonCashTips: dailyTotals.nonCashTips,
			cashTips: dailyTotals.cashTips,
			barTipOuts: dailyTotals.barTipOuts,
			runnerTipOuts: dailyTotals.runnerTipOuts,
			hostTipOuts: dailyTotals.hostTipOuts,
			totalTipOuts: dailyTotals.totalTipOuts,
			tipsReceived: dailyTotals.tipsReceived,
			totalPayrollTips: dailyTotals.totalPayrollTips,
		};
	};

	const clearFormFields = (setDailyTotals) => {
		setDailyTotals({
			teamMember: '',
			date: new Date(),
			foodSales: '',
			barSales: '',
			nonCashTips: '',
			cashTips: '',
		});
	};

	const handleSubmissionError = (error, dailyTotals) => {
		if (error.response && error.response.status === 400) {
			alert(
				`Totals on ${dailyTotals.date} for ${dailyTotals.teamMember} - ${dailyTotals.position} already exists.`
			);
		} else {
			alert('An error occurred while submitting daily totals.');
		}
		console.error(error);
	};

	const deleteDailyTotal = useCallback(
		async (dailyTotal, correspondingTeamMember) => {
			const formattedDate = FormattedDate(dailyTotal.date);
			const confirmation = window.confirm(
				`ARE YOU SURE YOU WANT TO DELETE THE DAILY TOTAL FOR:\n\n${dailyTotal.teamMemberName.toUpperCase()}		ON:		${formattedDate.toUpperCase()}?`
			);
			if (!confirmation) {
				return;
			}
			try {
				if (!correspondingTeamMember) {
					console.error('Corresponding team member not found');
					alert('Failed to delete daily total');
					return;
				}
				if (!dailyTotal || !dailyTotal._id) {
					console.error(
						`dailyTotal._id is undefined: , ${dailyTotal}, ID: ,  ${dailyTotal._id}`
					);
					return;
				}
				const response = await deleteDailyTotalFromServer(
					correspondingTeamMember._id,
					dailyTotal._id
				);

				fetchDailyTotals();
				console.log(`deleteDailyTotal: ${response.data}`);
			} catch (error) {
				setError(`Error deleting daily total: ${error.message}`);
				alert(`Failed to delete daily totals: ${error.message}`);
			}
		},
		[setError, fetchDailyTotals]
	);

	const findSelectedTeamMember = (team, dailyTotals) => {
		const result = team.find((member) => member._id === dailyTotals._id);
		console.log('findSelectedTeamMember:', result);
		return result;
	};

	return (
		<div>
			<DailyTotalsForm
				dailyTotals={dailyTotals}
				setDailyTotals={setDailyTotals}
				submitDailyTotals={submitDailyTotals}
				team={team}
				setTeam={setTeam}
			/>

			<h1>NEW TEST TOTALS</h1>
			<TableContainer component={Paper}>
				<Table className="sales-table" aria-label="simple table">
					<TableHead>
						<TableRow className="header-row">
							<TableCell>Date</TableCell>
							<TableCell align="right">Food Sales</TableCell>
							<TableCell align="right">Bar Sales</TableCell>
							<TableCell align="right">Non-Cash Tips</TableCell>
							<TableCell align="right">Cash Tips</TableCell>
							<TableCell align="right">Bar Tip Outs</TableCell>
							<TableCell align="right">Runner Tip Outs</TableCell>
							<TableCell align="right">Host Tip Outs</TableCell>
							<TableCell align="right">Total Tip Outs</TableCell>
							<TableCell align="right">Tips Received</TableCell>
							<TableCell align="right">
								Total Payroll Tips
							</TableCell>
							<TableCell align="right">Action</TableCell>
						</TableRow>
					</TableHead>

					<TableBody>
						{team.map((teamMember) => (
							<React.Fragment key={teamMember._id}>
								<Typography variant="h6">{`${teamMember.teamMemberName} - ${teamMember.position}`}</Typography>

								{teamMember.dailyTotals.map(
									(dailyTotal, index) => {
										const currencyColumns = [
											{
												className: 'foodSales-column',
												value: dailyTotal.foodSales,
											},
											{
												className: 'barSales-column',
												value: dailyTotal.barSales,
											},
											{
												className: 'nonCashTips-column',
												value: dailyTotal.nonCashTips,
											},
											{
												className: 'cashTips-column',
												value: dailyTotal.cashTips,
											},
											{
												className: 'barTipOuts-column',
												value: dailyTotal.barTipOuts,
											},
											{
												className:
													'runnerTipOuts-column',
												value: dailyTotal.runnerTipOuts,
											},
											{
												className: 'hostTipOuts-column',
												value: dailyTotal.hostTipOuts,
											},
											{
												className:
													'totalTipOuts-column',
												value: dailyTotal.totalTipOuts,
											},
											{
												className:
													'tipsReceived-column',
												value: dailyTotal.tipsReceived,
											},
											{
												className:
													'totalPayrollTips-column',
												value: dailyTotal.totalPayrollTips,
											},
										];

										return (
											<React.Fragment
												key={dailyTotal._id || index}
											>
												<TableRow
													className="flex-table-row"
													key={index}
												>
													<TableCell
														component="th"
														scope="row"
													>
														{dailyTotal.date
															? FormattedDate(
																	dailyTotal.date
															  )
															: dailyTotal.date}
													</TableCell>
													<TableCell align="right">
														<TableRow>
															{currencyColumns.map(
																(
																	column,
																	index
																) => (
																	<CurrencyColumn
																		key={
																			index
																		}
																		className={
																			column.className
																		}
																		value={
																			column.value
																		}
																	/>
																)
															)}
														</TableRow>

														<Button
															variant="contained"
															color="secondary"
															onClick={() =>
																deleteDailyTotal(
																	dailyTotal,
																	teamMember
																)
															}
														>
															Delete
														</Button>
													</TableCell>
												</TableRow>
											</React.Fragment>
										);
									}
								)}
							</React.Fragment>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</div>
	);
}

export default DailyTotals;


<TableBody>
								
{teamMember.dailyTotals.map(
	(dailyTotal, index) => (
		<TableRow key={index}>
			<TableCell>
				{dailyTotal.date}
			</TableCell>
			<TableCell align="right">
				{dailyTotal.foodSales}
			</TableCell>
			<TableCell align="right">
				{dailyTotal.barSales}
			</TableCell>
			<TableCell align="right">
				{dailyTotal.nonCashTips}
			</TableCell>
			<TableCell align="right">
				{dailyTotal.cashTips}
			</TableCell>
			{/* Add more table cells here for other daily total fields */}
		</TableRow>
	)
)}
</TableBody>
</Table>
</TableContainer>
))}
</div>

import React, {
	useState,
	useEffect,
	useContext,
	useCallback,
	memo,
} from 'react';
import { FormattedDate } from './dateUtils';
import DailyTotalsForm from './dailyTotalsForm';
import { ErrorContext } from './contexts/ErrorContext';
import {
	fetchDailyTotalsAll,
	deleteDailyTotalFromServer,
	submitDailyTotalToServer,
} from './api';
import { TeamContext } from './contexts/TeamContext';
import {
	Button,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Typography,
	Divider,
} from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
	tableRow: {
		'&:nth-of-type(odd)': {
			backgroundColor: '#f4f4f4', // change this to your desired color
		},
	},
});

const today = new Date();
const localDate = new Date(
	today.getFullYear(),
	today.getMonth(),
	today.getDate()
)
	.toISOString()
	.split('T')[0];
// const timeZone = "America/New_York";

const CurrencyColumn = memo(({ className, value }) => (
	<TableCell className={className}>
		{value
			? Number(value).toLocaleString('en-US', {
					style: 'currency',
					currency: 'USD',
			  })
			: 'N/A'}
	</TableCell>
));

function DailyTotals() {
	const classes = useStyles();
	const { team, setTeam } = useContext(TeamContext);
	const { setError } = useContext(ErrorContext);
	const [dailyTotalsAll, setDailyTotalsAll] = useState([]);
	const [dailyTotals, setDailyTotals] = useState({
		teamMemberName: '',
		position: '',
		date: localDate,
		foodSales: '',
		barSales: '',
		nonCashTips: '',
		cashTips: '',
		barTipOuts: '',
		runnerTipOuts: '',
		hostTipOuts: '',
		totalTipOuts: '',
		tipsReceived: '',
		totalPayrollTips: '',
	});

	const fetchDailyTotals = useCallback(async () => {
		try {
			const data = await fetchDailyTotalsAll();
			setDailyTotalsAll(data);
		} catch (error) {
			console.error(error);
			setError(error.message);
		}
	}, [setError]);

	useEffect(() => {
		fetchDailyTotals();
	}, [fetchDailyTotals]);

	// submitDailyTotals function breakdown
	const submitDailyTotals = useCallback(
		async (dailyTotals) => {
			if (!validateDailyTotals(dailyTotals, dailyTotalsAll)) {
				return;
			}

			const selectedTeamMember = findCorrespondingTeamMember(
				team,
				dailyTotals
			);

			console.log('team SUBMIT:', team);
			console.log('dailyTotals SUBMIT:', dailyTotals);
			console.log('selectedTeamMember SUBMIT:', selectedTeamMember);

			if (!selectedTeamMember) {
				alert('Selected team member not found in the team list.');
				return;
			}

			const newDailyTotals = prepareDailyTotals(
				selectedTeamMember,
				dailyTotals
			);

			try {
				await submitDailyTotalToServer(
					selectedTeamMember._id,
					newDailyTotals
				);
				clearFormFields(setDailyTotals);
				fetchDailyTotals();
			} catch (error) {
				handleSubmissionError(error, dailyTotals);
			}
		},
		[team, dailyTotalsAll, fetchDailyTotals]
	);

	const validateDailyTotals = (dailyTotals, dailyTotalsAll) => {
		if (
			!dailyTotals.teamMemberName &&
			!dailyTotals.position &&
			!dailyTotals.date
		) {
			alert('INVALID DATA!');
			console.log(dailyTotals);
			return false;
		}

		const isDuplicateDailyTotal = dailyTotalsAll.find(
			(total) =>
				total.teamMemberName === dailyTotals.teamMemberName &&
				total.position === dailyTotals.position &&
				total.date === dailyTotals.date
		);

		if (isDuplicateDailyTotal) {
			alert(
				`${isDuplicateDailyTotal.date} totals for ${isDuplicateDailyTotal.teamMemberName} - ${isDuplicateDailyTotal.position} already exist.`
			);
			return false;
		}
		return true;
	};

	const prepareDailyTotals = (selectedTeamMember, dailyTotals) => {
		return {
			teamMemberName: selectedTeamMember.teamMemberName,
			position: selectedTeamMember.position,
			date: dailyTotals.date,
			foodSales: dailyTotals.foodSales,
			barSales: dailyTotals.barSales,
			nonCashTips: dailyTotals.nonCashTips,
			cashTips: dailyTotals.cashTips,
			barTipOuts: dailyTotals.barTipOuts,
			runnerTipOuts: dailyTotals.runnerTipOuts,
			hostTipOuts: dailyTotals.hostTipOuts,
			totalTipOuts: dailyTotals.totalTipOuts,
			tipsReceived: dailyTotals.tipsReceived,
			totalPayrollTips: dailyTotals.totalPayrollTips,
		};
	};

	const clearFormFields = (setDailyTotals) => {
		setDailyTotals({
			teamMember: '',
			date: new Date(),
			foodSales: '',
			barSales: '',
			nonCashTips: '',
			cashTips: '',
		});
	};

	const handleSubmissionError = (error, dailyTotals) => {
		if (error.response && error.response.status === 400) {
			alert(
				`Totals on ${dailyTotals.date} for ${dailyTotals.teamMember} - ${dailyTotals.position} already exists.`
			);
		} else {
			alert('An error occurred while submitting daily totals.');
		}
		console.error(error);
	};

	const deleteDailyTotal = useCallback(
		async (dailyTotal, correspondingTeamMember) => {
			const formattedDate = FormattedDate(dailyTotal.date);
			const confirmation = window.confirm(
				`ARE YOU SURE YOU WANT TO DELETE THE DAILY TOTAL FOR:\n\n${dailyTotal.teamMemberName.toUpperCase()}		ON:		${formattedDate.toUpperCase()}?`
			);
			if (!confirmation) {
				return;
			}
			try {
				if (!correspondingTeamMember) {
					console.error('Corresponding team member not found');
					alert('Failed to delete daily total');
					return;
				}
				if (!dailyTotal || !dailyTotal._id) {
					console.error(
						`dailyTotal._id is undefined: , ${dailyTotal}, ID: ,  ${dailyTotal._id}`
					);
					return;
				}
				const response = await deleteDailyTotalFromServer(
					correspondingTeamMember._id,
					dailyTotal._id
				);

				fetchDailyTotals();
				console.log(`deleteDailyTotal: ${response.data}`);
			} catch (error) {
				setError(`Error deleting daily total: ${error.message}`);
				alert(`Failed to delete daily totals: ${error.message}`);
			}
		},
		[setError, fetchDailyTotals]
	);

	const findCorrespondingTeamMember = (team, dailyTotal) => {
		const result = team.find((member) => member._id === dailyTotal._id);
		console.log('findCorrespondingTeamMember:', result);
		return result;
	};

	return (
		<React.Fragment>
			<DailyTotalsForm
				dailyTotals={dailyTotals}
				setDailyTotals={setDailyTotals}
				submitDailyTotals={submitDailyTotals}
				team={team}
				setTeam={setTeam}
			/>

			<Typography variant="h2" component="h2" gutterBottom>
				DAILY TOTALALS
			</Typography>
			<TableContainer component={Paper}>
				<Table className="sales-table" aria-label="simple table">
					<TableHead>
						<TableRow className="header-row">
							<TableCell>Date</TableCell>
							<TableCell align="right">Food Sales</TableCell>
							<TableCell align="right">Bar Sales</TableCell>
							<TableCell align="right">Non-Cash Tips</TableCell>
							<TableCell align="right">Cash Tips</TableCell>
							<TableCell align="right">Bar Tip Outs</TableCell>
							<TableCell align="right">Runner Tip Outs</TableCell>
							<TableCell align="right">Host Tip Outs</TableCell>
							<TableCell align="right">Total Tip Outs</TableCell>
							<TableCell align="right">Tips Received</TableCell>
							<TableCell align="right">
								Total Payroll Tips
							</TableCell>
							<TableCell align="right">Action</TableCell>
						</TableRow>
					</TableHead>
					{team.map((teamMember) => (
						<React.Fragment key={teamMember.id}>
							<TableBody>
								<TableRow>
									<TableCell
										colSpan={12}
									>{`${teamMember.teamMemberName} - ${teamMember.position}`}</TableCell>
								</TableRow>
								<TableRow>
									<TableCell colSpan={12}>
										<Divider />
									</TableCell>
								</TableRow>
							</TableBody>
							<TableBody>
								{teamMember.dailyTotals.map(
									(dailyTotal, index) => {
										const currencyColumns = [
											{
												className: 'foodSales-column',
												value: dailyTotal.foodSales,
											},
											{
												className: 'barSales-column',
												value: dailyTotal.barSales,
											},
											{
												className: 'nonCashTips-column',
												value: dailyTotal.nonCashTips,
											},
											{
												className: 'cashTips-column',
												value: dailyTotal.cashTips,
											},
											{
												className: 'barTipOuts-column',
												value: dailyTotal.barTipOuts,
											},
											{
												className:
													'runnerTipOuts-column',
												value: dailyTotal.runnerTipOuts,
											},
											{
												className: 'hostTipOuts-column',
												value: dailyTotal.hostTipOuts,
											},
											{
												className:
													'totalTipOuts-column',
												value: dailyTotal.totalTipOuts,
											},
											{
												className:
													'tipsReceived-column',
												value: dailyTotal.tipsReceived,
											},
											{
												className:
													'totalPayrollTips-column',
												value: dailyTotal.totalPayrollTips,
											},
										];
										const handleDelete = () => {
											deleteDailyTotal(dailyTotal, teamMember);
										};
										return (
											<React.Fragment key={index}>
												<TableRow
													key={index}
													className={classes.tableRow}
												>
													<TableCell
														component="th"
														scope="row"
													>
														{dailyTotal.date
															? FormattedDate(
																	dailyTotal.date
															  )
															: dailyTotal.date}
													</TableCell>
													{currencyColumns.map(
														(column, id) => (
															<CurrencyColumn
																key={id}
																className={
																	column.className
																}
																value={
																	column.value
																}
															/>
														)
													)}
													<TableCell align="right">
														<Button
															variant="contained"
															color="secondary"
															onClick={
																handleDelete
															}
														>
															Delete
														</Button>
													</TableCell>
												</TableRow>
											</React.Fragment>
										);
									}
								)}
							</TableBody>
						</React.Fragment>
					))}
				</Table>
			</TableContainer>
		</React.Fragment>
	);
}

export default DailyTotals;