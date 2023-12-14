import React from 'react';
import { TextInput, Select, Button, GridCol, Paper } from '@mantine/core';

const POSITIONS = ['Bartender', 'Runner', 'Server', 'Host'];

function TeamMemberForm({
    teamMemberName,
    setTeamMemberName,
    position,
    setPosition,
    addTeamMember,
}) {
    const handleSubmit = (event) => {
        event.preventDefault();
        addTeamMember();
    };

    return (
        <Paper padding="md" style={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <TextInput
                id="teamMemberName"
                label="Name"
                placeholder="Enter name"
                value={teamMemberName}
                onChange={(e) => setTeamMemberName(e.currentTarget.value)}
                style={{ marginBottom: '1rem' }}
            />
            <Select
                label="Position"
                id="position"
                value={position}
                onChange={(value) => setPosition(value)}
                data={POSITIONS.map((position) => ({ value: position.toLowerCase(), label: position }))}
                style={{ marginBottom: '1rem' }}
            />
            <GridCol style={{ marginTop: '1rem' }}>
                <Button color="blue" onClick={handleSubmit}>
                    Add to Team
                </Button>
            </GridCol>
        </Paper>
    );
}

export default TeamMemberForm;