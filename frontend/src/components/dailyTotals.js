import React, { useState, useEffect } from "react";
import axios from "axios";
import { FormattedDate } from "./dateUtils";
import DailyTotalsForm from "./dailyTotalsForm";
import { set } from "lodash";
const timeZone = "America/New_York";

function DailyTotals({ team, setTeam, setError }) {
    const [dailyTotals, setDailyTotals] = useState({
        teamMember: "",
        position: "",
        date: new Date(),
        foodSales: "",
        barSales: "",
        nonCashTips: "",
        cashTips: "",
    });
    const [dailyTotalsAll, setDailyTotalsAll] = useState([]);

    const fetchDailyTotalsAll = async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_SERVER_URL}/api/dailyTotals/all`
            );
            const updatedData = response.data.map((dailyTotal) => ({
                ...dailyTotal,
                teamMember: dailyTotal.teamMember,
                position: dailyTotal.position,
            }));
            console.log(response.data);
            setDailyTotalsAll(updatedData);
        } catch (error) {
            setError(`Error fetching daily totals: ${error.message}`);
            alert(`Error fetching daily totals: ${error.message}`);
        }
    };

    useEffect(() => {
        fetchDailyTotalsAll();
    }, []);

    const submitDailyTotals = async (dailyTotal) => {
        try {
            // Validate if teamMember is selected
            if (!dailyTotals.teamMember) {
                alert("Please select a team member");
                return;
            }

            const isDuplicateDailyTotal = dailyTotalsAll.find(
                (total) =>
                    total.teamMember === dailyTotals.teamMember &&
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

            // await axios.post(
            //     `${process.env.REACT_APP_SERVER_URL}/api/dailyTotals/${selectedTeamMember._id}`,
            //     dailyTotals
            // );

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

    return (
        <div>
            <DailyTotalsForm
                dailyTotals={dailyTotals}
                setDailyTotals={setDailyTotals}
                submitDailyTotals={submitDailyTotals}
                team={team}
                setTeam={setTeam}
            />

            <h2>Daily Totals</h2>
            <div className="sales-table">
                <div className="header-row">
                    <div className="date-column">Date</div>
                    <div className="foodSales-column">Food Sales</div>
                    <div className="barSales-column">Bar Sales</div>
                    <div className="nonCashTips-column">Non-Cash Tips</div>
                    <div className="cashTips-column">Cash Tips</div>
                    <div className="action-column">Action</div>
                </div>

                {dailyTotalsAll
                    // .sort(
                    // 	(a, b) =>
                    // 		a.teamMember.localeCompare(b.teamMember) ||
                    // 		new Date(a.date) - new Date(b.date)
                    // )

                    .sort((a, b) => {
                        const correspondingTeamMemberA = team.find(
                            (member) => member.name === a.teamMember
                        );
                        const correspondingTeamMemberB = team.find(
                            (member) => member.name === b.teamMember
                        );

                        if (
                            !correspondingTeamMemberA ||
                            !correspondingTeamMemberB
                        ) {
                            return 0;
                        }

                        const nameComparison =
                            correspondingTeamMemberA.name.localeCompare(
                                correspondingTeamMemberB.name
                            );
                        if (nameComparison !== 0) {
                            return nameComparison;
                        }

                        return correspondingTeamMemberA.position.localeCompare(
                            correspondingTeamMemberB.position
                        );
                    })

                    .map((dailyTotal, index, array) => {
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
                                        "Corresponding team member not found"
                                    );
                                    alert("Failed to delete daily total");
                                    return;
                                }
                                if (!dailyTotal || !dailyTotal._id) {
                                    console.error(`dailyTotal._id is undefined: , ${dailyTotal}, ${dailyTotal}`);
                                    return;
                                }
                                const response = await axios.delete(
                                    `${process.env.REACT_APP_SERVER_URL}/api/teamMembers/${correspondingTeamMember._id}/dailyTotals/${dailyTotal._id}`
                                );

                                fetchDailyTotalsAll();
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

                        return (
                            <React.Fragment key={dailyTotal._id}>
                                {isFirstItem && (
                                    <div className="teamMember-separator">
                                        <hr />
                                        <p>{`${dailyTotal.teamMember} - ${
                                            correspondingTeamMember
                                                ? correspondingTeamMember.position ||
                                                  "No Position"
                                                : "Unknown Team Member"
                                        }`}</p>
                                        <hr />
                                    </div>
                                )}

                                <div className="flex-table-row">
                                    <div className="date-column">
                                        {dailyTotal.date
                                            ? FormattedDate(dailyTotal.date)
                                            : "Invalid Date"}
                                    </div>

                                    <div className="foodSales-column">
                                        {dailyTotal.foodSales
                                            ? Number(
                                                  dailyTotal.foodSales
                                              ).toLocaleString("en-US", {
                                                  style: "currency",
                                                  currency: "USD",
                                              })
                                            : "N/A"}
                                    </div>
                                    <div className="barSales-column">
                                        {dailyTotal.barSales
                                            ? Number(
                                                  dailyTotal.barSales
                                              ).toLocaleString("en-US", {
                                                  style: "currency",
                                                  currency: "USD",
                                              })
                                            : "N/A"}
                                    </div>
                                    <div className="nonCashTips-column">
                                        {dailyTotal.nonCashTips
                                            ? Number(
                                                  dailyTotal.nonCashTips
                                              ).toLocaleString("en-US", {
                                                  style: "currency",
                                                  currency: "USD",
                                              })
                                            : "N/A"}
                                    </div>
                                    <div className="cashTips-column">
                                        {dailyTotal.cashTips
                                            ? Number(
                                                  dailyTotal.cashTips
                                              ).toLocaleString("en-US", {
                                                  style: "currency",
                                                  currency: "USD",
                                              })
                                            : "N/A"}
                                    </div>
                                    <div className="delete-button-column">
                                        <button onClick={deleteDailyTotal}>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </React.Fragment>
                        );
                    })}
            </div>
        </div>
    );
}

export default DailyTotals;
