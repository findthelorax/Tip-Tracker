import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NotificationsIcon from '@mui/icons-material/Notifications';
import TeamMembersList from '../components/teamMembersList';
import TeamMemberForm from '../components/teamMemberForm';
import TeamMembersPage from './TeamMembersPage';
import DatabaseOperations from '../components/databaseOps';
import {
	WeeklyTotalsTable,
	WeeklyTipsTable,
	WeeklyBarSalesCard,
	WeeklyFoodSalesCard,
} from '../components/weeklyTotals';
import DailyTotalsTable from '../components/dailyTotalsTable';
import DailyTotalsForm from '../components/dailyTotalsForm';
import { TeamContext } from '../contexts/TeamContext';
import SettingsPage from './Settings';
import { useAuth } from '../contexts/AuthContext';
import { MainListItems, SecondaryListItems } from './SideNav';
// import { SalesCardStyling } from '../stylings/salesCardStyling';
import { calculateSalesDifferences } from '../hooks/weeklyTotalsLogic';

import moment from 'moment';

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
	shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
	zIndex: theme.zIndex.drawer + 1,
	transition: theme.transitions.create(['width', 'margin'], {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	...(open && {
		marginLeft: drawerWidth,
		width: `calc(100% - ${drawerWidth}px)`,
		transition: theme.transitions.create(['width', 'margin'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
	}),
}));

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
	const [salesDifferences, setSalesDifferences] = useState({});
	const { team } = React.useContext(TeamContext);
	const [selectedMenu, setSelectedMenu] = useState('Dashboard');
	const { currentUser } = useAuth();
	const [selectedDate, setSelectedDate] = useState(moment());
	const [open, setOpen] = React.useState(true);
	const toggleDrawer = () => {
		setOpen(!open);
	};
	useEffect(() => {
		const differences = calculateSalesDifferences(team);
		setSalesDifferences(differences);
	}, [team]);

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
									<Paper sx={{ p: 2, display: 'flex', flexDirection: 'column'}}>
										<TeamMemberForm />
									</Paper>
								</Grid>
								<Grid item xs={4} md={6} lg={6}>
									<Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
										<TeamMembersList />
									</Paper>
								</Grid>
								<Grid item xs={4} md={6} lg={6}>
									<Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
										<DailyTotalsForm refresh={refresh} />
									</Paper>
								</Grid>
								<Grid item xs={12}>
									<Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
										<DailyTotalsTable refresh={refresh} />
									</Paper>
								</Grid>
								<Grid item xs={12}>
									<Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
										<WeeklyTotalsTable
											team={team}
											refresh={refresh}
											selectedDate={selectedDate}
											setSelectedDate={setSelectedDate}
										/>
									</Paper>
								</Grid>
								<Grid item xs={6}>
									<WeeklyBarSalesCard
										sx={{ height: '100%' }}
										team={team}
										refresh={refresh}
										selectedDate={selectedDate}
										salesDifferences={salesDifferences}
									/>
								</Grid>
								<Grid item xs={6}>
									<WeeklyFoodSalesCard
										sx={{ height: '100%' }}
										team={team}
										refresh={refresh}
										selectedDate={selectedDate}
										salesDifferences={salesDifferences}
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
			<AppBar position="absolute" open={open}>
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
						<MenuIcon />
					</IconButton>
					<Typography component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
						Dashboard
					</Typography>
					<IconButton color="inherit">
						<Badge badgeContent={4} color="error">
							<NotificationsIcon />
						</Badge>
					</IconButton>
				</Toolbar>
			</AppBar>
			<Drawer variant="permanent" open={open}>
				<Toolbar
					sx={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'flex-end',
						px: [1],
					}}
				>
					<IconButton onClick={toggleDrawer}>
						<ChevronLeftIcon />
					</IconButton>
				</Toolbar>

				<Divider />
				<Box>
					<MainListItems setSelectedMenu={setSelectedMenu} />
				</Box>
				<Divider />
				<SecondaryListItems setSelectedMenu={setSelectedMenu} />
			</Drawer>
			<Box
				component="main"
				sx={{
					flexGrow: 1,
					height: '100vh',
					overflow: 'auto',
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
