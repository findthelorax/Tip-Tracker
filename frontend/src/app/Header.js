import React from 'react';
import { Typography, Toolbar } from '@mui/material';
import ResponsiveAppBar from './appBar';

function Header() {
    return (
        <ResponsiveAppBar position="static">
            <Toolbar>
                <Typography variant="h6">
                    Restaurant Team Management
                </Typography>
            </Toolbar>
        </ResponsiveAppBar>
    );
};

export default Header;