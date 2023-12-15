import React, { useState } from 'react';
import { Grid, Drawer, Typography, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import Header from './header';
import TeamOperations from '../teamMembers';
import TeamMembersPage from './TeamMembersPage';
import DatabaseOperations from '../databaseOps';
import { WeeklyTotals, TipsCard } from '../weeklyTotals';
import DailyTotals from '../dailyTotals';
import ErrorComponent from '../utils/errorComponent';
import People from '@mui/icons-material/People';
import Settings from '@mui/icons-material/Settings';
import Storage from '@mui/icons-material/Storage';
import BarChart from '@mui/icons-material/BarChart';
import { TeamContext } from '../contexts/TeamContext';
import SettingsPage from './Settings';

function Dashboard({ refresh, error }) {
    const { team } = React.useContext(TeamContext);
    const [selectedMenu, setSelectedMenu] = useState('Dashboard'); // default selected menu

    const renderSelectedComponent = () => {
        switch(selectedMenu) {
            case 'Dashboard':
                return (
                    <Grid container spacing={3}>
                        <Grid item xs={12} style={{ marginBottom: '20px' }}>
                            <TeamOperations />
                        </Grid>
                        <Grid item xs={12} style={{ marginBottom: '20px' }}>
                            <DailyTotals refresh={refresh} />
                        </Grid>
                        <Grid item xs={12} style={{ marginBottom: '20px' }}>
                            <WeeklyTotals team={team} refresh={refresh} />
                        </Grid>
                        <Grid item xs={12} style={{ marginBottom: '20px' }}>
                            <TipsCard team={team} refresh={refresh}/>
                        </Grid>
                    </Grid>
                );
            case 'Team Members':
                return <TeamMembersPage />;
            case 'Database':
                return <DatabaseOperations />;
            case 'Settings':
                return <SettingsPage />;
            // Add other cases for other menu items
            default:
                return null;
        }
    }

    return (
        <Grid container>
            <Grid item xs={2}>
                <Drawer variant="permanent" anchor="left" style={{ backgroundColor: '#f4f4f4' }}>
                    <Typography variant="h6">Menu</Typography>
                    <List>
                    <ListItem button onClick={() => setSelectedMenu('Dashboard')}>
                            <ListItemIcon><People /></ListItemIcon>
                            <ListItemText primary="Dashboard" />
                        </ListItem>
                        <ListItem button onClick={() => setSelectedMenu('Team Members')}>
                            <ListItemIcon><People /></ListItemIcon>
                            <ListItemText primary="Team Members" />
                        </ListItem>
                        <ListItem button onClick={() => setSelectedMenu('Totals')}>
                            <ListItemIcon><BarChart /></ListItemIcon>
                            <ListItemText primary="Totals" />
                        </ListItem>
                        <Divider />
                        <ListItem button onClick={() => setSelectedMenu('Database')}>
                            <ListItemIcon><Storage /></ListItemIcon>
                            <ListItemText primary="Database" />
                        </ListItem>
                        <ListItem button onClick={() => setSelectedMenu('Settings')}>
                            <ListItemIcon><Settings /></ListItemIcon>
                            <ListItemText primary="Settings" />
                        </ListItem>
                    </List>
                </Drawer>
            </Grid>
            <Grid item xs={10}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Header />
                    </Grid>
                    <Grid item xs={12}>
                        {renderSelectedComponent()}
                    </Grid>
                    <Grid item xs={12}>
                        <ErrorComponent error={error} />
                    </Grid>
                    {/* Add extra pages here */}
                </Grid>
            </Grid>
        </Grid>
    );
}

export default Dashboard;