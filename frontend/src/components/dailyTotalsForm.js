import React, { useContext, useState, useEffect } from 'react';
import moment from 'moment';
import { DailyTotalsFormRender } from '../sections/dailyTotals/dailyTotalsFormRender';
import { DailyTotalsContext } from '../contexts/DailyTotalsContext';
import { TeamContext } from '../contexts/TeamContext';
import { updateWeeklyTotals } from '../utils/api';
import { initialDailyTotals } from '../hooks/initiateDailyTotals';
import { useHandleDailyTotalsChange } from '../hooks/handleDailyTotalsChange';
import { useHandleSubmit } from '../hooks/handleSubmitDailyTotals';

export default function DailyTotalsFormContainer() {
	const { team } = useContext(TeamContext);
	const { submitDailyTotals } = useContext(DailyTotalsContext);
	const [dailyTotals, setDailyTotals] = useState(initialDailyTotals);
	const [selectedTeamMember, setSelectedTeamMember] = React.useState('');

	const handleDailyTotalsChange = useHandleDailyTotalsChange(team, setDailyTotals, setSelectedTeamMember);
	const handleSubmit = useHandleSubmit(submitDailyTotals, dailyTotals, selectedTeamMember, setSelectedTeamMember, initialDailyTotals, setDailyTotals);
	
	useEffect(() => {
		const now = moment().local();
		const nextDay = moment().local().add(1, 'days').startOf('day');
		const msUntilMidnight = nextDay.diff(now);

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
			setSelectedTeamMember={setSelectedTeamMember}
		/>
	);
}