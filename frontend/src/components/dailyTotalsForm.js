import React, { useEffect, useContext, useState } from 'react';
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
		if (field === 'teamMemberID') {
			setSelectedTeamMember(value);
		} else {
			let updates = { [field]: value === '' ? 0 : value };

			setDailyTotals((prevDailyTotals) => ({
				...prevDailyTotals,
				...updates,
			}));
		}
	};

	const updateWeeklyTotals = async () => {
		for (const teamMember of team) {
			teamMember.updateWeeklyTotals();
			await teamMember.save();
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const { date, ...otherFields } = dailyTotals;
		await submitDailyTotals({ date: date, ...otherFields }, selectedTeamMember);
		const teamMember = team.find(member => member._id === selectedTeamMember);
		if (teamMember) {
			teamMember.updateWeeklyTotals();
			await teamMember.save();
		}
		setSelectedTeamMember('');
	};

    useEffect(() => {
        const now = new Date();
        const nextDay = new Date(now);
        nextDay.setDate(nextDay.getDate() + 1);
        nextDay.setHours(0, 0, 0, 0);
        const msUntilMidnight = nextDay - now;

        const timeoutId = setTimeout(updateWeeklyTotals, msUntilMidnight);

        return () => clearTimeout(timeoutId); // Clear the timeout if the component is unmounted
    }, [selectedTeamMember]);

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
