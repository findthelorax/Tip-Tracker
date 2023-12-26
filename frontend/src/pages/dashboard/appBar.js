// AppBar.js
import React from 'react';
import { AppBar, Toolbar, IconButton, InputBase, Badge, Avatar, Divider } from '@mui/material';
import { Search as SearchIcon, Notifications as NotificationsIcon, Settings as SettingsIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';

function CustAppBar() {
	return (
		<AppBar position="static">
			<Toolbar>
				<IconButton edge="start" color="inherit">
					<SearchIcon />
				</IconButton>
				<InputBase
					placeholder="Search…"
					inputProps={{ 'aria-label': 'search' }}
				/>
				<IconButton color="inherit" component={Link} to="/notifications">
					<Badge badgeContent={4} color="error">
						<NotificationsIcon />
					</Badge>
				</IconButton>
				<IconButton color="inherit" component={Link} to="/profile">
					<Avatar alt="Profile Picture" src="/static/images/avatar/1.jpg" />
				</IconButton>
				<Divider orientation="vertical" flexItem />
				<IconButton color="inherit" component={Link} to="/settings">
					<SettingsIcon />
				</IconButton>
			</Toolbar>
		</AppBar>
	);
}

export default CustAppBar;