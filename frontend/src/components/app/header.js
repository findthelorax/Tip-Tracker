import React from 'react';
import { Paper, Grid, GridCol, Text } from '@mantine/core';

function Header() {
    return (
        <Paper padding="md" style={{ marginBottom: '1rem' }}>
            <Grid>
                <GridCol>
                    <Text size="xl" align="center">
                        Restaurant Team Management
                    </Text>
                </GridCol>
            </Grid>
        </Paper>
    );
};

export default Header;