import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DatabaseOperations() {
	const [databases, setDatabases] = useState([]);

	useEffect(() => {
		fetchDatabases();
	}, []);

	const fetchDatabases = async () => {
		try {
			const response = await axios.get(
				`${process.env.REACT_APP_SERVER_URL}/api/listDatabases`
			);
			setDatabases(response.data.databases);
		} catch (error) {
			console.error('Error fetching databases:', error);
			alert('Failed to fetch databases');
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
			// Send a DELETE request to the server to delete the database
			await axios.delete(
				`${process.env.REACT_APP_SERVER_URL}/api/deleteDatabase/${databaseName}`
			);
			// Remove the deleted database from the local state
			setDatabases((prevDatabases) =>
				prevDatabases.filter(
					(database) => database.name !== databaseName
				)
			);
		} catch (error) {
			console.error('Error deleting database:', error);
			alert('Failed to delete database');
		}
	};

	return (
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
	);
};

export default DatabaseOperations;