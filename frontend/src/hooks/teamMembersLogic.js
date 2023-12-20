import { addTeamMember, deleteTeamMember } from '../utils/api';

export const addTeamMemberToTeam = (teamMemberName, position, setTeam, clearInputs) => {
	return async () => {
		if (teamMemberName && position) {
			try {
				const newMember = await addTeamMember(teamMemberName, position);
				setTeam((prevTeam) => [...prevTeam, newMember]);
				clearInputs();
			} catch (error) {
				console.error('Error adding team member:', error);
				alert('Failed to add team member');
			}
		} else {
			alert('Please enter both name and position');
		}
	};
};

export const deleteTeamMemberFromTeam = (setTeam) => {
	return async (id, teamMemberName, position) => {
		const confirmation = window.confirm(
			`ARE YOU SURE YOU WANT TO DELETE:\n\n${
				teamMemberName ? teamMemberName.toUpperCase() : 'Unknown'
			} - ${position}?`
		);
		if (!confirmation) {
			return;
		}

		try {
			await deleteTeamMember(id);
			setTeam((prevTeam) => prevTeam.filter((member) => member._id !== id));
		} catch (error) {
			console.error('Error deleting team member:', error);
			alert('Failed to delete team member');
		}
	};
};