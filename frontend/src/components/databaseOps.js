import React, { useState, useEffect, useContext, useCallback } from 'react';
import { ErrorContext } from './contexts/ErrorContext';
import { TeamContext } from './contexts/TeamContext';
import { DailyTotalsContext } from './contexts/DailyTotalsContext';
import { getDatabases, deleteDatabase } from './utils/api';
import {
	Button,
	Card,
	CardContent,
	Typography,
	List,
	ListItem,
	ListItemText,
	ListItemSecondaryAction,
	IconButton,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

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
		<Card className="databases-card">
			{error && <Typography color="error">{error}</Typography>}
			<CardContent>
				<Typography variant="h5">Databases</Typography>
				<Button
					variant="contained"
					color="primary"
					onClick={handleListDatabases}
				>
					{isShown ? 'Hide Databases' : 'List Databases'}
				</Button>
				{isShown && databases.length > 0 && (
					<List>
						{databases.map((database) => (
							<ListItem key={database.name}>
								<ListItemText primary={database.name} />
								<ListItemSecondaryAction>
									<IconButton
										edge="end"
										aria-label="delete"
										onClick={() =>
											handleDeleteDatabase(database.name)
										}
									>
										<DeleteIcon />
									</IconButton>
								</ListItemSecondaryAction>
							</ListItem>
						))}
					</List>
				)}
			</CardContent>
		</Card>
	);
}

export default DatabaseOperations;
