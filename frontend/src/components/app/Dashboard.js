import React, { useState } from 'react';
import { Grid, GridCol, Paper, Text, List, ListItem, Divider } from '@mantine/core';
import { FaTachometerAlt, FaUsers, FaDatabase, FaCog, FaChartBar } from 'react-icons/fa';
import Header from './header';
import TeamOperations from '../teamMembers';
import DatabaseOperations from '../databaseOps';
import { WeeklyTotals, TipsCard } from '../weeklyTotals';
import DailyTotals from '../dailyTotals';
import ErrorComponent from '../utils/errorComponent';
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
        <Grid gutter="md">
            <GridCol span={2}>
                <Paper padding="md" style={{ height: '100vh' }}>
                    <Text size="xl">Menu</Text>
                    <List>
                        <ListItem onClick={() => setSelectedMenu('Dashboard')}>
                            <FaTachometerAlt /> Dashboard
                        </ListItem>
                        <ListItem onClick={() => setSelectedMenu('Team Members')}>
                            <FaUsers /> Team Members
                        </ListItem>
                        <ListItem onClick={() => setSelectedMenu('Totals')}>
                            <FaChartBar /> Totals
                        </ListItem>
                        <Divider />
                        <ListItem onClick={() => setSelectedMenu('Database')}>
                            <FaDatabase /> Database
                        </ListItem>
                        <ListItem onClick={() => setSelectedMenu('Settings')}>
                            <FaCog /> Settings
                        </ListItem>
                    </List>
                </Paper>
            </GridCol>
            <GridCol span={10}>
                <div style={{ padding: '1rem' }}>
                    <Header />
                    {renderSelectedComponent()}
                    <ErrorComponent error={error} />
                    {/* Add extra pages here */}
                </div>
            </GridCol>
        </Grid>
    );
}

export default Dashboard;