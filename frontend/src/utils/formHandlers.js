export async function handleSubmit(e, dailyTotals, submitDailyTotals, setSelectedTeamMember, selectedTeamMember) {
    e.preventDefault();
    const { date, ...otherFields } = dailyTotals;
    await submitDailyTotals({ date: date, ...otherFields }, selectedTeamMember);
    setSelectedTeamMember('');
}