import React from 'react';
import { TextField, FormControl, InputLabel, Select, MenuItem, Button, Box, Card, CardContent } from '@mui/material';

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
        <Card
            sx={{
                minWidth: 275,
                backgroundColor: 'lightblue',
                border: '1px solid black',
                boxShadow: '2px 2px 0px 0px black',
                borderRadius: '15px',
            }}
        >
            <CardContent>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        padding: 2,
                        backgroundColor: '#f5f5f5',
                        border: '1px solid black',
                        boxShadow: '2px 2px 0px 0px black',
                        borderRadius: '15px',
                    }}
                >
                    <TextField
                        id="teamMemberName"
                        label="Name"
                        placeholder="Enter name"
                        value={teamMemberName}
                        onChange={(e) => setTeamMemberName(e.target.value)}
                        fullWidth
                        margin="normal"
                        sx={{ margin: 1 }}
                    />
                    <FormControl fullWidth margin="normal" sx={{ margin: 1 }}>
                        <InputLabel id="position">Position</InputLabel>
                        <Select
                            labelId="position"
                            id="position"
                            value={position}
                            onChange={(e) => setPosition(e.target.value)}
                        >
                            <MenuItem value="" disabled>
                                Select a position
                            </MenuItem>
                            {POSITIONS.map((position) => (
                                <MenuItem key={position} value={position.toLowerCase()}>
                                    {position}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Box mt={2}>
                        <Button variant="contained" color="primary" type="submit">
                            Add to Team
                        </Button>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
}

export default TeamMemberForm;