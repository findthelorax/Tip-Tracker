import React, { useState, useEffect, useContext, useCallback } from 'react';
import { ErrorContext } from './contexts/ErrorContext';
import { TeamContext } from './contexts/TeamContext';
import { DailyTotalsContext } from './contexts/DailyTotalsContext';
import { getDatabases, deleteDatabase } from './utils/api';
import { Button, Paper, Text, GridCol, List, ListItem, ActionIcon } from '@mantine/core';
import { FiTrash2 } from 'react-icons/fi';

function DatabaseOperations() {
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
		const confirmation = window.confirm(
			`ARE YOU SURE YOU WANT TO DELETE:\n\n${databaseName.toUpperCase()}?`
		);
		if (!confirmation) {
			return;
		}

		try {
			await deleteDatabase(databaseName);
			setDatabases((prevDatabases) =>
				prevDatabases.filter(
					(database) => database.name !== databaseName
				)
			);
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
		<Paper padding="md" style={{ marginBottom: '1rem' }}>
			{error && <Text color="red">{error}</Text>}
			<GridCol>
				<Text size="xl" align="center">Databases</Text>
				<Button color="blue" onClick={handleListDatabases}>
					{isShown ? 'Hide Databases' : 'List Databases'}
				</Button>
				{isShown && databases.length > 0 && (
					<List>
						{databases.map((database) => (
							<ListItem key={database.name}>
								<Text>{database.name}</Text>
								<ActionIcon
									variant="transparent"
									color="red"
									onClick={() =>
										handleDeleteDatabase(database.name)
									}
								>
                                    <FiTrash2 />
								</ActionIcon>
							</ListItem>
						))}
					</List>
				)}
			</GridCol>
		</Paper>
	);
}

export default DatabaseOperations;