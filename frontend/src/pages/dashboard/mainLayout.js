import React, { useState } from 'react';
import { Box, Toolbar } from '@mui/material';
import MiniDrawer from './drawer/drawer';
import CustAppBar from './appBar';
import CustomAppBar from './appBar/customAppBar';
import Dashboard from './dashboard';
import TeamMembersPage from '../teamMembers/TeamMembersPage';
import SettingsPage from '../Settings';
import DatabasePage from '../database/databasePage';
import moment from 'moment';
import { useAuth } from '../../contexts/AuthContext';

function MainLayout() {
	const [selectedDate, setSelectedDate] = useState(moment());
	const { currentUser } = useAuth();

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

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
			<Box sx={{ display: 'flex', flexGrow: 1 }}>
				<MiniDrawer
					open={isDrawerOpen}
					handleDrawerClose={handleDrawerToggle}
					setSelectedMenu={setSelectedMenu}
				/>
				<Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
					<CustAppBar open={isDrawerOpen} handleDrawerToggle={handleDrawerToggle} />
					<Box component="main" sx={{ flexGrow: 1, p: { xs: 2, sm: 3 } }}>
						{renderSelectedComponent()}
					</Box>
				</Box>
			</Box>
		</Box>
	);
}

export default MainLayout;