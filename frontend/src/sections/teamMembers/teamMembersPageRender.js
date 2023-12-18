import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {
    Box,
    IconButton,
    Grid,
    Card,
    CardContent,
    Typography,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import FolderIcon from '@mui/icons-material/Folder';
import TeamMemberForm from './teamMembersForm';

const POSITIONS = ['bartender', 'host', 'server', 'runner'];

const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);

const TeamMembersPageRender = ({
    teamMemberName,
    setTeamMemberName,
    position,
    setPosition,
    addMember,
    deleteMember,
    teamByPosition,
    team,
    columns,
}) => {
    return (
        <Box sx={{ flexGrow: 1, maxWidth: 752 }}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <TeamMemberForm
                        teamMemberName={teamMemberName}
                        setTeamMemberName={setTeamMemberName}
                        position={position}
                        setPosition={setPosition}
                        addTeamMember={addMember}
                    />
                    {POSITIONS.map((position) => (
                        <Box key={position} sx={{ marginBottom: 2 }}>
                            <Card
                                sx={{
                                    backgroundColor: 'white',
                                    border: '1px solid black',
                                    boxShadow: '2px 2px 0px 0px black',
                                    borderRadius: '15px',
                                }}
                            >
                                <CardContent>
                                    <Typography variant="h6" component="div">
                                        {capitalizeFirstLetter(position)}
                                    </Typography>
                                    {teamByPosition[position].map((member) => (
                                        <ListItem
                                            key={member._id}
                                            secondaryAction={
                                                <IconButton
                                                    edge="end"
                                                    aria-label="delete"
                                                    onClick={() =>
                                                        deleteMember(member._id, member.teamMemberName, member.position)
                                                    }
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            }
                                        >
                                            <ListItemAvatar>
                                                <Avatar>
                                                    <FolderIcon />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={
                                                    member.teamMemberName
                                                        ? capitalizeFirstLetter(member.teamMemberName)
                                                        : 'Unknown'
                                                }
                                                secondary={member.position}
                                            />
                                        </ListItem>
                                    ))}
                                </CardContent>
                            </Card>
                        </Box>
                    ))}
                    <Box sx={{ height: 400, width: '100%' }}>
                        <DataGrid
                            rows={team}
                            columns={columns}
                            pageSize={5}
                            rowsPerPageOptions={[5]}
                            getRowId={(row) => row._id}
                            getRowClassName={(params) =>
                                params.rowIndex % 2 === 0 ? 'datagrid-row-even' : 'datagrid-row-odd'
                            }
                            pagination
                        />
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default TeamMembersPageRender;