import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import MuiAppBar from '@mui/material/AppBar';
import { Menu, Badge, Notifications } from '@mui/icons-material';
import { Avatar, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';

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
// position fixed
export default function CustomAppBar({ open, handleDrawerToggle }) {
	return (
		<AppBar position="absolute" open={open} sx={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
			<Toolbar
				sx={{
					pr: '24px',
					minHeight: '48px',
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
					Welcome
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
		</AppBar>
	);
};