import useDailyTotals from './useDailyTotals';
import DailyTotalsFormRender from '../../sections/dailyTotals/dailyTotalsFormRender';
import { useContext } from 'react';
import { TeamContext } from '../../contexts/TeamContext';

export function DailyTotalsFormContainer() {
    const { team } = useContext(TeamContext);
    const { dailyTotals, selectedTeamMember, handleDailyTotalsChange, handleSubmit } = useDailyTotals();

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