import React from 'react';
import { DailyTotalsForm } from '../sections/dailyTotals/dailyTotalsFormRender';

export default function DailyTotalsFormContainer({
	team,
	dailyTotals,
	setDailyTotals,
	submitDailyTotals,
	selectedTeamMember,
	setSelectedTeamMember,
}) {
	const handleDailyTotalsChange = (field, value) => {
		let updates = { [field]: value === '' ? 0 : value };

		setDailyTotals((prevDailyTotals) => ({
			...prevDailyTotals,
			...updates,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const { date, ...otherFields } = dailyTotals;
		await submitDailyTotals({ date: date, ...otherFields }, selectedTeamMember);
		setSelectedTeamMember('');
	};

	return (
		<DailyTotalsForm
			team={team}
			dailyTotals={dailyTotals}
			handleDailyTotalsChange={handleDailyTotalsChange}
			handleSubmit={handleSubmit}
			selectedTeamMember={selectedTeamMember}
		/>
	);
}