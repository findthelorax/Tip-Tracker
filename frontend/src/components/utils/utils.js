export function FormattedDate(dateString) {
    const date = new Date(dateString);
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth();
    const day = date.getUTCDate();
    const formattedDate = new Date(year, month, day);
    return `${formattedDate.toLocaleString('default', { month: 'short' })} ${formattedDate.getDate()}, ${formattedDate.getFullYear()}`;
}
export const FormInputDate = () => {
    const currentDate = new Date();
    const formInputDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
    return formInputDate;
};

export const CalculateTipOuts = (dailyTotals, selectedTeamMember, team) => {
    let tipOuts = {
        bartender: 0,
        host: 0,
        runner: 0,
        server: 0
    };

    if (selectedTeamMember.position === 'server') {
        // Calculate server tip outs
        tipOuts.bartender = Number(dailyTotals.barSales) * 0.05;
        tipOuts.runner = Number(dailyTotals.foodSales) * 0.04;
        tipOuts.host = Number(dailyTotals.foodSales) * 0.015;

        // Distribute tip outs to bartenders, runners, and hosts who worked the same day
        for (const member of team) {
            const workedSameDate = member.dailyTotals.some((total) => total.date === dailyTotals.date);

            if (workedSameDate) {
                if (member.position === 'bartender') {
                    member.dailyTotals.find((total) => total.date === dailyTotals.date).barTipOuts += tipOuts.bartender;
                } else if (member.position === 'runner') {
                    member.dailyTotals.find((total) => total.date === dailyTotals.date).runnerTipOuts += tipOuts.runner;
                } else if (member.position === 'host') {
                    member.dailyTotals.find((total) => total.date === dailyTotals.date).hostTipOuts += tipOuts.host;
                }
            }
        }
    }

    return tipOuts;
};