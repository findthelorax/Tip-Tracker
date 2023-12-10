import React, { useState, useEffect } from "react";
import axios from "axios";

function DatabaseOperations() {
    const [databases, setDatabases] = useState([]);
    const [error, setError] = useState(null);
	const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        fetchDatabases();
    }, [refresh]);

    const fetchDatabases = async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_SERVER_URL}/api/listDatabases`
            );
            setDatabases(response.data.databases);
            setError(null); // Clear the error when the request is successful
        } catch (error) {
            console.error("Error fetching databases:", error);
            setError("Failed to fetch databases"); // Set the error message
        }
    };

    const deleteDatabase = async (databaseName) => {
        const confirmation = window.confirm(
            `ARE YOU SURE YOU WANT TO DELETE:\n\n${databaseName.toUpperCase()}?`
        );
        if (!confirmation) {
            return;
        }

		try {
			await axios
				.delete(
					`${process.env.REACT_APP_SERVER_URL}/api/deleteDatabase/${databaseName}`
				)
				.then((response) => {
					setDatabases((prevDatabases) =>
						prevDatabases.filter(
							(database) => database.name !== databaseName
						)
					);
					setError(null);
					setRefresh((prev) => !prev); // Toggle refresh state
				});
		} catch (error) {
			console.error("Error deleting database:", error);
			setError("Failed to delete database");
		}
	};

    return (
        <div className="databases-card">
            {error && <p>{error}</p>}
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
                                    Delete Database
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default DatabaseOperations;
