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
	<td className={className}>
		{value
			? Number(value).toLocaleString('en-US', {
					style: 'currency',
					currency: 'USD',
			  })
			: 'N/A'}
	</td>
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

	const findSelectedTeamMember = (team, dailyTotals) => {
		return team.find(
			(member) => member.teamMemberName === dailyTotals.teamMemberName
		);
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
						`dailyTotal._id is undefined: , ${dailyTotal}, ${dailyTotal}`
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
	const findCorrespondingTeamMember = (team, dailyTotal) => {
		return team.find((member) => member._id === dailyTotal._id);
	};

	const checkIfFirstItem = (dailyTotal, index, array) => {
		return (
			index === 0 ||
			array[index - 1].teamMemberName !== dailyTotal.teamMemberName
		);
	};

	const sortedDailyTotals = useMemo(() => {
		const sorted = [...dailyTotalsAll].sort((a, b) => {
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

			return correspondingTeamMemberA.teamMemberName.localeCompare(
				correspondingTeamMemberB.teamMemberName
			);
		});
		// console.log(`SORTED: ${JSON.stringify(sorted, null, 2)}`);
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
					{/* {sortedDailyTotals.map((dailyTotal, index, array) => {
						console.log(`dailyTotal at index ${index}:`, JSON.stringify(dailyTotal, null, 2));
						 */}
					{sortedDailyTotals.map((teamMember, index) => {
						// console.log('sortedDailyTotals:', JSON.stringify(sortedDailyTotals, null, 2));

						console.log(
							`teamMember at index ${index}:`,
							JSON.stringify(teamMember, null, 2)
						);

						return teamMember.dailyTotals.map(
							(dailyTotal, dailyTotalIndex) => {
								console.log(
									`dailyTotal at index ${dailyTotalIndex} for teamMember at index ${index}:`,
									JSON.stringify(dailyTotal, null, 2)
								);

								const correspondingTeamMember =
									findCorrespondingTeamMember(
										team,
										dailyTotal
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
										className: 'totalPayrollTips-column',
										value: dailyTotal.totalPayrollTips,
									},
								];

								return (
									<React.Fragment
										key={dailyTotal._id || index}
									>
										{isFirstItem && (
											<tr>
												<td colSpan="12">
													<div className="teamMember-separator">
														<hr />
														<p>{`${
															dailyTotal.teamMemberName
														} - ${
															correspondingTeamMember
																? correspondingTeamMember.position ||
																  'No Position'
																: 'Unknown Team Member'
														}`}</p>
														<hr />
													</div>
												</td>
											</tr>
										)}
										<tr className="flex-table-row">
											<td className="date-column">
												{dailyTotal.date
													? FormattedDate(
															dailyTotal.date
													  )
													: dailyTotal.date}
											</td>
											{currencyColumns.map((column) => (
												<CurrencyColumn
													className={column.className}
													value={column.value}
												/>
											))}
											<td className="delete-button-column">
												<button
													onClick={() =>
														deleteDailyTotal(
															dailyTotal,
															correspondingTeamMember
														)
													}
												>
													Delete
												</button>
											</td>
										</tr>
									</React.Fragment>
								);
							}
						);
					})}
				</tbody>
			</table>
		</div>
	);
}

export default DailyTotals;