import React, { useState, useEffect, useCallback, useContext } from "react";
import axios from "axios";
import { FormattedDate } from "./dateUtils";
import DailyTotalsForm from "./dailyTotalsForm";
// import submitDailyTotals from "./sumbitDailyTotals";
import { TeamContext } from "./teamContext";

// const timeZone = "America/New_York";

function DailyTotals({ setError, refresh, setRefresh }) {
    const { team, setTeam } = useContext(TeamContext);
    const [dailyTotals, setDailyTotals] = useState({
        teamMember: "",
        position: "",
        date: new Date().toISOString().split("T")[0],
        foodSales: "",
        barSales: "",
        nonCashTips: "",
        cashTips: "",
        barTipOuts: "",
        runnerTipOuts: "",
        hostTipOuts: "",
        totalTipOuts: "",
        tipsReceived: "",
        totalPayrollTips: "",
    });
    const [dailyTotalsAll, setDailyTotalsAll] = useState([]);

    // const fetchDailyTotalsAll = useCallback(async () => {
    //     try {
    //         const response = await axios.get(
    //             `${process.env.REACT_APP_SERVER_URL}/api/dailyTotals/all`
    //         );
    //         const updatedData = response.data.map((dailyTotal) => ({
    //             ...dailyTotal,
    //             teamMember: dailyTotal.teamMember,
    //             position: dailyTotal.position,
    //         }));
    //         console.log("RESPONSE:", response.data);
    //         console.log("UPDATED:", updatedData);
    //         setDailyTotalsAll(updatedData);
    //     } catch (error) {
    //         setError(`Error fetching daily totals: ${error.message}`);
    //         alert(`Error fetching daily totals: ${error.message}`);
    //     }
    // }, [setDailyTotalsAll, setError]);


    // function DailyTotals({ setError, refresh, setRefresh }) {
    //     // ... (existing code)

    //     const calculateAllDailyTotals = () => {
    //         // Map and sort dailyTotals for all team members
    //         const allDailyTotals = dailyTotalsAll
    //             .sort((a, b) => {
    //                 const correspondingTeamMemberA = team.find(
    //                     (member) => member.name === a.teamMember
    //                 );
    //                 const correspondingTeamMemberB = team.find(
    //                     (member) => member.name === b.teamMember
    //                 );

    //                 if (
    //                     !correspondingTeamMemberA ||
    //                     !correspondingTeamMemberB
    //                 ) {
    //                     return 0;
    //                 }

    //                 const nameComparison =
    //                     correspondingTeamMemberA.name.localeCompare(
    //                         correspondingTeamMemberB.name
    //                     );
    //                 if (nameComparison !== 0) {
    //                     return nameComparison;
    //                 }

    //                 return correspondingTeamMemberA.position.localeCompare(
    //                     correspondingTeamMemberB.position
    //                 );
    //             })
    //             .map((dailyTotal, index, array) => {
    //                 // ... (existing code for rendering each daily total)
    //             });

    //         return allDailyTotals;
    //     };

    //     return (
    //         <div>
    //             {/* ... (existing code) */}

    //             <h2>Daily Totals</h2>
    //             <div className="sales-table">
    //                 <div className="header-row">
    //                     {/* ... (existing header row) */}
    //                 </div>

    //                 {/* Call the calculateAllDailyTotals function */}
    //                 {calculateAllDailyTotals()}
    //             </div>
    //         </div>
    //     );
    // }

    // useEffect(() => {
    //     fetchDailyTotalsAll();
    // }, [fetchDailyTotalsAll, refresh]);

    const submitDailyTotals = async () => {
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

            // const isDuplicateDateTotal = dailyTotalsAll.find(
            //     (total) => new Date(total.date).toDateString() === new Date(dailyTotals.date).toDateString()
            // );
            
            // if (isDuplicateDateTotal) {
            //     alert(
            //         `${isDuplicateDateTotal.date} Date already exist.`
            //     );
            //     return;
            // }

            // Find the selected team member by name and position to get their ID
            const selectedTeamMember = team.find(
                (member) => member.name === dailyTotals.teamMember
            );

            console.log(
                `SELECTED TEAM MEMBER: ${selectedTeamMember.name} - ${selectedTeamMember.position}`
            );

            if (!selectedTeamMember) {
                alert("Team member not found");
                return;
            }

            // Prepare daily total object
            const newDailyTotals = {
                teamMember: selectedTeamMember.name,
                position: selectedTeamMember.position,
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
                dailyTotals: newDailyTotals,
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
                `${process.env.REACT_APP_SERVER_URL}/api/teamMembers/${selectedTeamMember._id}/dailyTotals`,
                newDailyTotals
            );

            // await axios.post(
            //     `${process.env.REACT_APP_SERVER_URL}/api/dailyTotals/${updatedTeamMember._id}`,
            //     dailyTotals
            // );

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
            // fetchDailyTotalsAll();
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
                refresh={refresh}
            />

            {/* Change to TABLE

<h2>Daily Totals</h2>
<table className="sales-table">
    <thead>
        <tr className="header-row">
            <th><div className="date-column">Date</div></th>
            <th><div className="foodSales-column">Food Sales</div></th>
            <th><div className="barSales-column">Bar Sales</div></th>
            <th><div className="nonCashTips-column">Non-Cash Tips</div></th>
            <th><div className="cashTips-column">Cash Tips</div></th>
            <th><div className="barTipOuts-column">Bar Tip Outs</div></th>
            <th><div className="runnerTipOuts-column">Runner Tip Outs</div></th>
            <th><div className="hostTipOuts-column">Host Tip Outs</div></th>
            <th><div className="totalTipOuts-column">Total Tip Outs</div></th>
            <th><div className="tipsReceived-column">Tips Received</div></th>
            <th><div className="totalPayrollTips-column">Total Payroll Tips</div></th>
            <th><div className="action-column">Action</div></th>
        </tr>
    </thead>
</table>
*/}
            <h2>Daily Totals</h2>
            <div className="sales-table">
                <div className="header-row">
                    <div className="date-column">Date</div>
                    <div className="foodSales-column">Food Sales</div>
                    <div className="barSales-column">Bar Sales</div>
                    <div className="nonCashTips-column">Non-Cash Tips</div>
                    <div className="cashTips-column">Cash Tips</div>
                    <div className="barTipOuts-column">Bar Tip Outs</div>
                    <div className="runnerTipOuts-column">Runner Tip Outs</div>
                    <div className="hostTipOuts-column">Host Tip Outs</div>
                    <div className="totalTipOuts-column">Total Tip Outs</div>
                    <div className="tipsReceived-column">Tips Received</div>
                    <div className="totalPayrollTips-column">
                        Total Payroll Tips
                    </div>
                    <div className="action-column">Action</div>
                </div>

                {dailyTotalsAll
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
                                    console.error(
                                        `dailyTotal._id is undefined: , ${dailyTotal}, ${dailyTotal}`
                                    );
                                    return;
                                }
                                const response = await axios.delete(
                                    `${process.env.REACT_APP_SERVER_URL}/api/teamMembers/${correspondingTeamMember._id}/dailyTotals/${dailyTotal._id}`
                                );

                                // fetchDailyTotalsAll();
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
                                    <div className="barTipOuts-column">
                                        {dailyTotal.barTipOuts
                                            ? Number(
                                                  dailyTotal.barTipOuts
                                              ).toLocaleString("en-US", {
                                                  style: "currency",
                                                  currency: "USD",
                                              })
                                            : "N/A"}
                                    </div>
                                    <div className="runnerTipOuts-column">
                                        {dailyTotal.runnerTipOuts
                                            ? Number(
                                                  dailyTotal.runnerTipOuts
                                              ).toLocaleString("en-US", {
                                                  style: "currency",
                                                  currency: "USD",
                                              })
                                            : "N/A"}
                                    </div>
                                    <div className="hostTipOuts-column">
                                        {dailyTotal.hostTipOuts
                                            ? Number(
                                                  dailyTotal.hostTipOuts
                                              ).toLocaleString("en-US", {
                                                  style: "currency",
                                                  currency: "USD",
                                              })
                                            : "N/A"}
                                    </div>
                                    <div className="totalTipOuts-column">
                                        {dailyTotal.totalTipOuts
                                            ? Number(
                                                  dailyTotal.totalTipOuts
                                              ).toLocaleString("en-US", {
                                                  style: "currency",
                                                  currency: "USD",
                                              })
                                            : "N/A"}
                                    </div>
                                    <div className="tipsReceived-column">
                                        {dailyTotal.tipsReceived
                                            ? Number(
                                                  dailyTotal.tipsReceived
                                              ).toLocaleString("en-US", {
                                                  style: "currency",
                                                  currency: "USD",
                                              })
                                            : "N/A"}
                                    </div>
                                    <div className="totalPayrollTips-column">
                                        {dailyTotal.totalPayrollTips
                                            ? Number(
                                                  dailyTotal.totalPayrollTips
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
