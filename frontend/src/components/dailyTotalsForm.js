import React, { useContext, useState } from 'react';
import { DailyTotalsFormRender } from '../sections/dailyTotals/dailyTotalsFormRender';
import { DailyTotalsContext } from '../contexts/DailyTotalsContext';
import { TeamContext } from '../contexts/TeamContext';
import { initialDailyTotals } from '../contexts/DailyTotalsContext';

export default function DailyTotalsFormContainer() {
	const { team } = useContext(TeamContext);
	const { submitDailyTotals } = useContext(DailyTotalsContext);
    const [dailyTotals, setDailyTotals] = useState(initialDailyTotals);
	const [selectedTeamMember, setSelectedTeamMember] = React.useState('');
	
	const handleDailyTotalsChange = (field, value) => {
		console.log("🚀 ~ file: dailyTotalsForm.js:14 ~ handleDailyTotalsChange ~ field:", field)
		console.log("🚀 ~ file: dailyTotalsForm.js:14 ~ handleDailyTotalsChange ~ value:", value)
		if (field === 'teamMemberId') {

			const teamMember = team.find(member => member._id === value);
			console.log("🚀 ~ file: dailyTotalsForm.js:17 ~ handleDailyTotalsChange ~ teamMember:", teamMember)
			setSelectedTeamMember(teamMember);
		} else {
			let updates = { [field]: value === '' ? 0 : value };

			setDailyTotals((prevDailyTotals) => ({
				...prevDailyTotals,
				...updates,
			}));
		}
			console.log("🚀 ~ file: dailyTotalsForm.js:29 ~ handleDailyTotalsChange ~ setSelectedTeamMember:", setSelectedTeamMember)
	};

	// const updateWeeklyTotals = async () => {
	// 	for (const teamMember of team) {
	// 		teamMember.updateWeeklyTotals();
	// 		await teamMember.save();
	// 	}
	// };

	const handleSubmit = async (e) => {
		console.log("🚀 ~ file: dailyTotalsForm.js:38 ~ handleSubmit ~ e:", e)
		e.preventDefault();
		const { date, ...otherFields } = dailyTotals;
		await submitDailyTotals({ date: date, ...otherFields }, selectedTeamMember);
		console.log("🚀 ~ file: dailyTotalsForm.js:41 ~ handleSubmit ~ selectedTeamMember:", selectedTeamMember)
		// const teamMember = team.find(member => member._id === selectedTeamMember);
		// if (teamMember) {
		// 	teamMember.updateWeeklyTotals();
		// 	await teamMember.save();
		// }
		setSelectedTeamMember('');
	};

    // useEffect(() => {
    //     const now = new Date();
    //     const nextDay = new Date(now);
    //     nextDay.setDate(nextDay.getDate() + 1);
    //     nextDay.setHours(0, 0, 0, 0);
    //     const msUntilMidnight = nextDay - now;

    //     const timeoutId = setTimeout(updateWeeklyTotals, msUntilMidnight);

    //     return () => clearTimeout(timeoutId); // Clear the timeout if the component is unmounted
    // }, [selectedTeamMember]);

	return (
		<DailyTotalsFormRender
			team={team}
			dailyTotals={dailyTotals}
			handleDailyTotalsChange={handleDailyTotalsChange}
			handleSubmit={handleSubmit}
			selectedTeamMember={selectedTeamMember}
		/>
	);
}