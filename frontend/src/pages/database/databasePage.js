import React, { useState, useEffect, useContext, useCallback } from 'react';
import { ErrorContext } from '../../contexts/ErrorContext';
import { TeamContext } from '../../contexts/TeamContext';
import { DailyTotalsContext } from '../../contexts/DailyTotalsContext';
import { getDatabases, deleteDatabase } from '../../utils/api';
import DatabaseOperationsRender from '../../components/database/databaseRender';


function DatabasePage() {
	const [databases, setDatabases] = useState([]);
	const { error, setError } = useContext(ErrorContext);
	const { setRefreshTeamMembers } = useContext(TeamContext);
	const { setRefreshDailyTotals } = useContext(DailyTotalsContext);
	const [isShown, setIsShown] = useState(false);

	const fetchDatabases = useCallback(async () => {
		try {
			const response = await getDatabases();
			setDatabases(response);
		} catch (error) {
			setError(error.message);
		}
	}, [setError]);

	useEffect(() => {
		fetchDatabases();
	}, [fetchDatabases]);

	const handleDeleteDatabase = async (databaseName) => {
		const confirmation = window.confirm(`ARE YOU SURE YOU WANT TO DELETE:\n\n${databaseName.toUpperCase()}?`);
		if (!confirmation) {
			return;
		}

		try {
			await deleteDatabase(databaseName);
			setDatabases((prevDatabases) => prevDatabases.filter((database) => database.name !== databaseName));
			setRefreshDailyTotals((prev) => !prev);
			setRefreshTeamMembers((prev) => !prev);
		} catch (error) {
			setError(error.message);
		}
	};

	const handleListDatabases = () => {
		setIsShown(!isShown);
		if (!isShown) {
			fetchDatabases();
		}
	};

	return (
		<DatabaseOperationsRender
			error={error}
			handleListDatabases={handleListDatabases}
			isShown={isShown}
			databases={databases}
			handleDeleteDatabase={handleDeleteDatabase}
		/>
	);
}

export default DatabasePage;