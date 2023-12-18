// TeamMembersRender.js
import React from 'react';
import {
    Card,
    CardContent,
    Box,
    Grid,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
    IconButton,
    Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import FolderIcon from '@mui/icons-material/Folder';

const POSITIONS = ['bartender', 'host', 'server', 'runner'];

const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);

function TeamMembersRender({ teamByPosition, deleteMember }) {
    return (
        <Card
            sx={{
                minWidth: 275,
                marginBottom: 2,
                backgroundColor: 'lightblue',
                border: '1px solid black',
                boxShadow: '2px 2px 0px 0px black',
                borderRadius: '15px',
            }}
        >
            <CardContent>
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
                                                    deleteMember(
                                                        member._id,
                                                        member.teamMemberName,
                                                        member.position
                                                    )
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
            </CardContent>
        </Card>
    );
}

export default TeamMembersRender;