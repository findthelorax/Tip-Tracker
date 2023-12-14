import React, { useState } from 'react';
import { Grid, Drawer, Typography, List, ListItem, ListItemIcon, ListItemText, Divider } from '@material-ui/core';
import Header from './header';
import TeamOperations from '../teamMembers';
import DatabaseOperations from '../databaseOps';
import { WeeklyTotals, TipsCard } from '../weeklyTotals';
import DailyTotals from '../dailyTotals';
import ErrorComponent from '../utils/errorComponent';
import PeopleIcon from '@material-ui/icons/People';
import SettingsIcon from '@material-ui/icons/Settings';
import StorageIcon from '@material-ui/icons/Storage';
import BarChartIcon from '@material-ui/icons/BarChart';
import { TeamContext } from '../contexts/TeamContext';

function Dashboard({ refresh, error }) {
    const { team } = React.useContext(TeamContext);
    const [selectedMenu, setSelectedMenu] = useState('Dashboard'); // default selected menu

    const renderSelectedComponent = () => {
        switch(selectedMenu) {
            case 'Dashboard':
                return (
                    <>
                        <TeamOperations />
                        <DailyTotals refresh={refresh} />
                        <WeeklyTotals team={team} refresh={refresh} />
                        <TipsCard team={team} refresh={refresh}/>
                    </>
                );
            case 'Team Members':
                return <TeamOperations />;
            case 'Database':
                return <DatabaseOperations />;
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
                            <ListItemIcon><PeopleIcon /></ListItemIcon>
                            <ListItemText primary="Dashboard" />
                        </ListItem>
                        <ListItem button onClick={() => setSelectedMenu('Team Members')}>
                            <ListItemIcon><PeopleIcon /></ListItemIcon>
                            <ListItemText primary="Team Members" />
                        </ListItem>
                        <ListItem button onClick={() => setSelectedMenu('Totals')}>
                            <ListItemIcon><BarChartIcon /></ListItemIcon>
                            <ListItemText primary="Totals" />
                        </ListItem>
                        <Divider />
                        <ListItem button onClick={() => setSelectedMenu('Database')}>
                            <ListItemIcon><StorageIcon /></ListItemIcon>
                            <ListItemText primary="Database" />
                        </ListItem>
                        <ListItem button onClick={() => setSelectedMenu('Settings')}>
                            <ListItemIcon><SettingsIcon /></ListItemIcon>
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