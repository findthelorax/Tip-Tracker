import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { MainListItems, SecondaryListItems, SettingsListItems } from './navItemsList';
import { IconButton, Divider, Box } from '@mui/material';

const drawerWidth = 240;

const DrawerHeader = styled('div')(({ theme }) => ({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'flex-end',
	padding: theme.spacing(0, 1),
	...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
	width: drawerWidth,
	flexShrink: 0,
	whiteSpace: 'nowrap',
	boxSizing: 'border-box',
	...(open && {
		width: drawerWidth,
		transition: theme.transitions.create('width', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
		overflowX: 'hidden',
		'& .MuiDrawer-paper': {
			width: drawerWidth,
			transition: theme.transitions.create('width', {
				easing: theme.transitions.easing.sharp,
				duration: theme.transitions.duration.enteringScreen,
			}),
			overflowX: 'hidden',
		},
	}),
	...(!open && {
		transition: theme.transitions.create('width', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
		overflowX: 'hidden',
		width: `calc(${theme.spacing(7)} + 1px)`,
		[theme.breakpoints.up('sm')]: {
			width: `calc(${theme.spacing(9)} + 1px)`,
		},
		'& .MuiDrawer-paper': {
			transition: theme.transitions.create('width', {
				easing: theme.transitions.easing.sharp,
				duration: theme.transitions.duration.leavingScreen,
			}),
			overflowX: 'hidden',
			width: `calc(${theme.spacing(7)} + 1px)`,
			[theme.breakpoints.up('sm')]: {
				width: `calc(${theme.spacing(9)} + 1px)`,
			},
		},
	}),
}));

export default function MiniDrawer({ open, handleDrawerClose, setSelectedMenu }) {
	const theme = useTheme();

	return (
		<Box sx={{ display: 'flex' }}>
			<Drawer variant="permanent" open={open}>
				<DrawerHeader>
					<IconButton onClick={handleDrawerClose}>
						{theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
					</IconButton>
				</DrawerHeader>
				<Divider />
				<Box>
					<MainListItems setSelectedMenu={setSelectedMenu} />
				</Box>
				<Divider />
				<Box>
					<SecondaryListItems setSelectedMenu={setSelectedMenu} />
				</Box>
				<Divider />
				<Box>
					<SettingsListItems setSelectedMenu={setSelectedMenu} />
				</Box>
			</Drawer>
		</Box>
	);
}