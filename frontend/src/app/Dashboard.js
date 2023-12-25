import React, { useState } from 'react';
import MuiAppBar from '@mui/material/AppBar';
import { Grid, Container, Badge, IconButton, Divider, Typography, Toolbar, Box, CssBaseline, Drawer } from '@mui/material';
// import Paper from '@mui/material/Paper';
import { Menu, ChevronLeft, Notifications } from '@mui/icons-material';
import TeamMembersList from '../components/teamMembers/teamMembersList';
import TeamMemberForm from '../components/teamMembers/teamMemberForm';
import TeamMembersPage from './TeamMembersPage';
import DatabaseOperations from '../components/database/databaseOps';
import { WeeklyTotalsTable } from '../components/weeklyTotals/weeklyTotalsTable';
import { WeeklyTipsTable } from '../components/weeklyTotals/weeklyTipsTable';
import { WeeklyFoodSalesCard, WeeklyBarSalesCard } from '../components/weeklyTotals/weeklyTotalsCards';
import { DailyBarSalesCard, DailyFoodSalesCard } from '../components/dailyTotals/dailyTotalsCards';
import DailyTotalsTable from '../components/dailyTotals/dailyTotalsTable';
import DailyTotalsForm from '../components/dailyTotals/dailyTotalsForm';
import { TeamContext } from '../contexts/TeamContext';
import SettingsPage from '../pages/Settings';
import { useAuth } from '../contexts/AuthContext';
import { MainListItems, SecondaryListItems, SettingsListItems } from './SideNav';
// import { SalesCardStyling } from '../stylings/salesCardStyling';
// import { calculateWeeklySalesDifferences, calculateDailySalesDifferences } from '../hooks/salesTotalsLogic';
import AppIcon from '../assets/restaurant.png'; // for PNG
import { Avatar, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';
import moment from 'moment';
import MiniDrawer from '../pages/dashboard/drawer'; // adjust the path as necessary

function Dashboard({ refresh }) {
	const [weeklyDifferences, setWeeklySalesDifferences] = useState({});
	const [dailyDifferences, setDailySalesDifferences] = useState({});
	const { team } = React.useContext(TeamContext);
	const [selectedMenu, setSelectedMenu] = useState('Dashboard');
	const { currentUser } = useAuth();
	const [selectedDate, setSelectedDate] = useState(moment());
	const [open, setOpen] = React.useState(true);
	const toggleDrawer = () => {
		setOpen(!open);
	};

	const renderSelectedComponent = () => {
		switch (selectedMenu) {
			case 'Dashboard':
				return (
					<Box
						component="main"
						sx={{
							flexGrow: 1,
							py: 8,
						}}
					>
						<Container maxWidth="xl">
							<Grid container spacing={3}>
								<Grid item xs={4} md={6} lg={6}>
									<TeamMemberForm />
								</Grid>
								<Grid item xs={4} md={6} lg={6}>
									<TeamMembersList />
								</Grid>
								<Grid item xs={4} md={6} lg={6}>
									<DailyTotalsForm refresh={refresh} />
								</Grid>
								<Grid item xs={12}>
									<DailyTotalsTable refresh={refresh} />
								</Grid>
								<Grid item xs={6}>
									<WeeklyFoodSalesCard
										team={team}
										refresh={refresh}
										selectedDate={selectedDate}
										weeklyDifferences={weeklyDifferences}
									/>
								</Grid>
								<Grid item xs={6}>
									<WeeklyBarSalesCard
										team={team}
										refresh={refresh}
										selectedDate={selectedDate}
										weeklyDifferences={weeklyDifferences}
									/>
								</Grid>
								<Grid item xs={6}>
									<DailyFoodSalesCard
										team={team}
										refresh={refresh}
										selectedDate={selectedDate}
										dailyDifferences={dailyDifferences}
									/>
								</Grid>
								<Grid item xs={6}>
									<DailyBarSalesCard
										refresh={refresh}
										selectedDate={selectedDate}
										dailyDifferences={dailyDifferences}
									/>
								</Grid>
								<Grid item xs={12}>
									<WeeklyTotalsTable
										team={team}
										refresh={refresh}
										selectedDate={selectedDate}
										setSelectedDate={setSelectedDate}
									/>
								</Grid>
								<Grid item xs={12}>
									<WeeklyTipsTable
										team={team}
										refresh={refresh}
										selectedDate={selectedDate}
										setSelectedDate={setSelectedDate}
									/>
								</Grid>
							</Grid>
						</Container>
					</Box>
				);
			case 'Team Members':
				return <TeamMembersPage currentUser={currentUser} />;
			case 'Database':
				return <DatabaseOperations currentUser={currentUser} />;
			case 'Settings':
				return <SettingsPage currentUser={currentUser} />;
			default:
				return null;
		}
	};

	return (
		<Box sx={{ display: 'flex' }}>
			<CssBaseline />
			<MuiAppBar position="absolute" open={open} sx={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
				<Toolbar
					sx={{
						pr: '24px', // keep right padding when drawer closed
						minHeight: '48px', // reduce height
					}}
				>
					<IconButton
						edge="start"
						color="inherit"
						aria-label="open drawer"
						onClick={toggleDrawer}
						sx={{
							...(open && {
								display: 'none',
							}),
						}}
					>
						<Menu />
					</IconButton>
					<Typography component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
						{/* Welcome, {currentUser.displayName} */} Welcome
					</Typography>
					<IconButton color="inherit">
						<Badge badgeContent={4} color="error">
							<Notifications />
						</Badge>
					</IconButton>
					<MuiLink component={Link} to="/profile" sx={{ marginLeft: 'auto' }}>
						<Avatar alt="User Avatar" src="/static/images/avatar/1.jpg" />
					</MuiLink>
				</Toolbar>
			</MuiAppBar>
			<div>
            <MiniDrawer />
        </div>
			{/* <Drawer variant="permanent" open={open}>
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						padding: '30px',
					}}
				>
					<img src={AppIcon} alt="App Icon" style={{ width: '50px', height: '50px' }} />{' '}
				</Box> */}
				{/* <Toolbar
					sx={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'flex-end',
						px: [1],
					}}
				>
					<IconButton onClick={toggleDrawer}>
						<ChevronLeft />
					</IconButton>
				</Toolbar> */}

				{/* <Divider />
				<Box>
					<MainListItems setSelectedMenu={setSelectedMenu} />
				</Box>
				<Divider />
				<SecondaryListItems setSelectedMenu={setSelectedMenu} />
				<Divider />
				<Box>
					<SettingsListItems setSelectedMenu={setSelectedMenu} />
				</Box>
			</Drawer> */}
			<Box
				component="main"
				sx={{
					flexGrow: 1,
					height: '100vh',
					overflow: 'auto',
					background: '#f5f5f5',
				}}
			>
				<Toolbar />
				<Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
					{renderSelectedComponent()}
				</Container>
			</Box>
		</Box>
	);
}

export default Dashboard;
