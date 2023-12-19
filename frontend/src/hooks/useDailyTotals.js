import useDailyTotals from '../hooks/useDailyTotals';
import DailyTotalsFormRender from '../components/DailyTotalsFormRender';
import { useContext } from 'react';
import { TeamContext } from '../contexts/TeamContext';


export default function DailyTotalsFormContainer() {
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