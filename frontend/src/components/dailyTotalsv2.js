import React, { useState, useEffect, useCallback, useContext } from 'react';
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