import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";

function App() {
    const [team, setTeam] = useState([]);
    const [name, setName] = useState("");
    const [position, setPosition] = useState("bartender");
    const [selectedWorkerId, setSelectedWorkerId] = useState("");

    // Daily Totals
    const [dailyTotals, setDailyTotals] = useState({
        worker: "",
        date: new Date().toISOString().slice(0, 10), // Default to today's date
        foodSales: "",
        barSales: "",
        nonCashTips: "",
        cashTips: "",
    });

    const [weeklySales, setWeeklySales] = useState({
        startDate: "",
        endDate: "",
        foodSales: "",
        barSales: "",
        nonCashTips: "",
        cashTips: "",
    });

    const [databases, setDatabases] = useState([]);

    useEffect(() => {
        // Fetch team members and daily totals when the component mounts
        fetchTeam();
        fetchDatabases();
        displayTeam();
    }, []);

    const fetchDatabases = async () => {
        try {
            const response = await axios.get(
                "http://localhost:3001/api/listDatabases"
            );
            setDatabases(response.data.databases);
        } catch (error) {
            console.error("Error fetching databases:", error);
            alert("Failed to fetch databases");
        }
    };

    const deleteDatabase = async (databaseName) => {
        try {
            // Send a DELETE request to the server to delete the database
            await axios.delete(
                `http://localhost:3001/api/deleteDatabase/${databaseName}`
            );
            // Remove the deleted database from the local state
            setDatabases((prevDatabases) =>
                prevDatabases.filter(
                    (database) => database.name !== databaseName
                )
            );
        } catch (error) {
            console.error("Error deleting database:", error);
            alert("Failed to delete database");
        }
    };

    const addTeamMember = async () => {
        if (name && position) {
            try {
                const response = await axios.post(
                    "http://localhost:3001/api/team",
                    { name, position }
                );
                setTeam([...team, response.data]);
                clearInputs();
            } catch (error) {
                console.error("Error adding team member:", error);
                alert("Failed to add team member");
            }
        } else {
            alert("Please enter both name and position");
        }
    };

    const displayTeam = async () => {
        try {
            const response = await axios.get("http://localhost:3001/api/team");
            setTeam(response.data);
        } catch (error) {
            console.error("Error fetching team members:", error);
            alert("Failed to fetch team members");
        }
    };

    const clearInputs = () => {
        setName("");
        setPosition("bartender");
    };

    const deleteTeamMember = async (id) => {
        try {
            // Send a DELETE request to the server to delete the team member by ID
            await axios.delete(`http://localhost:3001/api/team/${id}`);
            // Remove the deleted team member from the local state
            setTeam((prevTeam) =>
                prevTeam.filter((member) => member._id !== id)
            );
        } catch (error) {
            console.error("Error deleting team member:", error);
            alert("Failed to delete team member");
        }
    };

    const fetchTeam = async () => {
        try {
            const response = await axios.get("http://localhost:3001/api/team");
            setTeam(response.data);
        } catch (error) {
            console.error("Error fetching team members:", error);
            alert("Failed to fetch team members");
        }
    };

    const handleDailyTotalsChange = (field, value) => {
        console.log("Field:", field, "Value:", value);
        setDailyTotals((prevDailyTotals) => ({
            ...prevDailyTotals,
            [field]: value,
        }));
    };

    const submitDailyTotals = async () => {
        try {
            // Validate if worker is selected
            if (!dailyTotals.worker) {
                alert("Please select a worker");
                return;
            }

            // Find the selected team member by name to get their ID
            const selectedTeamMember = team.find(
                (member) => member.name === dailyTotals.worker
            );

            // Prepare dailyTotals data with teamMember field
            const dailyTotalsData = {
                date: dailyTotals.date,
                foodSales: dailyTotals.foodSales,
                barSales: dailyTotals.barSales,
                nonCashTips: dailyTotals.nonCashTips,
                cashTips: dailyTotals.cashTips,
            };

            // Send the data to the server
            await axios.post(
                `http://localhost:3001/api/team/${selectedTeamMember._id}/dailyTotals`,
                {
                    dailyTotals: [dailyTotalsData], // Wrap in an array
                }
            );

            // Clear the form fields
            setDailyTotals({
                worker: "",
                date: new Date().toISOString().slice(0, 10),
                foodSales: "",
                barSales: "",
                nonCashTips: "",
                cashTips: "",
            });

            // Refresh the daily totals list
            // fetchDailyTotals();
        } catch (error) {
            console.error("Error submitting daily totals:", error);
            alert("Failed to submit daily totals");
        }
    };

    return (
        <div className="App">
            <h1>Restaurant Team Management</h1>

            <div className="input-card">
                <label htmlFor="name">Name:</label>
                <input
                    type="text"
                    id="name"
                    placeholder="Enter name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <label htmlFor="position">Position:</label>
                <select
                    id="position"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                >
                    <option value="bartender">Bartender</option>
                    <option value="runner">Runner</option>
                    <option value="server">Server</option>
                    <option value="host">Host</option>
                </select>

                <button onClick={addTeamMember}>Add to Team</button>
            </div>

            <div className="databases-card">
                <h2>Databases</h2>
                <button onClick={fetchDatabases}>List Databases</button>
                {databases.length > 0 && (
                    <div className="databases-table">
                        <div className="database-header">
                            <div>Database Name</div>
                            <div>Action</div>
                        </div>
                        {databases.map((database) => (
                            <div key={database.name} className="database-row">
                                <div>{database.name}</div>
                                <div>
                                    <button
                                        onClick={() =>
                                            deleteDatabase(database.name)
                                        }
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="team-card">
                <h2>Team Members</h2>
                {team.map((member) => (
                    <div key={member._id} className="member-card">
                        <strong>
                            {member.name.charAt(0).toUpperCase() +
                                member.name.slice(1)}
                        </strong>{" "}
                        - {member.position}
                        <button onClick={() => deleteTeamMember(member._id)}>
                            Delete
                        </button>
                    </div>
                ))}
            </div>

            <div>
                <h2>Daily Totals</h2>
                <div>
                    <label htmlFor="worker">Worker:</label>
                    <select
                        id="worker"
                        value={dailyTotals.worker}
                        onChange={(e) =>
                            handleDailyTotalsChange("worker", e.target.value)
                        }
                    >
                        <option value="">Select Worker</option>
                        {team.map((member) => (
                            <option key={member._id} value={member.name}>
                                {`${member.name} - ${member.position}`}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="date">Date:</label>
                    <input
                        type="date"
                        id="date"
                        value={dailyTotals.date}
                        onChange={(e) =>
                            handleDailyTotalsChange("date", e.target.value)
                        }
                    />
                </div>

                <div>
                    <label htmlFor="foodSales">Food Sales:</label>
                    <input
                        type="number"
                        id="foodSales"
                        value={dailyTotals.foodSales}
                        onChange={(e) =>
                            handleDailyTotalsChange(
                                "foodSales",
                                parseFloat(e.target.value)
                            )
                        }
                    />
                </div>
                <div>
                    <label htmlFor="barSales">Bar Sales:</label>
                    <input
                        type="number"
                        id="barSales"
                        value={dailyTotals.barSales}
                        onChange={(e) =>
                            handleDailyTotalsChange(
                                "barSales",
                                parseFloat(e.target.value)
                            )
                        }
                    />
                </div>
                <div>
                    <label htmlFor="nonCashTips">Non-Cash Tips:</label>
                    <input
                        type="number"
                        id="nonCashTips"
                        value={dailyTotals.nonCashTips}
                        onChange={(e) =>
                            handleDailyTotalsChange(
                                "nonCashTips",
                                parseFloat(e.target.value)
                            )
                        }
                    />
                </div>
                <div>
                    <label htmlFor="cashTips">Cash Tips:</label>
                    <input
                        type="number"
                        id="cashTips"
                        value={dailyTotals.cashTips}
                        onChange={(e) =>
                            handleDailyTotalsChange(
                                "cashTips",
                                parseFloat(e.target.value)
                            )
                        }
                    />
                </div>
                <button onClick={submitDailyTotals}>Submit Daily Totals</button>
            </div>

        </div>
    );
}

export default App;
