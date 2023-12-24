import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import { Grid, Container, Badge, IconButton, Divider, Typography, Toolbar, Box, CssBaseline } from '@mui/material';
// import Paper from '@mui/material/Paper';
import { Menu, ChevronLeft, Notifications } from '@mui/icons-material';
import TeamMembersList from '../components/teamMembersList';
import TeamMemberForm from '../components/teamMemberForm';
import TeamMembersPage from './TeamMembersPage';
import DatabaseOperations from '../components/databaseOps';
import {
	WeeklyTotalsTable,
	WeeklyTipsTable,
} from '../components/weeklyTotalsTables';
import {
	WeeklyFoodSalesCard,
	WeeklyBarSalesCard,
} from '../components/weeklyTotalsCards';
import { DailyBarSalesCard, DailyFoodSalesCard } from '../components/dailyTotalsCards';
import DailyTotalsTable from '../components/dailyTotalsTable';
import DailyTotalsForm from '../components/dailyTotalsForm';
import { TeamContext } from '../contexts/TeamContext';
import SettingsPage from './Settings';
import { useAuth } from '../contexts/AuthContext';
import { MainListItems, SecondaryListItems } from './SideNav';
// import { SalesCardStyling } from '../stylings/salesCardStyling';
// import { calculateWeeklySalesDifferences, calculateDailySalesDifferences } from '../hooks/salesTotalsLogic';

import moment from 'moment';

const drawerWidth = 240;

// const AppBar = styled(MuiAppBar, {
// 	shouldForwardProp: (prop) => prop !== 'open',
// })(({ theme, open }) => ({
// 	zIndex: theme.zIndex.drawer + 1,
// 	transition: theme.transitions.create(['width', 'margin'], {
// 		easing: theme.transitions.easing.sharp,
// 		duration: theme.transitions.duration.leavingScreen,
// 	}),
// 	...(open && {
// 		marginLeft: drawerWidth,
// 		width: `calc(100% - ${drawerWidth}px)`,
// 		transition: theme.transitions.create(['width', 'margin'], {
// 			easing: theme.transitions.easing.sharp,
// 			duration: theme.transitions.duration.enteringScreen,
// 		}),
// 	}),
// }));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
	'& .MuiDrawer-paper': {
		position: 'relative',
		whiteSpace: 'nowrap',
		width: drawerWidth,
		transition: theme.transitions.create('width', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
		boxSizing: 'border-box',
		backgroundColor: '#333',
		...(!open && {
			overflowX: 'hidden',
			transition: theme.transitions.create('width', {
				easing: theme.transitions.easing.sharp,
				duration: theme.transitions.duration.leavingScreen,
			}),
			width: theme.spacing(7),
			[theme.breakpoints.up('sm')]: {
				width: theme.spacing(9),
			},
		}),
	},
}));

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
			<MuiAppBar position="absolute" open={open}>
				<Toolbar
					sx={{
						pr: '24px', // keep right padding when drawer closed
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
						Dashboard
					</Typography>
					<IconButton color="inherit">
						<Badge badgeContent={4} color="error">
							<Notifications />
						</Badge>
					</IconButton>
				</Toolbar>
			</MuiAppBar>
			<MuiDrawer variant="permanent" open={open}>
				<Toolbar
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
				</Toolbar>

				<Divider />
				<Box>
					<MainListItems setSelectedMenu={setSelectedMenu} />
				</Box>
				<Divider />
				<SecondaryListItems setSelectedMenu={setSelectedMenu} />
			</MuiDrawer>
			<Box
				component="main"
				sx={{
					flexGrow: 1,
					height: '100vh',
					overflow: 'auto',
					background: '#00008B',
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
