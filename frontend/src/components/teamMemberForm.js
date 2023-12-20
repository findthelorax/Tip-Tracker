import React, { useState, useContext } from 'react';
import { TeamContext } from '../contexts/TeamContext';
import { addTeamMemberToTeam } from '../hooks/teamMembersLogic';
import TeamMemberFormRender from '../sections/teamMembers/teamMembersFormRender';

function TeamMemberForm() {
    const { setTeam } = useContext(TeamContext);
    const [teamMemberName, setTeamMemberName] = useState('');
    const [position, setPosition] = useState('bartender');
    
    const clearInputs = () => {
        setTeamMemberName('');
        setPosition('server');
    };
    
    const addTeamMember = addTeamMemberToTeam(teamMemberName, position, setTeam, clearInputs);

    return (
        <TeamMemberFormRender
            teamMemberName={teamMemberName}
            setTeamMemberName={setTeamMemberName}
            position={position}
            setPosition={setPosition}
            addTeamMember={addTeamMember}
        />
    );
}

export default TeamMemberForm;