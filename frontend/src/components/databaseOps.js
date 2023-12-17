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
	Grid,
	Skeleton,
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import Delete from '@mui/icons-material/Delete';

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
		<Grid container spacing={2}>
			<Grid item xs={12} md={6}>
				<Card
					sx={{
						minWidth: 275,
						backgroundColor: 'lightblue',
						border: '1px solid black',
						boxShadow: '5px 5px 0px 0px black',
						borderRadius: '15px',
					}}
				>
					{error && <Typography color="error">{error}</Typography>}
					<CardContent>
						<Typography variant="h5">Databases</Typography>
						<Button variant="contained" color="primary" onClick={handleListDatabases}>
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
												onClick={() => handleDeleteDatabase(database.name)}
											>
												<Delete />
											</IconButton>
										</ListItemSecondaryAction>
									</ListItem>
								))}
							</List>
						)}
					</CardContent>
				</Card>
			</Grid>
			<Grid item xs={12} md={6}>
				<Card
					sx={{
						minWidth: 275,
						backgroundColor: 'lightblue',
						border: '1px solid black',
						boxShadow: '2px 2px 0px 0px black',
						borderRadius: '15px',
					}}
				>
					<CardContent>
						<Typography variant="h5">Database Stats</Typography>
						<BarChart width={500} height={300} data={databases}>
							<XAxis dataKey="name" />
							<YAxis />
							<Tooltip />
							<CartesianGrid stroke="#f5f5f5" />
							<Bar dataKey="sizeOnDisk" fill="#ff7300" />
						</BarChart>
					</CardContent>
				</Card>
			</Grid>
			<Grid item xs={12}>
				<Card
					sx={{
						minWidth: 275,
						backgroundColor: 'lightblue',
						border: '1px solid black',
						boxShadow: '2px 2px 0px 0px black',
						borderRadius: '15px',
					}}
				>
					<CardContent>
						<Skeleton variant="rectangular" height={200} />
					</CardContent>
				</Card>
			</Grid>
		</Grid>
	);
}

export default DatabaseOperations;
