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
import { useRefresh } from './contexts/RefreshContext';
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
	const { refresh } = useRefresh();
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

	const fetchTotals = useCallback(async () => {
		try {
			const totals = await fetchDailyTotalsAll();
			setDailyTotalsAll(totals);
		} catch (error) {
			setError('Failed to fetch daily totals');
		}
	}, [setError]);

	useEffect(() => {
		fetchTotals();
	}, [fetchTotals]);

	const submitDailyTotals = useCallback(
		async (dailyTotals) => {
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
					(member) =>
						member.teamMemberName === dailyTotals.teamMemberName
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

				await submitDailyTotalToServer(
					selectedTeamMember._id,
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
		},
		[team, dailyTotalsAll, fetchTotals]
	);

	const sortedDailyTotals = useMemo(() => {
		return [...dailyTotalsAll].sort((a, b) => {
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
		});
	}, [dailyTotalsAll, team]);

	const deleteDailyTotal = useCallback(
		async (dailyTotal, correspondingTeamMember) => {
			const formattedDate = FormattedDate(dailyTotal.date);
			const confirmation = window.confirm(
				`ARE YOU SURE YOU WANT TO DELETE THE DAILY TOTAL FOR:\n\n${dailyTotal.teamMember.toUpperCase()}		ON:		${formattedDate.toUpperCase()}?`
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

				fetchTotals();
				console.log(`deleteDailyTotal: ${response.data}`);
			} catch (error) {
				setError(`Error deleting daily total: ${error.message}`);
				alert(`Failed to delete daily totals: ${error.message}`);
			}
		},
		[setError, fetchTotals]
	);

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
							(member) =>
								member.teamMemberName === dailyTotal.teamMember
						);

						const isFirstItem =
							index === 0 ||
							array[index - 1].teamMember !==
								dailyTotal.teamMember;

						return (
							<React.Fragment key={dailyTotal._id || index}>
								{isFirstItem && (
									<tr>
										<td colSpan="12">
											<div className="teamMember-separator">
												<hr />
												<p>{`${
													dailyTotal.teamMember
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
											? FormattedDate(dailyTotal.date)
											: 'Invalid Date'}
									</td>

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
					})}
				</tbody>
			</table>
		</div>
	);
}

export default DailyTotals;
