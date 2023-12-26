import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import StorageIcon from '@mui/icons-material/Storage';
import SettingsIcon from '@mui/icons-material/Settings';
import AssignmentIcon from '@mui/icons-material/Assignment';

export const MainListItems = ({ setSelectedMenu }) => (
	<React.Fragment>
		<ListItemButton onClick={() => setSelectedMenu('Dashboard')}>
			<ListItemIcon>
				<DashboardIcon />
			</ListItemIcon>
			<ListItemText primary="Dashboard" />
		</ListItemButton>
		<ListItemButton onClick={() => setSelectedMenu('Team Members')}>
			<ListItemIcon>
				<PeopleIcon />
			</ListItemIcon>
			<ListItemText primary="Team Members" />
		</ListItemButton>
		<ListItemButton onClick={() => setSelectedMenu('Totals')}>
			<ListItemIcon>
				<BarChartIcon />
			</ListItemIcon>
			<ListItemText primary="Totals" />
		</ListItemButton>
	</React.Fragment>
);

export const SecondaryListItems = ({ setSelectedMenu }) => (
	<React.Fragment>
		<ListSubheader component="div" sx={{paddingLeft: 0}}>Reports</ListSubheader>
		<ListItemButton >
			<ListItemIcon >
				<AssignmentIcon />
			</ListItemIcon>
			<ListItemText primary="Current month" />
		</ListItemButton>
		<ListItemButton>
			<ListItemIcon>
				<AssignmentIcon />
			</ListItemIcon>
			<ListItemText primary="Last quarter" />
		</ListItemButton>
		<ListItemButton>
			<ListItemIcon>
				<AssignmentIcon />
			</ListItemIcon>
			<ListItemText primary="Year-end sale" />
		</ListItemButton>
	</React.Fragment>
);

export const SettingsListItems = ({ setSelectedMenu }) => (
	<React.Fragment>
		<ListSubheader component="div" sx={{paddingLeft: 0}}>Settings</ListSubheader>
		<ListItemButton onClick={() => setSelectedMenu('Database')}>
			<ListItemIcon>
				<StorageIcon />
			</ListItemIcon>
			<ListItemText primary="Database" />
		</ListItemButton>
		<ListItemButton onClick={() => setSelectedMenu('Settings')}>
			<ListItemIcon>
				<SettingsIcon />
			</ListItemIcon>
			<ListItemText primary="Settings" />
		</ListItemButton>
	</React.Fragment>
);
