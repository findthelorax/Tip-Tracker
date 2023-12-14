import React from 'react';
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
    return (
        <Grid container>
            <Grid item xs={2}>
                <Drawer variant="permanent" anchor="left" style={{ backgroundColor: '#f4f4f4' }}>
                    <Typography variant="h6">Menu</Typography>
                    <List>
                        <ListItem button>
                            <ListItemIcon><PeopleIcon /></ListItemIcon>
                            <ListItemText primary="Team Members" />
                        </ListItem>
                        <ListItem button>
                            <ListItemIcon><SettingsIcon /></ListItemIcon>
                            <ListItemText primary="Settings" />
                        </ListItem>
                        <ListItem button>
                            <ListItemIcon><StorageIcon /></ListItemIcon>
                            <ListItemText primary="Database" />
                        </ListItem>
                        <Divider />
                        <ListItem button>
                            <ListItemIcon><BarChartIcon /></ListItemIcon>
                            <ListItemText primary="Totals" />
                        </ListItem>
                    </List>
                </Drawer>
            </Grid>
            <Grid item xs={10}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Header />
                    </Grid>
                    <Grid item xs={6}>
                        <DatabaseOperations />
                    </Grid>
                    <Grid item xs={12}>
                        <TeamOperations />
                    </Grid>
                    <Grid item xs={12}>
                        <DailyTotals refresh={refresh} />
                    </Grid>
                    <Grid item xs={12}>
                        <WeeklyTotals team={team} refresh={refresh} />
                    </Grid>
                    <Grid item xs={12}>
                        <TipsCard team={team} refresh={refresh}/>
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