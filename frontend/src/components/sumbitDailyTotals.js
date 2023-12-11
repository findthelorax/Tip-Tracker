import axios from 'axios';


const submitDailyTotals = async (dailyTotals, dailyTotalsAll, team, setTeam, setDailyTotals, fetchDailyTotalsAll) => {
    try {
        // Validate if teamMember is selected
        if (!dailyTotals.teamMemberName) {
            alert("Please select a team member");
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
                `${isDuplicateDailyTotal.date} totals for ${isDuplicateDailyTotal.teamMember} - ${isDuplicateDailyTotal.position} already exist.`
            );
            return;
        }

        // Find the selected team member by name and position to get their ID
        const selectedTeamMember = team.find(
            (member) => member.name === dailyTotals.teamMember
        );

        console.log(
            `SELECTED TEAM MEMBER: ${selectedTeamMember.name} - ${selectedTeamMember.position}`
        );

        // Prepare daily total object
        const newDailyTotal = {
            // teamMember: selectedTeamMember.name,
            // position: selectedTeamMember.position,
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

        const updatedTeamMember = {
            ...selectedTeamMember,
            dailyTotals: newDailyTotal,
        };

        // Update the team state with the modified team member
        setTeam((prevTeam) =>
            prevTeam.map((member) =>
                member.name === updatedTeamMember.name
                    ? updatedTeamMember
                    : member
            )
        );

        await axios.post(
            `${process.env.REACT_APP_SERVER_URL}/api/dailyTotals/${updatedTeamMember._id}`,
            dailyTotals
        );

        // Clear the form fields
        setDailyTotals({
            teamMember: "",
            date: new Date(),
            foodSales: "",
            barSales: "",
            nonCashTips: "",
            cashTips: "",
        });

        // Refresh the daily totals list
        fetchDailyTotalsAll();
    } catch (error) {
        if (error.response && error.response.status === 400) {
            alert(
                `Totals on ${dailyTotals.date} for ${dailyTotals.teamMember} - ${dailyTotals.position} already exists.`
            );
        } else {
            alert("An error occurred while submitting daily totals.");
        }
        console.error(error);
    }
};

export default submitDailyTotals;