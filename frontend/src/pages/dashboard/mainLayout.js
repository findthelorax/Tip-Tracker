import React, { useState } from 'react';
import { Box, Toolbar } from '@mui/material';
import MiniDrawer from './drawer/drawer';
import CustAppBar from './appBar';
import CustomAppBar from './appBar/customAppBar';
import PrimarySearchAppBar from './appBar/searchAppBar';
import Dashboard from './dashboard';
import TeamMembersPage from '../teamMembers/TeamMembersPage';
import SettingsPage from '../Settings';
import DatabasePage from '../database/databasePage';
import moment from 'moment';
import { Outlet } from 'react-router-dom';
// import { useAuth } from '../../contexts/AuthContext';

function MainLayout() {
	const [selectedDate, setSelectedDate] = useState(moment());
	// const { currentUser } = useAuth();

	const [isDrawerOpen, setIsDrawerOpen] = useState(true);
	const handleDrawerToggle = () => {
		setIsDrawerOpen(!isDrawerOpen);
	};

	const [selectedMenu, setSelectedMenu] = useState('Dashboard');

	const renderSelectedComponent = () => {
		switch (selectedMenu) {
			case 'Dashboard':
				return <Dashboard />;
			case 'Team Members':
				return <TeamMembersPage />;
			case 'Database':
				return <DatabasePage />;
			case 'Settings':
				return <SettingsPage />;
			default:
				return null;
		}
	};

	const drawerWidth = 240;

	return (
		<Box sx={{ display: 'flex', width: '100%' }}>
			<MiniDrawer open={isDrawerOpen} handleDrawerClose={handleDrawerToggle} setSelectedMenu={setSelectedMenu} />
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					width: `calc(100% - ${isDrawerOpen ? drawerWidth : 0}px)`,
					flexGrow: 1,
				}}
			>
				<CustomAppBar open={isDrawerOpen} handleDrawerToggle={handleDrawerToggle} />
				<Box component="main" sx={{ p: { xs: 2, sm: 3 } }}>
					<Toolbar />
					{renderSelectedComponent()}
					<Outlet />
				</Box>
			</Box>
		</Box>
	);
}

export default MainLayout;
